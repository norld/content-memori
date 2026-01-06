import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { updateSceneBreakdownSchema } from '@/lib/schemas/scene-breakdown';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const runtime = 'edge';

export async function PUT(req: NextRequest) {
  try {
    // Get auth token from header
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);

    // Create Supabase client with access token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    const body = await req.json();
    const { ideaId, content } = updateSceneBreakdownSchema.parse(body);

    // Verify idea exists
    const { data: idea } = await supabase
      .from('ideas')
      .select('id')
      .eq('id', ideaId)
      .single();

    if (!idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }

    // Update scene_breakdown only (do NOT update scene_breakdown_generated_at for manual edits)
    const { error } = await supabase
      .from('ideas')
      .update({
        scene_breakdown: content,
      })
      .eq('id', ideaId);

    if (error) {
      console.error('Failed to update scene breakdown:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error: any) {
    console.error('Update error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request: ' + error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update scene breakdown' },
      { status: 500 }
    );
  }
}

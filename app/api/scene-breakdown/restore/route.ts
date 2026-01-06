import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { restoreSceneBreakdownSchema } from '@/lib/schemas/scene-breakdown';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
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
    const { ideaId, version } = restoreSceneBreakdownSchema.parse(body);

    // Verify idea exists
    const { data: idea } = await supabase
      .from('ideas')
      .select('id, user_id')
      .eq('id', ideaId)
      .single();

    if (!idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }

    // Get the history entry to restore
    const { data: historyEntry, error: historyError } = await supabase
      .from('scene_breakdown_history')
      .select('content')
      .eq('idea_id', ideaId)
      .eq('version', version)
      .single();

    if (historyError || !historyEntry) {
      return NextResponse.json(
        { error: 'Scene breakdown version not found' },
        { status: 404 }
      );
    }

    // Restore content to ideas table (do NOT create new history entry)
    const { error: updateError } = await supabase
      .from('ideas')
      .update({
        scene_breakdown: historyEntry.content,
        scene_breakdown_generated_at: null, // Restored, not regenerated
      })
      .eq('id', ideaId);

    if (updateError) {
      console.error('Failed to restore scene breakdown:', updateError);
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      content: historyEntry.content,
    });

  } catch (error: any) {
    console.error('Restore error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request: ' + error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to restore scene breakdown' },
      { status: 500 }
    );
  }
}

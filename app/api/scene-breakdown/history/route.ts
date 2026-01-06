import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSceneBreakdownHistorySchema } from '@/lib/schemas/scene-breakdown';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    // Get auth token from header
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json(
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

    const { searchParams } = new URL(req.url);
    const { ideaId, limit = 50, offset = 0 } = getSceneBreakdownHistorySchema.parse({
      ideaId: Number(searchParams.get('ideaId')),
      limit: Number(searchParams.get('limit')),
      offset: Number(searchParams.get('offset')),
    });

    // Get total count
    const { count } = await supabase
      .from('scene_breakdown_history')
      .select('*', { count: 'exact', head: true })
      .eq('idea_id', ideaId);

    // Fetch history with pagination
    const { data: versions, error } = await supabase
      .from('scene_breakdown_history')
      .select('*')
      .eq('idea_id', ideaId)
      .order('generated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Failed to fetch history:', error);
      throw error;
    }

    return Response.json({
      versions: versions || [],
      total: count || 0,
    });

  } catch (error: any) {
    console.error('History fetch error:', error);

    if (error.name === 'ZodError') {
      return Response.json(
        { error: 'Invalid request: ' + error.errors[0].message },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

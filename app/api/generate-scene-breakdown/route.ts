import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateSceneBreakdown } from '@/lib/openai';
import { generateSceneBreakdownSchema } from '@/lib/schemas/scene-breakdown';
import { detectLanguage } from '@/lib/utils/language-detection';

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
    const { ideaId, script, language: userLanguage, customPrompt, patterns } = body;

    // Detect language if not provided
    const language = userLanguage || detectLanguage(script);

    // Get the idea to verify ownership (RLS will enforce this)
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

    // Check and deduct 1 coin
    let { data: userData, error: fetchError } = await supabase
      .from('user_coins')
      .select('coins')
      .eq('user_id', idea.user_id)
      .single();

    // If no coins exist, create them with default 10 coins
    if (fetchError || !userData) {
      console.log('No coins found for user, creating with default 10 coins');

      const { data: newData, error: insertError } = await supabase
        .from('user_coins')
        .insert({ user_id: idea.user_id, coins: 10 })
        .select('coins')
        .single();

      if (insertError) {
        console.error('Error creating user coins:', insertError);
        return NextResponse.json(
          { error: 'Failed to create coins' },
          { status: 500 }
        );
      }

      userData = newData;
    }

    const currentCoins = userData?.coins || 0;

    // Check if user has enough coins
    if (currentCoins < 1) {
      return NextResponse.json(
        { error: 'Insufficient coins. You need at least 1 coin to generate scene breakdown.' },
        { status: 402 }
      );
    }

    // Deduct 1 coin
    const { error: coinUpdateError } = await supabase
      .from('user_coins')
      .update({ coins: currentCoins - 1 })
      .eq('user_id', idea.user_id);

    if (coinUpdateError) {
      console.error('Error deducting coins:', coinUpdateError);
      return NextResponse.json(
        { error: 'Failed to deduct coins' },
        { status: 500 }
      );
    }

    // Generate scene breakdown with custom config
    const content = await generateSceneBreakdown(script, language, customPrompt, patterns);

    // Get current version number
    const { data: history } = await supabase
      .from('scene_breakdown_history')
      .select('version')
      .eq('idea_id', ideaId)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextVersion = (history?.version ?? 0) + 1;

    // Save to history
    const { error: historyError } = await supabase
      .from('scene_breakdown_history')
      .insert({
        idea_id: ideaId,
        user_id: idea.user_id,
        content,
        version: nextVersion,
      });

    if (historyError) {
      console.error('Failed to save history:', historyError);
      throw historyError;
    }

    // Update ideas table
    const { error: ideaUpdateError } = await supabase
      .from('ideas')
      .update({
        scene_breakdown: content,
        scene_breakdown_generated_at: new Date().toISOString(),
      })
      .eq('id', ideaId);

    if (ideaUpdateError) {
      console.error('Failed to update idea:', ideaUpdateError);
      throw ideaUpdateError;
    }

    return NextResponse.json({
      success: true,
      content,
      coins: currentCoins - 1,
    });

  } catch (error: any) {
    console.error('Generation error:', error);

    // Handle specific error types
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request: ' + error.errors[0].message },
        { status: 400 }
      );
    }

    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    if (error.status === 500 || error.code === 'ECONNRESET') {
      return NextResponse.json(
        { error: 'AI service error. Please try again.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate scene breakdown' },
      { status: 500 }
    );
  }
}

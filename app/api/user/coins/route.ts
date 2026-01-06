import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const runtime = 'edge';

// GET - Fetch user coin balance
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accessToken = authHeader.substring(7);

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    // Get user from JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Fetch user coins
    let { data: userData, error } = await supabase
      .from('user_coins')
      .select('coins')
      .eq('user_id', user.id)
      .single();

    // If no coins exist, create them with default 10 coins
    if (error || !userData) {
      console.log('No coins found for user, creating with default 10 coins');

      const { data: newData, error: insertError } = await supabase
        .from('user_coins')
        .insert({ user_id: user.id, coins: 10 })
        .select('coins')
        .single();

      if (insertError) {
        console.error('Error creating user coins:', insertError);
        return NextResponse.json({ error: 'Failed to create coins' }, { status: 500 });
      }

      userData = newData;
    }

    if (error) {
      console.error('Error fetching coins:', error);
      return NextResponse.json({ error: 'Failed to fetch coins' }, { status: 500 });
    }

    return NextResponse.json({
      coins: userData?.coins || 0,
    });

  } catch (error: any) {
    console.error('Get coins error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
    const { data: userData, error } = await supabase
      .from('users')
      .select('coins')
      .eq('id', user.id)
      .single();

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

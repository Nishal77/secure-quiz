import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    // Call edge function to get server time
    const { data, error } = await supabase.functions.invoke('server-time')

    if (error) {
      return NextResponse.json(
        { error: 'Failed to get server time' },
        { status: 500 }
      )
    }

    return NextResponse.json({ serverTime: data.serverTime })
  } catch (error) {
    console.error('Server time error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Try to use service role for admin operations, fallback to anon
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch vehicles and join with hosts table
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select(`
        id,
        make,
        model,
        model_year,
        registration_number,
        available_status,
        location_name,
        host_id,
        hosts (
          id,
          full_name,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cars:', error);
      return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: vehicles
    });

  } catch (error) {
    console.error('Unexpected error in cars API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

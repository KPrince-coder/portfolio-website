import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { project_id } = await req.json();

    if (!project_id) {
      return new Response(
        JSON.stringify({ error: 'Project ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upsert analytics record
    const { data, error } = await supabase
      .from('project_analytics')
      .upsert(
        {
          project_id,
          view_count: 1,
          last_viewed_at: new Date().toISOString(),
        },
        {
          onConflict: 'project_id',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (error) {
      // If record exists, increment view count
      const { data: existing } = await supabase
        .from('project_analytics')
        .select('view_count')
        .eq('project_id', project_id)
        .single();

      if (existing) {
        await supabase
          .from('project_analytics')
          .update({
            view_count: existing.view_count + 1,
            last_viewed_at: new Date().toISOString(),
          })
          .eq('project_id', project_id);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error tracking view:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to track view',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
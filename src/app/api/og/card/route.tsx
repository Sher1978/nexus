import { ImageResponse } from 'next/og';
import { supabase } from '@/lib/supabaseClient';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response('Missing ID', { status: 400 });
    }

    // Fetch agent data
    const { data: agent, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !agent) {
      return new Response('Agent not found', { status: 404 });
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #000 100%)',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            padding: '40px',
            position: 'relative',
          }}
        >
          {/* Neural Grid Background Overlay */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, backgroundImage: 'linear-gradient(#00f2ff 1px, transparent 1px), linear-gradient(90deg, #00f2ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          {/* Glass Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '90%',
              backgroundColor: 'rgba(15, 15, 25, 0.8)',
              border: '2px solid rgba(0, 242, 255, 0.3)',
              borderRadius: '40px',
              padding: '40px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', color: '#00f2ff', fontWeight: 'bold', letterSpacing: '2px' }}>SHADOW CODE // NEXUS</span>
                <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff' }}>IDENTITY CARD</span>
              </div>
              <div style={{ padding: '8px 16px', backgroundColor: 'rgba(0, 242, 255, 0.2)', borderRadius: '12px', border: '1px solid #00f2ff', fontSize: '12px', color: '#00f2ff', fontWeight: 'bold' }}>
                V1.0.26
              </div>
            </div>

            {/* Profile Info */}
            <div style={{ display: 'flex', gap: '30px' }}>
              {/* Photo Placeholder */}
              <div style={{ width: '120px', height: '120px', borderRadius: '30px', backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid #d4af37', opacity: 0.5 }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Agent Name</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{agent.full_name || 'REDACTED'}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Archetype Cluster</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#d4af37' }}>{agent.archetype || 'UNIDENTIFIED'}</span>
                </div>
              </div>
            </div>

            {/* Footer / ID */}
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>NEURAL ID PARSED:</span>
                <span style={{ fontSize: '14px', fontFamily: 'monospace', color: 'rgba(0, 242, 255, 0.6)' }}>{agent.id}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00FF94' }} />
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#00FF94' }}>ACTIVE STATUS</span>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 600,
        height: 400,
      }
    );
  } catch (e: any) {
    console.error(e.message);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}

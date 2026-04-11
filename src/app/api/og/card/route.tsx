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
            padding: '20px',
            position: 'relative',
          }}
        >
          {/* Neural Grid Background Overlay */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, backgroundImage: 'linear-gradient(#00f2ff 1px, transparent 1px), linear-gradient(90deg, #00f2ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          {/* Glass Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '95%',
              height: '90%',
              backgroundColor: 'rgba(15, 15, 25, 0.9)',
              border: '2px solid rgba(0, 242, 255, 0.4)',
              borderRadius: '40px',
              padding: '0',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Left Info Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '55%', padding: '40px', borderRight: '1px solid rgba(0, 242, 255, 0.2)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '30px' }}>
                <span style={{ fontSize: '12px', color: '#00f2ff', fontWeight: 'bold', letterSpacing: '3px' }}>SHADOW CODE // NEXUS</span>
                <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>IDENTITY CARD</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Agent Name</span>
                  <span style={{ fontSize: '22px', fontWeight: 'bold' }}>{agent.full_name || 'REDACTED'}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Archetype Cluster</span>
                  <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#d4af37' }}>{agent.archetype || 'UNIDENTIFIED'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>NEURAL ID:</span>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'rgba(0, 242, 255, 0.6)' }}>{agent.id}</span>
              </div>
            </div>

            {/* Right QR Panel - MAX VISIBILITY */}
            <div style={{ width: '45%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)', position: 'relative' }}>
              {/* Scan Brackets */}
              <div style={{ position: 'absolute', top: '20px', left: '20px', width: '30px', height: '30px', borderTop: '4px solid #00f2ff', borderLeft: '4px solid #00f2ff' }} />
              <div style={{ position: 'absolute', top: '20px', right: '20px', width: '30px', height: '30px', borderTop: '4px solid #00f2ff', borderRight: '4px solid #00f2ff' }} />
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '30px', height: '30px', borderBottom: '4px solid #00f2ff', borderLeft: '4px solid #00f2ff' }} />
              <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '30px', height: '30px', borderBottom: '4px solid #00f2ff', borderRight: '4px solid #00f2ff' }} />

              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                padding: '12px', 
                backgroundColor: '#fff', 
                borderRadius: '24px',
                boxShadow: '0 0 30px rgba(0, 242, 255, 0.5)'
              }}>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://t.me/humanexusbot?start=inspect_${agent.id}`)}`}
                  alt="QR"
                  style={{ width: '220px', height: '220px' }}
                />
              </div>
              <span style={{ fontSize: '10px', color: '#00f2ff', fontWeight: 'bold', marginTop: '15px', letterSpacing: '2px' }}>NEURAL SCAN TARGET</span>
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

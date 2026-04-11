'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useRouter } from 'next/navigation';
import { getTelegramWebApp } from '@/lib/telegram';

export default function ScanPage() {
  const [error, setError] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') => {
    const webApp = getTelegramWebApp();
    if (webApp && webApp.HapticFeedback) {
      if (type === 'success' || type === 'warning' || type === 'error') {
        webApp.HapticFeedback.notificationOccurred(type);
      } else {
        webApp.HapticFeedback.impactOccurred(type);
      }
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    let finalUrl = '';
    
    if (decodedText.includes('t.me/humanexusbot?start=')) {
      finalUrl = decodedText;
    } else if (decodedText.startsWith('nexus:id:')) {
      const legacyId = decodedText.replace('nexus:id:', '');
      finalUrl = `https://t.me/humanexusbot?start=scan_${legacyId}`;
    }

    if (finalUrl) {
      triggerHaptic('success');
      const webApp = getTelegramWebApp();
      
      const finishRedirect = () => {
        if (webApp && webApp.openTelegramLink) {
          webApp.openTelegramLink(finalUrl);
          webApp.close(); 
        } else {
          window.location.href = finalUrl;
        }
      };

      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().then(finishRedirect).catch(finishRedirect);
      } else {
        finishRedirect();
      }
    } else {
      triggerHaptic('error');
      setError("Invalid Shadow Code. Targets must be registered in the Nexus.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleStart = async () => {
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("reader");
      }

      setScanning(true);
      await scannerRef.current.start(
        { facingMode: "environment" },
        { 
          fps: 10, 
          qrbox: { width: 280, height: 280 },
          aspectRatio: 1.0 
        },
        handleScanSuccess,
        (errorMessage) => {
          // Frame sync
        }
      );
      setIsStarted(true);
      setScanning(false);
      triggerHaptic('light');
    } catch (err: any) {
      console.error(err);
      setError("Camera access denied or hardware busy.");
      setScanning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("reader");
    }

    setScanning(true);
    scannerRef.current.scanFile(file, true)
      .then(handleScanSuccess)
      .catch(err => {
        console.error(err);
        triggerHaptic('error');
        setError("Failed to parse image. Ensure high contrast.");
        setScanning(false);
      });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glitch Overlay Background */}
      <div className="glitch-overlay"></div>

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        zIndex: 10,
        marginBottom: '40px' 
      }}>
        <button 
          onClick={() => {
            triggerHaptic('light');
            window.history.back();
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            backdropFilter: 'blur(10px)'
          }}
        >
          ← CANCEL
        </button>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: '#00f2ff', letterSpacing: '2px', fontWeight: 'bold' }}>SYSTEM: NEXUS_SCAN</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>P2P_SYNC_V1.1</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
        {!isStarted ? (
          <div style={{ textAlign: 'center', maxWidth: '300px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '10px', letterSpacing: '-1px' }}>
              ALIGN <span style={{ color: '#00f2ff' }}>SIGNAL</span>
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '40px', lineHeight: '1.5' }}>
              Point your neural links at the Shadow ID to synchronize archetypes.
            </p>
            
            <button 
              onClick={handleStart}
              disabled={scanning}
              style={{
                width: '100%',
                padding: '24px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #00f2ff 0%, #0072ff 100%)',
                border: 'none',
                color: '#000',
                fontSize: '18px',
                fontWeight: '900',
                cursor: 'pointer',
                marginBottom: '16px',
                boxShadow: '0 10px 30px rgba(0, 242, 255, 0.4)',
                transition: 'all 0.2s',
                opacity: scanning ? 0.7 : 1
              }}
            >
              {scanning ? 'INITIALIZING...' : 'ACTIVATE CAMERA'}
            </button>

            <label style={{
              display: 'block',
              width: '100%',
              padding: '20px',
              borderRadius: '24px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '40px',
              textAlign: 'center'
            }}>
              UPLOAD ID IMAGE
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px', aspectRatio: '1/1', background: '#111', borderRadius: '40px', overflow: 'hidden', border: '2px solid #00f2ff', boxShadow: '0 0 50px rgba(0, 242, 255, 0.2)' }}>
            <div id="reader" style={{ width: '100%', height: '100%' }}></div>
            
            {/* Visual Scan Layer */}
            <div style={{ 
              position: 'absolute', 
              top: 0, left: 0, right: 0, bottom: 0, 
              pointerEvents: 'none',
              border: '40px solid rgba(0,0,0,0.5)',
              zIndex: 5
            }}></div>
            
            {/* Corner Brackets */}
            <div className="bracket-tl"></div>
            <div className="bracket-tr"></div>
            <div className="bracket-bl"></div>
            <div className="bracket-br"></div>

            {/* Scanning Line */}
            <div className="scan-line"></div>
          </div>
        )}

        {error && (
          <div style={{
            marginTop: '30px',
            padding: '16px 24px',
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            border: '2px solid #ff4444',
            color: '#fff',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: 'bold',
            textAlign: 'center',
            maxWidth: '300px',
            backdropFilter: 'blur(10px)',
            animation: 'shake 0.4s ease-in-out'
          }}>
            SYSTEM ERROR: {error}
          </div>
        )}
      </div>

      <div style={{ 
        padding: '30px', 
        textAlign: 'center', 
        zIndex: 10,
        opacity: 0.4,
        fontSize: '10px',
        letterSpacing: '4px',
        fontWeight: 'bold',
        color: '#00f2ff'
      }}>
        NEXUS_SYNC // END_TO_END_ENCRYPTION_ACTIVE
      </div>

      <style jsx>{`
        .glitch-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.8) 100%),
                      repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.1) 0px, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 2px);
          pointer-events: none;
          z-index: 1;
        }

        .bracket-tl, .bracket-tr, .bracket-bl, .bracket-br {
          position: absolute;
          width: 50px;
          height: 50px;
          border-color: #00f2ff;
          border-style: solid;
          z-index: 10;
        }
        .bracket-tl { top: 20px; left: 20px; border-width: 4px 0 0 4px; border-top-left-radius: 12px; }
        .bracket-tr { top: 20px; right: 20px; border-width: 4px 4px 0 0; border-top-right-radius: 12px; }
        .bracket-bl { bottom: 20px; left: 20px; border-width: 0 0 4px 4px; border-bottom-left-radius: 12px; }
        .bracket-br { bottom: 20px; right: 20px; border-width: 0 4px 4px 0; border-bottom-right-radius: 12px; }

        .scan-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: #00f2ff;
          box-shadow: 0 0 15px #00f2ff;
          z-index: 11;
          animation: scan 3s linear infinite;
        }

        @keyframes scan {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        /* html5-qrcode hidden elements */
        #reader__status_span { display: none !important; }
        video { object-fit: cover !important; }
      `}</style>
    </div>
  );
}

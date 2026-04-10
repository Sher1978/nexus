'use client';

import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useRouter } from 'next/navigation';

export default function ScanPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        // Success: Redirect to the bot with the scanned link
        // The link should look like https://t.me/humanexusbot?start=inspect_ID
        if (decodedText.includes('t.me/humanexusbot?start=')) {
          scanner.clear();
          window.location.href = decodedText;
        } else {
          setError("Invalid Shadow Code detected.");
        }
      },
      (errorMessage) => {
        // Error is noisy during scanning, ignore unless critical
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 10
      }}>
        <button 
          onClick={() => window.history.back()}
          style={{
            background: 'rgba(0, 242, 255, 0.1)',
            border: '1px solid #00f2ff',
            color: '#00f2ff',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ← BACK
        </button>
      </div>

      <h1 style={{ 
        fontSize: '24px', 
        fontWeight: 'bold', 
        marginBottom: '10px',
        letterSpacing: '2px',
        textAlign: 'center',
        color: '#00f2ff'
      }}>
        NEURAL SCANNER // P2P
      </h1>
      <p style={{ 
        color: 'rgba(255,255,255,0.6)', 
        fontSize: '14px', 
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        Поместите QR-код собеседника в рамку для синхронизации.
      </p>

      <div id="reader" style={{ 
        width: '100%', 
        maxWidth: '400px',
        border: '2px solid rgba(0, 242, 255, 0.3)',
        borderRadius: '20px',
        overflow: 'hidden',
        backgroundColor: '#111'
      }}></div>

      {error && (
        <div style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          border: '1px solid #ff4444',
          color: '#ff4444',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <div style={{
        marginTop: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        opacity: 0.5
      }}>
        <div style={{ 
          width: '4px', 
          height: '4px', 
          borderRadius: '50%', 
          backgroundColor: '#00f2ff',
          animation: 'pulse 1.5s infinite' 
        }}></div>
        <span style={{ fontSize: '10px', letterSpacing: '1px' }}>WAITING FOR TARGET...</span>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
          100% { opacity: 0.2; transform: scale(1); }
        }
        /* Custom scanning styling for html5-qrcode */
        #reader__status_span { background: transparent !important; color: #00f2ff !important; }
        #reader__dashboard_section_csr button {
          background: #00f2ff !important;
          color: #000 !important;
          border: none !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          font-weight: bold !important;
          margin-top: 10px !important;
        }
      `}</style>
    </div>
  );
}

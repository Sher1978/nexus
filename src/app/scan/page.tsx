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
      false
    );

    scanner.render(
      (decodedText) => {
        if (decodedText.includes('t.me/humanexusbot?start=')) {
          scanner.clear();
          window.location.href = decodedText;
        } else {
          setError("Invalid Shadow Code detected.");
        }
      },
      (errorMessage) => {
        // Silent error
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
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glitch Overlay Background */}
      <div className="glitch-overlay"></div>

      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 100
      }}>
        <button 
          onClick={() => window.history.back()}
          style={{
            background: 'rgba(0, 242, 255, 0.1)',
            border: '1px solid #00f2ff',
            color: '#00f2ff',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}
        >
          ← EXIT NEXUS
        </button>
      </div>

      <div style={{ zIndex: 10, textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          marginBottom: '5px',
          letterSpacing: '4px',
          color: '#00f2ff',
          textShadow: '0 0 10px rgba(0, 242, 255, 0.5)'
        }}>
          NEXUS SCANNER
        </h1>
        <div style={{ 
          height: '1px', 
          width: '60px', 
          background: '#00f2ff', 
          margin: '0 auto 20px',
          boxShadow: '0 0 5px #00f2ff'
        }}></div>
        <p style={{ 
          color: 'rgba(0, 242, 255, 0.7)', 
          fontSize: '12px', 
          marginBottom: '40px',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          P2P Synchronization Protocol: Active
        </p>
      </div>

      <div id="reader-wrapper" style={{
        position: 'relative',
        padding: '10px',
        background: 'rgba(0, 242, 255, 0.05)',
        border: '1px solid rgba(0, 242, 255, 0.2)',
        borderRadius: '30px',
        boxShadow: '0 0 30px rgba(0, 242, 255, 0.1)'
      }}>
        <div id="reader" style={{ 
          width: '100%', 
          maxWidth: '350px',
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: '#000'
        }}></div>
        
        {/* Corner Brackets */}
        <div className="bracket-tl"></div>
        <div className="bracket-tr"></div>
        <div className="bracket-bl"></div>
        <div className="bracket-br"></div>
      </div>

      {error && (
        <div style={{
          marginTop: '30px',
          padding: '15px 25px',
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          border: '1px solid #ff4444',
          color: '#ff4444',
          borderRadius: '4px',
          fontSize: '13px',
          fontWeight: 'bold',
          letterSpacing: '1px',
          animation: 'shake 0.5s linear infinite'
        }}>
          [ALERT] {error}
        </div>
      )}

      <div style={{
        marginTop: '50px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        opacity: 0.8
      }}>
        <div className="scanner-status-dot"></div>
        <span style={{ 
          fontSize: '10px', 
          letterSpacing: '3px', 
          color: '#00f2ff',
          fontWeight: 'bold'
        }}>SCANNING FOR SHADOW SIGNALS...</span>
      </div>

      <style jsx>{\
        .glitch-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15) 0px,
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
          z-index: 1;
        }

        .bracket-tl, .bracket-tr, .bracket-bl, .bracket-br {
          position: absolute;
          width: 30px;
          height: 30px;
          border-color: #00f2ff;
          border-style: solid;
          z-index: 5;
        }
        .bracket-tl { top: -2px; left: -2px; border-width: 4px 0 0 4px; border-top-left-radius: 20px; }
        .bracket-tr { top: -2px; right: -2px; border-width: 4px 4px 0 0; border-top-right-radius: 20px; }
        .bracket-bl { bottom: -2px; left: -2px; border-width: 0 0 4px 4px; border-bottom-left-radius: 20px; }
        .bracket-br { bottom: -2px; right: -2px; border-width: 0 4px 4px 0; border-bottom-right-radius: 20px; }

        .scanner-status-dot {
          width: 8px;
          height: 8px;
          background: #00f2ff;
          border-radius: 50%;
          box-shadow: 0 0 10px #00f2ff;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(2); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        /* html5-qrcode overrides */
        #reader__status_span { display: none !important; }
        #reader__dashboard_section_csr button {
          background: #00f2ff !important;
          color: #000 !important;
          border: none !important;
          padding: 10px 20px !important;
          border-radius: 4px !important;
          font-weight: bold !important;
          letter-spacing: 1px !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
        }
        #reader__dashboard_section_csr button:hover {
          filter: brightness(1.2);
          box-shadow: 0 0 15px rgba(0, 242, 255, 0.4);
        }
      \}</style>
    </div>
  );
}

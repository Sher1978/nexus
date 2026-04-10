'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { Button } from '../ui/Button';
import { X, Zap, Shield, Target } from 'lucide-react';

interface QRScannerScreenProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export const QRScannerScreen: React.FC<QRScannerScreenProps> = ({ onScan, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const scannerId = "reader";
    const html5QrCode = new Html5Qrcode(scannerId);
    scannerRef.current = html5QrCode;

    const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start(
      { facingMode: "environment" },
      qrConfig,
      (decodedText) => {
        // Stop on success
        html5QrCode.stop().then(() => {
          onScan(decodedText);
        }).catch(err => console.error("Stop failed", err));
      },
      (error) => {
        // Silent error for "no QR found in frame"
      }
    ).catch(err => {
      console.error("Start failed", err);
      setError("Не удалось запустить камеру. Проверьте разрешения.");
    });

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => console.error("Cleanup stop failed", err));
      }
    };
  }, [onScan]);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: 'black', 
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* HUD Header */}
      <div style={{ 
        padding: '1.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        zIndex: 10,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="aura-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'red' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: 'white' }}>
            SCANNING MODE // LIVE
          </span>
        </div>
        <button onClick={onClose} style={{ 
          background: 'rgba(255,255,255,0.1)', 
          border: 'none', 
          borderRadius: '50%', 
          width: '40px', 
          height: '40px', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <X size={20} />
        </button>
      </div>

      {/* Camera Viewport */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div id="reader" style={{ width: '100%', height: '100%', objectFit: 'cover' }}></div>
        
        {/* Tactical Overlay */}
        <div className="scanner-overlay">
          <div className="scanner-line" />
          {/* Corner accents */}
          <div style={{ position: 'absolute', top: -10, left: -10, width: 20, height: 20, borderTop: '4px solid var(--ios-gold)', borderLeft: '4px solid var(--ios-gold)' }} />
          <div style={{ position: 'absolute', top: -10, right: -10, width: 20, height: 20, borderTop: '4px solid var(--ios-gold)', borderRight: '4px solid var(--ios-gold)' }} />
          <div style={{ position: 'absolute', bottom: -10, left: -10, width: 20, height: 20, borderBottom: '4px solid var(--ios-gold)', borderLeft: '4px solid var(--ios-gold)' }} />
          <div style={{ position: 'absolute', bottom: -10, right: -10, width: 20, height: 20, borderBottom: '4px solid var(--ios-gold)', borderRight: '4px solid var(--ios-gold)' }} />
        </div>

        {error && (
          <div style={{ 
            position: 'absolute', 
            top: '20%', 
            left: '10%', 
            right: '10%', 
            background: 'rgba(255,0,0,0.2)', 
            border: '1px solid red', 
            padding: '1rem', 
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            {error}
          </div>
        )}
      </div>

      {/* HUD Footer */}
      <div style={{ 
        padding: '2rem 1.5rem', 
        textAlign: 'center', 
        zIndex: 10,
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)'
      }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Наведите камеру на QR-код другого агента для синхронизации.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', opacity: 0.3 }}>
          <Target size={20} />
          <Zap size={20} />
          <Shield size={20} />
        </div>
      </div>
    </div>
  );
};

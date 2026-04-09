'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  isProcessing?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  onRecordingComplete, 
  isProcessing 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const animationFrame = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      const chunks: BlobPart[] = [];
      mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        onRecordingComplete(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      // Voice activity visualization
      audioContext.current = new AudioContext();
      const source = audioContext.current.createMediaStreamSource(stream);
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 256;
      source.connect(analyser.current);

      const updateLevel = () => {
        if (!analyser.current) return;
        const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
        analyser.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average);
        animationFrame.current = requestAnimationFrame(updateLevel);
      };
      
      updateLevel();
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
      {/* Neural Waveform Visualization */}
      <div style={{ 
        height: '60px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '3px',
        width: '100%',
        position: 'relative'
      }}>
        {isRecording ? (
          [...Array(12)].map((_, i) => (
            <div key={i} style={{
              width: '3px',
              height: `${Math.max(4, (audioLevel / 2) * (0.5 + Math.random()))}px`,
              background: 'linear-gradient(to bottom, var(--accent), #b8860b)',
              borderRadius: '2px',
              transition: 'height 0.1s ease',
              boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)',
              opacity: 0.8
            }} />
          ))
        ) : (
          <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        )}
      </div>
      
      <div style={{ position: 'relative' }}>
        {/* Pulsing Aura */}
        {isRecording && (
          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            right: '-10px',
            bottom: '-10px',
            borderRadius: '50%',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            animation: 'aura-pulse 2s infinite cubic-bezier(0.16, 1, 0.3, 1)'
          }} />
        )}

        <Button 
          variant={isRecording ? 'secondary' : 'primary'}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          style={{ 
            width: '72px', 
            height: '72px', 
            borderRadius: '50%', 
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isRecording ? '0 0 30px rgba(212, 175, 55, 0.2)' : 'none',
            zIndex: 10
          }}
        >
          {isProcessing ? (
            <Loader2 className="animate-spin" size={28} />
          ) : isRecording ? (
            <Square size={24} fill="currentColor" />
          ) : (
            <Mic size={28} />
          )}
        </Button>
      </div>
      
      <p style={{ 
        fontSize: '0.9rem', 
        fontWeight: 600, 
        letterSpacing: '1px', 
        textTransform: 'uppercase',
        color: isRecording ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
        transition: 'all 0.3s ease'
      }}>
        {isProcessing ? 'Шифрование данных...' : isRecording ? 'Идет запись...' : 'Голосовой ввод'}
      </p>

      <style jsx>{`
        @keyframes aura-pulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

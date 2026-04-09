'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { getTelegramWebApp } from '@/lib/telegram';
import { QrCode } from 'lucide-react';

export const QRScanner = ({ onScan }: { onScan: (data: string) => void }) => {
  const handleScan = () => {
    const webApp = getTelegramWebApp();
    if (webApp && webApp.showScanQrPopup) {
      webApp.showScanQrPopup({
        text: 'Отсканируйте код другого Агента'
      }, (data: string) => {
        onScan(data);
        webApp.closeScanQrPopup();
        return true; // close the popup
      });
    } else {
      // Fallback для десктопа/отладки
      console.log('Native QR scanner not available. Opening debug scan.');
      const mockId = prompt('Введите ID агента (только для отладки):');
      if (mockId) onScan(mockId);
    }
  };

  return (
    <Button variant="primary" onClick={handleScan} style={{ gap: '0.5rem' }}>
      <QrCode size={20} /> Сканировать Контакт
    </Button>
  );
};

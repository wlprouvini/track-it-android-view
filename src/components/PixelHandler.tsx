
import React, { useEffect } from 'react';

interface AccessData {
  id: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  referrer: string;
  type: 'link' | 'pixel';
  linkId?: string;
}

const PixelHandler: React.FC = () => {
  useEffect(() => {
    const capturePixelAccess = async () => {
      try {
        // Capturar IP real
        let realIP = 'IP não disponível';
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          realIP = ipData.ip;
        } catch (error) {
          console.log('Não foi possível obter IP externo, usando localhost');
          realIP = 'localhost';
        }

        const newAccess: AccessData = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          ip: realIP,
          userAgent: navigator.userAgent,
          referrer: document.referrer || 'Acesso Direto',
          type: 'pixel'
        };

        // Salvar no localStorage
        const savedData = localStorage.getItem('iplogger-data');
        const existingData: AccessData[] = savedData ? JSON.parse(savedData) : [];
        const updatedData = [...existingData, newAccess];
        localStorage.setItem('iplogger-data', JSON.stringify(updatedData));

        console.log('Acesso via pixel capturado:', newAccess);
      } catch (error) {
        console.error('Erro ao capturar acesso via pixel:', error);
      }
    };

    capturePixelAccess();
  }, []);

  // Retornar uma imagem transparente 1x1 pixel
  useEffect(() => {
    // Criar um pixel transparente
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 1, 1);
    }
    
    // Converter para blob e retornar como resposta
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'pixel.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  }, []);

  return null; // Componente invisível
};

export default PixelHandler;

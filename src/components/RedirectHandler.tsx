
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface AccessData {
  id: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  referrer: string;
  type: 'link' | 'pixel';
  linkId?: string;
}

const RedirectHandler: React.FC = () => {
  const { linkId } = useParams<{ linkId: string }>();

  useEffect(() => {
    const captureAccess = async () => {
      try {
        // Capturar IP real usando um serviço público
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
          type: 'link',
          linkId: linkId
        };

        // Salvar no localStorage
        const savedData = localStorage.getItem('iplogger-data');
        const existingData: AccessData[] = savedData ? JSON.parse(savedData) : [];
        const updatedData = [...existingData, newAccess];
        localStorage.setItem('iplogger-data', JSON.stringify(updatedData));

        console.log('Acesso capturado:', newAccess);

        // Buscar URL de redirecionamento salva
        const savedLinks = localStorage.getItem('iplogger-links');
        const links = savedLinks ? JSON.parse(savedLinks) : {};
        const redirectUrl = links[linkId || ''] || 'https://google.com';

        // Redirecionar após um pequeno delay
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1000);

      } catch (error) {
        console.error('Erro ao capturar acesso:', error);
        // Redirecionar mesmo em caso de erro
        setTimeout(() => {
          window.location.href = 'https://google.com';
        }, 1000);
      }
    };

    if (linkId) {
      captureAccess();
    }
  }, [linkId]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-white">Redirecionando...</p>
      </div>
    </div>
  );
};

export default RedirectHandler;

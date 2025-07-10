
import React, { useEffect, useRef, useState } from 'react';

interface CameraCaptureProps {
  onPhotoCapture: (photoData: string) => void;
  onError: (error: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onPhotoCapture, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        setIsCapturing(true);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user', // Câmera frontal
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
          audio: false
        });

        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
          
          // Capturar foto automaticamente após 2 segundos
          setTimeout(() => {
            capturePhoto();
          }, 2000);
        }
      } catch (error) {
        console.error('Erro ao acessar câmera:', error);
        onError('Não foi possível acessar a câmera');
        setIsCapturing(false);
      }
    };

    startCamera();

    // Cleanup
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Capturar frame do vídeo
        context.drawImage(video, 0, 0);
        
        // Converter para base64
        const photoData = canvas.toDataURL('image/jpeg', 0.8);
        
        // Parar a câmera
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        onPhotoCapture(photoData);
        setIsCapturing(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
        <div className="text-center mb-4">
          <h3 className="text-white text-lg font-semibold mb-2">
            {isCapturing ? 'Capturando foto...' : 'Processando...'}
          </h3>
          <div className="text-gray-400 text-sm">
            {isCapturing ? 'Aguarde alguns segundos' : 'Finalizando captura'}
          </div>
        </div>
        
        {isCapturing && (
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full rounded-lg"
              autoPlay
              muted
              playsInline
            />
            <div className="absolute inset-0 border-2 border-blue-400 rounded-lg animate-pulse"></div>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;

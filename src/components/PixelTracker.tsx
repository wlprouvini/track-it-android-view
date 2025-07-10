
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PixelTracker: React.FC = () => {
  const { toast } = useToast();

  const pixelUrl = `${window.location.origin}/pixel.png`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copiado!",
        description: "URL do pixel copiada para a área de transferência.",
      });
    });
  };

  const testPixel = () => {
    window.open(pixelUrl, '_blank');
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Image className="h-5 w-5 text-purple-400" />
          <span>Pixel Invisível</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-900 p-3 rounded border border-gray-600">
          <code className="text-purple-400 text-sm break-all">
            {pixelUrl}
          </code>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={() => copyToClipboard(pixelUrl)}
            className="flex-1 bg-gray-700 hover:bg-gray-600"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copiar URL
          </Button>
          <Button
            onClick={testPixel}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Testar Pixel
          </Button>
        </div>

        <div className="text-gray-400 text-xs space-y-1">
          <p>• Use este pixel em emails ou páginas web</p>
          <p>• Completamente invisível para o usuário</p>
          <p>• Captura dados REAIS quando acessado</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PixelTracker;

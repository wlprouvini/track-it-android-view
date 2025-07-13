
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Globe, Shield, ShieldCheck, Wifi, WifiOff, ArrowLeft, Flag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VPNServer {
  country: string;
  city: string;
  flag: string;
  ping: number;
  load: number;
}

interface VPNConnectionProps {
  onBack: () => void;
}

const vpnServers: VPNServer[] = [
  { country: 'Brasil', city: 'São Paulo', flag: '🇧🇷', ping: 15, load: 23 },
  { country: 'Estados Unidos', city: 'Nova York', flag: '🇺🇸', ping: 45, load: 12 },
  { country: 'Estados Unidos', city: 'Los Angeles', flag: '🇺🇸', ping: 52, load: 18 },
  { country: 'Reino Unido', city: 'Londres', flag: '🇬🇧', ping: 65, load: 31 },
  { country: 'Alemanha', city: 'Berlim', flag: '🇩🇪', ping: 72, load: 28 },
  { country: 'França', city: 'Paris', flag: '🇫🇷', ping: 68, load: 35 },
  { country: 'Japão', city: 'Tóquio', flag: '🇯🇵', ping: 125, load: 42 },
  { country: 'Coreia do Sul', city: 'Seul', flag: '🇰🇷', ping: 135, load: 38 },
  { country: 'Singapura', city: 'Singapura', flag: '🇸🇬', ping: 145, load: 25 },
  { country: 'Austrália', city: 'Sydney', flag: '🇦🇺', ping: 165, load: 33 },
  { country: 'Canadá', city: 'Toronto', flag: '🇨🇦', ping: 48, load: 29 },
  { country: 'Holanda', city: 'Amsterdam', flag: '🇳🇱', ping: 75, load: 22 },
  { country: 'Suécia', city: 'Estocolmo', flag: '🇸🇪', ping: 82, load: 19 },
  { country: 'Suíça', city: 'Zurique', flag: '🇨🇭', ping: 78, load: 24 },
  { country: 'Itália', city: 'Milão', flag: '🇮🇹', ping: 85, load: 36 },
  { country: 'Espanha', city: 'Madrid', flag: '🇪🇸', ping: 88, load: 41 },
  { country: 'Rússia', city: 'Moscou', flag: '🇷🇺', ping: 95, load: 44 },
  { country: 'Índia', city: 'Mumbai', flag: '🇮🇳', ping: 155, load: 52 },
  { country: 'México', city: 'Cidade do México', flag: '🇲🇽', ping: 65, load: 37 },
  { country: 'Argentina', city: 'Buenos Aires', flag: '🇦🇷', ping: 35, load: 26 },
];

const VPNConnection: React.FC<VPNConnectionProps> = ({ onBack }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedServer, setSelectedServer] = useState<VPNServer | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async (server: VPNServer) => {
    setIsConnecting(true);
    
    try {
      // Simular conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSelectedServer(server);
      setIsConnected(true);
      
      toast({
        title: "VPN Conectada",
        description: `Conectado ao servidor ${server.city}, ${server.country}`,
      });
    } catch (error) {
      toast({
        title: "Erro na Conexão",
        description: "Falha ao conectar com o servidor VPN",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSelectedServer(null);
    toast({
      title: "VPN Desconectada",
      description: "Desconectado do servidor VPN",
    });
  };

  const getLoadColor = (load: number) => {
    if (load < 30) return 'text-green-400';
    if (load < 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPingColor = (ping: number) => {
    if (ping < 50) return 'text-green-400';
    if (ping < 100) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold">VPN Global</h1>
          </div>
        </div>

        {/* Status Card */}
        {isConnected && selectedServer && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-green-400" />
                <span>Conectado</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{selectedServer.flag}</span>
                  <div>
                    <p className="text-white font-medium">{selectedServer.country}</p>
                    <p className="text-gray-400 text-sm">{selectedServer.city}</p>
                  </div>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">
                  Ativo
                </Badge>
              </div>
              <Button 
                onClick={handleDisconnect}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <WifiOff className="mr-2 h-4 w-4" />
                Desconectar
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Connection Status */}
        {!isConnected && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <WifiOff className="h-6 w-6 text-red-400" />
                  <span className="text-lg">Desconectado</span>
                </div>
                <p className="text-gray-400 text-sm">Selecione um servidor para conectar</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Servers List */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-400" />
              <span>Servidores Disponíveis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {vpnServers.map((server, index) => (
                <div key={index} className="space-y-2">
                  <div 
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors"
                    onClick={() => !isConnecting && !isConnected && handleConnect(server)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{server.flag}</span>
                      <div>
                        <p className="text-white font-medium">{server.country}</p>
                        <p className="text-gray-400 text-sm">{server.city}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className={`text-sm font-medium ${getPingColor(server.ping)}`}>
                            {server.ping}ms
                          </p>
                          <p className="text-xs text-gray-500">Ping</p>
                        </div>
                        <div className="text-center">
                          <p className={`text-sm font-medium ${getLoadColor(server.load)}`}>
                            {server.load}%
                          </p>
                          <p className="text-xs text-gray-500">Carga</p>
                        </div>
                      </div>
                      {isConnected && selectedServer === server ? (
                        <Badge className="bg-green-500 text-xs">Conectado</Badge>
                      ) : (
                        <Wifi className="h-4 w-4 text-gray-400 mx-auto" />
                      )}
                    </div>
                  </div>
                  {index < vpnServers.length - 1 && <Separator className="bg-gray-600" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loading */}
        {isConnecting && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
                <p className="text-white">Conectando...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <div className="text-center text-gray-500 text-sm">
          <p>🔒 Conexão segura e criptografada</p>
        </div>
      </div>
    </div>
  );
};

export default VPNConnection;

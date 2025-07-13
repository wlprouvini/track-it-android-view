
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Globe, Shield, ShieldCheck, Wifi, WifiOff, ArrowLeft, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VPNServer {
  country: string;
  city: string;
  flag: string;
  ping: number;
  load: number;
  ipRange: string[];
}

interface VPNConnectionProps {
  onBack: () => void;
}

const vpnServers: VPNServer[] = [
  { 
    country: 'Brasil', 
    city: 'São Paulo', 
    flag: '🇧🇷', 
    ping: 15, 
    load: 23,
    ipRange: ['200.142.', '177.128.', '201.23.', '189.45.', '191.36.']
  },
  { 
    country: 'Estados Unidos', 
    city: 'Nova York', 
    flag: '🇺🇸', 
    ping: 45, 
    load: 12,
    ipRange: ['173.252.', '199.16.', '69.171.', '31.13.', '157.240.']
  },
  { 
    country: 'Estados Unidos', 
    city: 'Los Angeles', 
    flag: '🇺🇸', 
    ping: 52, 
    load: 18,
    ipRange: ['104.244.', '192.133.', '208.43.', '66.220.', '173.252.']
  },
  { 
    country: 'Reino Unido', 
    city: 'Londres', 
    flag: '🇬🇧', 
    ping: 65, 
    load: 31,
    ipRange: ['81.2.', '217.163.', '92.40.', '151.101.', '185.199.']
  },
  { 
    country: 'Alemanha', 
    city: 'Berlim', 
    flag: '🇩🇪', 
    ping: 72, 
    load: 28,
    ipRange: ['46.4.', '217.6.', '62.138.', '87.230.', '185.60.']
  },
  { 
    country: 'França', 
    city: 'Paris', 
    flag: '🇫🇷', 
    ping: 68, 
    load: 35,
    ipRange: ['213.186.', '80.12.', '92.103.', '90.63.', '176.31.']
  },
  { 
    country: 'Japão', 
    city: 'Tóquio', 
    flag: '🇯🇵', 
    ping: 125, 
    load: 42,
    ipRange: ['133.242.', '202.32.', '210.173.', '219.94.', '153.120.']
  },
  { 
    country: 'Coreia do Sul', 
    city: 'Seul', 
    flag: '🇰🇷', 
    ping: 135, 
    load: 38,
    ipRange: ['175.223.', '218.145.', '211.115.', '222.122.', '203.226.']
  },
  { 
    country: 'Singapura', 
    city: 'Singapura', 
    flag: '🇸🇬', 
    ping: 145, 
    load: 25,
    ipRange: ['165.21.', '202.166.', '103.28.', '175.103.', '180.87.']
  },
  { 
    country: 'Austrália', 
    city: 'Sydney', 
    flag: '🇦🇺', 
    ping: 165, 
    load: 33,
    ipRange: ['203.2.', '139.130.', '150.101.', '27.111.', '101.167.']
  },
  { 
    country: 'Canadá', 
    city: 'Toronto', 
    flag: '🇨🇦', 
    ping: 48, 
    load: 29,
    ipRange: ['142.4.', '206.167.', '199.212.', '24.114.', '67.69.']
  },
  { 
    country: 'Holanda', 
    city: 'Amsterdam', 
    flag: '🇳🇱', 
    ping: 75, 
    load: 22,
    ipRange: ['213.154.', '62.163.', '77.95.', '185.3.', '178.21.']
  },
  { 
    country: 'Suécia', 
    city: 'Estocolmo', 
    flag: '🇸🇪', 
    ping: 82, 
    load: 19,
    ipRange: ['213.115.', '194.236.', '130.244.', '81.209.', '195.67.']
  },
  { 
    country: 'Suíça', 
    city: 'Zurique', 
    flag: '🇨🇭', 
    ping: 78, 
    load: 24,
    ipRange: ['217.26.', '195.176.', '85.5.', '213.139.', '82.220.']
  },
  { 
    country: 'Itália', 
    city: 'Milão', 
    flag: '🇮🇹', 
    ping: 85, 
    load: 36,
    ipRange: ['151.67.', '79.40.', '93.62.', '212.47.', '87.13.']
  },
  { 
    country: 'Espanha', 
    city: 'Madrid', 
    flag: '🇪🇸', 
    ping: 88, 
    load: 41,
    ipRange: ['88.27.', '212.166.', '80.58.', '185.38.', '83.36.']
  },
  { 
    country: 'Rússia', 
    city: 'Moscou', 
    flag: '🇷🇺', 
    ping: 95, 
    load: 44,
    ipRange: ['77.88.', '87.250.', '213.180.', '95.163.', '178.154.']
  },
  { 
    country: 'Índia', 
    city: 'Mumbai', 
    flag: '🇮🇳', 
    ping: 155, 
    load: 52,
    ipRange: ['117.239.', '27.109.', '203.115.', '182.74.', '106.51.']
  },
  { 
    country: 'México', 
    city: 'Cidade do México', 
    flag: '🇲🇽', 
    ping: 65, 
    load: 37,
    ipRange: ['200.57.', '187.141.', '201.141.', '189.203.', '177.230.']
  },
  { 
    country: 'Argentina', 
    city: 'Buenos Aires', 
    flag: '🇦🇷', 
    ping: 35, 
    load: 26,
    ipRange: ['200.45.', '181.31.', '190.210.', '200.115.', '186.33.']
  },
];

const generateRandomIP = (ipRange: string[]) => {
  const prefix = ipRange[Math.floor(Math.random() * ipRange.length)];
  const suffix1 = Math.floor(Math.random() * 256);
  const suffix2 = Math.floor(Math.random() * 256);
  return `${prefix}${suffix1}.${suffix2}`;
};

const VPNConnection: React.FC<VPNConnectionProps> = ({ onBack }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedServer, setSelectedServer] = useState<VPNServer | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentIP, setCurrentIP] = useState('');
  const [originalIP, setOriginalIP] = useState('192.168.1.100'); // IP local simulado
  const [connectionTime, setConnectionTime] = useState<Date | null>(null);
  const { toast } = useToast();

  // Simular IP original ao carregar
  useEffect(() => {
    const brazilianIPs = ['177.128.', '201.23.', '189.45.'];
    const simulatedOriginalIP = generateRandomIP(brazilianIPs);
    setOriginalIP(simulatedOriginalIP);
    setCurrentIP(simulatedOriginalIP);
  }, []);

  const handleConnect = async (server: VPNServer) => {
    setIsConnecting(true);
    
    try {
      // Simular conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Gerar novo IP baseado no país selecionado
      const newIP = generateRandomIP(server.ipRange);
      
      setSelectedServer(server);
      setIsConnected(true);
      setCurrentIP(newIP);
      setConnectionTime(new Date());
      
      toast({
        title: "VPN Conectada",
        description: `Conectado ao servidor ${server.city}, ${server.country}. Novo IP: ${newIP}`,
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
    setCurrentIP(originalIP);
    setConnectionTime(null);
    toast({
      title: "VPN Desconectada",
      description: `Desconectado do servidor VPN. IP restaurado: ${originalIP}`,
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

  const formatConnectionTime = () => {
    if (!connectionTime) return '';
    const now = new Date();
    const diff = Math.floor((now.getTime() - connectionTime.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isConnected && connectionTime) {
      interval = setInterval(() => {
        // Force re-render para atualizar o tempo
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected, connectionTime]);

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

        {/* IP Status Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-400" />
              <span>Seu IP Atual</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Endereço IP:</span>
                <span className="text-white font-mono text-lg">{currentIP}</span>
              </div>
              {isConnected && selectedServer && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Localização:</span>
                    <span className="text-white">{selectedServer.city}, {selectedServer.country}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Tempo conectado:</span>
                    <span className="text-green-400 font-mono">{formatConnectionTime()}</span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status:</span>
                <Badge className={isConnected ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}>
                  {isConnected ? 'Protegido' : 'Desprotegido'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection Status */}
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
                <div className="text-right">
                  <p className="text-green-400 text-sm">Conectado</p>
                  <p className="text-gray-400 text-xs">IP alterado</p>
                </div>
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
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                      isConnected && selectedServer === server 
                        ? 'bg-green-700 hover:bg-green-600' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    } ${isConnecting || (isConnected && selectedServer !== server) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {
                      if (!isConnecting && !isConnected) {
                        handleConnect(server);
                      } else if (isConnected && selectedServer === server) {
                        handleDisconnect();
                      }
                    }}
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
                <p className="text-white">Conectando e alterando IP...</p>
                <p className="text-gray-400 text-sm">Estabelecendo túnel seguro</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <div className="text-center text-gray-500 text-sm space-y-1">
          <p>🔒 Conexão segura e criptografada</p>
          <p>🌍 IP alterado conforme o país selecionado</p>
        </div>
      </div>
    </div>
  );
};

export default VPNConnection;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, Link, Eye, Smartphone, Globe, Clock, Monitor, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LinkGenerator from '@/components/LinkGenerator';
import AccessViewer from '@/components/AccessViewer';
import PixelTracker from '@/components/PixelTracker';
import ReceiptGenerator from '@/components/ReceiptGenerator';

interface AccessData {
  id: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  referrer: string;
  type: 'link' | 'pixel' | 'receipt';
  linkId?: string;
  linkType?: 'ip' | 'camera';
  photo?: string;
  receiptId?: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'generate' | 'view' | 'receipt'>('home');
  const [accessData, setAccessData] = useState<AccessData[]>([]);
  const { toast } = useToast();

  // Carregar dados salvos do localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('iplogger-data');
    if (savedData) {
      try {
        setAccessData(JSON.parse(savedData));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
  }, []);

  const clearData = () => {
    localStorage.removeItem('iplogger-data');
    localStorage.removeItem('iplogger-links');
    localStorage.removeItem('iplogger-receipts');
    setAccessData([]);
    toast({
      title: "Dados Limpos",
      description: "Todos os dados de acesso foram removidos.",
    });
  };

  // Atualizar dados periodicamente para mostrar novos acessos
  useEffect(() => {
    const interval = setInterval(() => {
      const savedData = localStorage.getItem('iplogger-data');
      if (savedData) {
        try {
          const newData = JSON.parse(savedData);
          if (newData.length !== accessData.length) {
            setAccessData(newData);
          }
        } catch (error) {
          console.error('Erro ao atualizar dados:', error);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [accessData.length]);

  if (activeTab === 'generate') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <LinkGenerator 
          onBack={() => setActiveTab('home')} 
        />
      </div>
    );
  }

  if (activeTab === 'receipt') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <ReceiptGenerator 
          onBack={() => setActiveTab('home')} 
        />
      </div>
    );
  }

  if (activeTab === 'view') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <AccessViewer 
          accessData={accessData}
          onBack={() => setActiveTab('home')}
          onClearData={clearData}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Smartphone className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold">Mini IPLogger</h1>
          </div>
          <p className="text-gray-400">Rastreamento de IP offline</p>
        </div>

        {/* Status Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Globe className="h-5 w-5 text-green-400" />
              <span>Status do Servidor</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Servidor Local</span>
              <Badge className="bg-green-500 hover:bg-green-600">
                Online
              </Badge>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-300">Total de Acessos</span>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                {accessData.length}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Main Actions */}
        <div className="space-y-4">
          <Button 
            onClick={() => setActiveTab('generate')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
            size="lg"
          >
            <Link className="mr-2 h-5 w-5" />
            Gerar Link de Rastreamento
          </Button>

          <Button 
            onClick={() => setActiveTab('receipt')}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-6"
            size="lg"
          >
            <Receipt className="mr-2 h-5 w-5" />
            Gerar Comprovante PIX
          </Button>

          <Button 
            onClick={() => setActiveTab('view')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6"
            size="lg"
          >
            <Eye className="mr-2 h-5 w-5" />
            Ver Acessos ({accessData.length})
          </Button>
        </div>

        <Separator className="bg-gray-700" />

        {/* Pixel Tracker */}
        <PixelTracker />

        {/* Recent Activity */}
        {accessData.length > 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                <span>Atividade Recente</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {accessData.slice(-3).reverse().map((access) => (
                  <div key={access.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Monitor className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">
                        {access.type === 'pixel' ? 'Pixel' : access.type === 'receipt' ? 'Comprovante' : 'Link'} - {access.ip}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      {new Date(access.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Funciona 100% offline • Dados salvos localmente</p>
        </div>
      </div>
    </div>
  );
};

export default Index;

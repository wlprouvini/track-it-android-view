
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Mail, Phone, Clock } from 'lucide-react';

const SupportButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botão flutuante */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <Button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
            size="icon"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        ) : (
          <Card className="w-80 bg-gray-800 border-gray-700 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-blue-400" />
                  <span>Suporte</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-300 text-sm">
                Precisa de ajuda? Entre em contato conosco:
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-xs text-gray-400">suporte@exemplo.com</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="h-4 w-4 text-green-400" />
                  <div>
                    <div className="text-sm font-medium">Telefone</div>
                    <div className="text-xs text-gray-400">(11) 9999-9999</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-300">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <div>
                    <div className="text-sm font-medium">Horário</div>
                    <div className="text-xs text-gray-400">24/7 Online</div>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => window.open('mailto:suporte@exemplo.com', '_blank')}
              >
                Enviar Email
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default SupportButton;

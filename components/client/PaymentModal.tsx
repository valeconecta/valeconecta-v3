import React, { useState, useEffect } from 'react';
import { XIcon, ShieldCheckIcon, SpinnerIcon } from '../Icons';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

// INSTRUÇÃO: A chave pública será lida da variável de ambiente no deploy.
const MERCADO_PAGO_PUBLIC_KEY = process.env.MERCADO_PAGO_PUBLIC_KEY || 'SUA_PUBLIC_KEY_AQUI';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  professionalName: string;
  price: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSubmit, professionalName, price }) => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (isOpen) {
      if (MERCADO_PAGO_PUBLIC_KEY === 'SUA_PUBLIC_KEY_AQUI') {
        console.error("Chave pública do Mercado Pago não configurada nas variáveis de ambiente.");
        setError("Configuração de pagamento indisponível.");
        return;
      }
      
      initMercadoPago(MERCADO_PAGO_PUBLIC_KEY, { locale: 'pt-BR' });

      const createPreference = async () => {
        setIsLoading(true);
        setError(null);
        setPreferenceId(null);
        try {
          // A chamada agora é para a função serverless da Netlify em /api/create-preference
          const response = await fetch('/api/create-preference', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: `Serviço com ${professionalName}`,
              price: price,
            }),
          });
          
          if (!response.ok) {
              throw new Error("Não foi possível preparar o pagamento. Tente novamente mais tarde.");
          }

          const data = await response.json();
          setPreferenceId(data.preferenceId);

        } catch (error: any) {
          console.error('Error creating preference:', error);
          setError(error.message || "Ocorreu um erro inesperado ao iniciar o pagamento.");
        } finally {
          setIsLoading(false);
        }
      };

      createPreference();
    }
  }, [isOpen, professionalName, price]);

  const handlePaymentSubmit = async () => {
    setIsPaymentProcessing(true);
    setTimeout(() => {
      onSubmit();
      setIsPaymentProcessing(false);
    }, 1500);
  };
  
  const paymentBrickCustomization = {
    visual: {
      style: {
        theme: 'bootstrap',
        customVariables: {
          formBackgroundColor: '#ffffff',
          baseColor: '#2A8C82',
          fontSizeSmall: '0.875rem',
          fontWeightNormal: '400',
        },
      },
    },
    paymentMethods: {
      creditCard: 'all',
      debitCard: 'all',
      ticket: 'all',
      pix: 'all',
    },
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Pagamento Seguro</h2>
          <button onClick={onClose}>
            <XIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-gray-600">Você está contratando:</p>
          <p className="font-bold text-lg text-gray-800">{professionalName}</p>
          <div className="my-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <p className="text-sm text-gray-600">Valor Total</p>
            <p className="text-3xl font-extrabold text-[#2A8C82]">
              {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>

          <div id="payment-brick-container" className="mt-4 min-h-[200px]">
            {isLoading || error || !preferenceId ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                {isLoading ? (
                    <>
                        <SpinnerIcon className="h-8 w-8 animate-spin text-[#2A8C82]" />
                        <p className="mt-2 text-sm text-gray-500">Preparando pagamento seguro...</p>
                    </>
                ) : (
                    <div className="text-red-600">
                        <p className="font-semibold">Erro!</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}
              </div>
            ) : isPaymentProcessing ? (
               <div className="flex flex-col items-center justify-center h-full">
                <SpinnerIcon className="h-8 w-8 animate-spin text-[#2A8C82]" />
                <p className="mt-2 text-sm text-gray-500">Finalizando contratação...</p>
              </div>
            ) : (
              <Payment
                initialization={{
                  amount: price,
                  preferenceId: preferenceId,
                }}
                customization={paymentBrickCustomization}
                onSubmit={handlePaymentSubmit}
                onError={(error) => console.error(error)}
                onReady={() => console.log('Payment Brick está pronto!')}
              />
            )}
          </div>
          
          <p className="flex items-start text-xs text-gray-500 mt-4">
            <ShieldCheckIcon className="h-4 w-4 mr-2 flex-shrink-0 text-green-600" />
            Seu pagamento fica retido e só é liberado para o profissional 3 dias após você confirmar a conclusão do serviço.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

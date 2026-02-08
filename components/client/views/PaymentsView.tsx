
import React, { useState } from 'react';
import { payments as initialPayments } from '../../../data/clientMockData';
import { PlusCircleIcon } from '../../Icons';
import SuccessToast from '../SuccessToast';
import AddPixModal from '../AddPixModal';

const PaymentsView: React.FC = () => {
  const [payments, setPayments] = useState(initialPayments);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);

  const handleRemoveMethod = (id: number) => {
    if (payments.methods.length <= 1) {
        alert("Você deve ter pelo menos um método de pagamento.");
        return;
    }
    setPayments(prev => ({
      ...prev,
      methods: prev.methods.filter(method => method.id !== id)
    }));
    setSuccessMessage('Método de pagamento removido com sucesso!');
  };

  const handleAddCard = () => {
    const newId = Math.max(0, ...payments.methods.map(m => m.id)) + 1;
    const newCard = {
      id: newId,
      type: 'credit-card',
      details: `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`, // Random last 4 digits
      brand: newId % 2 === 0 ? 'visa' : 'mastercard',
      isDefault: false,
    };
    setPayments(prev => ({
      ...prev,
      methods: [...prev.methods, newCard]
    }));
    setSuccessMessage('Novo cartão adicionado com sucesso!');
  };

  const handleSavePix = (pixKey: string) => {
      const newId = Math.max(0, ...payments.methods.map(m => m.id)) + 1;
      const newPix = {
        id: newId,
        type: 'pix' as const,
        details: pixKey,
        brand: 'pix' as const,
        isDefault: false,
      };
      setPayments(prev => ({
        ...prev,
        methods: [...prev.methods, newPix]
      }));
      setIsPixModalOpen(false);
      setSuccessMessage('Chave PIX adicionada com sucesso!');
  };


  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Pagamentos</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transaction History */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Histórico de Transações</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Data</th>
                  <th className="px-6 py-3">Serviço</th>
                  <th className="px-6 py-3">Profissional</th>
                  <th className="px-6 py-3 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.history.map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">{item.date}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{item.service}</td>
                    <td className="px-6 py-4">{item.professional}</td>
                    <td className="px-6 py-4 text-right font-semibold">{item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Meus Métodos de Pagamento</h2>
          <div className="space-y-4">
            {payments.methods.map(method => (
              <div key={method.id} className="border border-gray-200 rounded-lg p-3 flex justify-between items-center">
                <div className="flex items-center">
                   {method.type === 'credit-card' ? (
                    <img src={`https://www.flaticon.com/svg/static/icons/svg/196/${method.brand === 'visa' ? '196578' : '196561'}.svg`} alt={method.brand} className="h-6 w-6 mr-3"/>
                  ) : (
                    <img src="https://i.postimg.cc/pTq3sT4j/pix-logo-01-C8-A0-E0-E35-D-seeklogo-com.png" alt="PIX" className="h-5 w-5 mr-3 object-contain"/>
                  )}
                  <div>
                    <p className="font-semibold text-gray-700 truncate">{method.details}</p>
                    {method.isDefault && <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">Padrão</span>}
                  </div>
                </div>
                <button onClick={() => handleRemoveMethod(method.id)} className="text-xs font-semibold text-red-600 hover:underline flex-shrink-0 ml-2">Remover</button>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            <button onClick={handleAddCard} className="w-full flex items-center justify-center bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-200">
                <PlusCircleIcon className="h-5 w-5 mr-2"/>
                Adicionar Novo Cartão
            </button>
             <button onClick={() => setIsPixModalOpen(true)} className="w-full flex items-center justify-center bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-200">
                <PlusCircleIcon className="h-5 w-5 mr-2"/>
                Adicionar Chave PIX
            </button>
          </div>
        </div>
      </div>
      {successMessage && (
        <SuccessToast
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
        />
      )}
      <AddPixModal
        isOpen={isPixModalOpen}
        onClose={() => setIsPixModalOpen(false)}
        onSave={handleSavePix}
      />
    </div>
  );
};

export default PaymentsView;


import React, { useState } from 'react';
import { XIcon, ImageIcon, PaperclipIcon } from '../Icons';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  professionalName: string;
}

const DisputeModal: React.FC<DisputeModalProps> = ({ isOpen, onClose, onSubmit, professionalName }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Por favor, descreva o problema.');
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onSubmit(reason);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Reportar Problema com {professionalName}</h2>
          <button type="button" onClick={onClose}>
            <XIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Descreva o problema
            </label>
            <p className="text-xs text-gray-500 mb-2">
                Seja claro e forneça o máximo de detalhes possível. Nossa equipe de suporte usará essa informação para mediar a situação.
            </p>
            <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={5}
                required
                placeholder="Ex: O serviço não foi concluído como combinado, a pintura da parede da sala ficou com manchas..."
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />

            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Anexar fotos (Opcional)
                </label>
                <button type="button" className="w-full flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400">
                    <PaperclipIcon className="h-5 w-5 mr-2" />
                    Clique para anexar arquivos
                </button>
            </div>
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
           <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold text-sm hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Enviando...' : 'Abrir Disputa'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DisputeModal;

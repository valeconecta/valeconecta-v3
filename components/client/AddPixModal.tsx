
import React, { useState } from 'react';
import { XIcon } from '../Icons';

interface AddPixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pixKey: string) => void;
}

const AddPixModal: React.FC<AddPixModalProps> = ({ isOpen, onClose, onSave }) => {
  const [pixKey, setPixKey] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pixKey.trim()) {
      onSave(pixKey.trim());
    } else {
      alert('Por favor, insira uma chave PIX válida.');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Adicionar Chave PIX</h2>
          <button onClick={onClose}>
            <XIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label htmlFor="pixKey" className="block text-sm font-medium text-gray-700">
              Chave PIX
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Pode ser seu CPF, CNPJ, e-mail, telefone ou uma chave aleatória.
            </p>
            <input
              type="text"
              id="pixKey"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Digite sua chave aqui"
            />
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
              className="px-4 py-2 bg-[#2A8C82] text-white rounded-lg font-semibold text-sm hover:bg-opacity-90"
            >
              Salvar Chave PIX
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPixModal;

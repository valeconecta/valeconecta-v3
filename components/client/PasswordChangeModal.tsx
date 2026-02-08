
import React from 'react';
import { XIcon } from '../Icons';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  passwordData: any;
  setPasswordData: (data: any) => void;
  errors: any;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  passwordData,
  setPasswordData,
  errors,
}) => {
  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev: any) => ({ ...prev, [name]: value }));
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
          <h2 className="text-lg font-bold">Alterar Senha</h2>
          <button onClick={onClose}>
            <XIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label
                htmlFor="current"
                className="block text-sm font-medium text-gray-700"
              >
                Senha Atual
              </label>
              <input
                type="password"
                id="current"
                name="current"
                value={passwordData.current}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              {errors.current && (
                <p className="text-xs text-red-600 mt-1">{errors.current}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Nova Senha
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              {errors.newPassword && (
                <p className="text-xs text-red-600 mt-1">{errors.newPassword}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="confirm"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                id="confirm"
                name="confirm"
                value={passwordData.confirm}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              {errors.confirm && (
                <p className="text-xs text-red-600 mt-1">{errors.confirm}</p>
              )}
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
              className="px-4 py-2 bg-[#2A8C82] text-white rounded-lg font-semibold text-sm hover:bg-opacity-90"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;

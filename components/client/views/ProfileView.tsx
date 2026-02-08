
import React, { useState } from 'react';
import { userProfile as initialProfile } from '../../../data/clientMockData';
import { EditIcon, PlusCircleIcon, SaveIcon, Trash2Icon } from '../../Icons';
import SuccessToast from '../SuccessToast';
import PasswordChangeModal from '../PasswordChangeModal';

const ProfileView: React.FC = () => {
  const [userProfile, setUserProfile] = useState(initialProfile);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [tempProfile, setTempProfile] = useState(userProfile);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State for password modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
      current: '',
      newPassword: '',
      confirm: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({
      current: '',
      newPassword: '',
      confirm: ''
  });

  const handleEditInfo = () => {
    setTempProfile(userProfile);
    setIsEditingInfo(true);
  };

  const handleCancelEditInfo = () => {
    setIsEditingInfo(false);
  };

  const handleSaveInfo = () => {
    setUserProfile(tempProfile);
    setIsEditingInfo(false);
    setSuccessMessage('Informações salvas com sucesso!');
  };
  
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
  };

  const handleAddAddress = () => {
      const newId = Math.max(0, ...userProfile.addresses.map(a => a.id)) + 1;
      const newAddress = { id: newId, name: '', fullAddress: '' };
      setUserProfile(prev => ({...prev, addresses: [...prev.addresses, newAddress]}));
  };

  const handleRemoveAddress = (id: number) => {
    setUserProfile(prev => ({ ...prev, addresses: prev.addresses.filter(addr => addr.id !== id) }));
    setSuccessMessage('Endereço removido!');
  };
  
  const handleAddressChange = (id: number, field: 'name' | 'fullAddress', value: string) => {
      setUserProfile(prev => ({
          ...prev,
          addresses: prev.addresses.map(addr => addr.id === id ? { ...addr, [field]: value } : addr)
      }));
  };
  
  const handlePasswordChange = () => {
      setPasswordData({ current: '', newPassword: '', confirm: '' });
      setPasswordErrors({ current: '', newPassword: '', confirm: '' });
      setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const errors = { current: '', newPassword: '', confirm: '' };
      let isValid = true;
      
      if (!passwordData.current) {
          errors.current = 'Senha atual é obrigatória.';
          isValid = false;
      }
      
      if (passwordData.newPassword.length < 6) {
          errors.newPassword = 'A nova senha deve ter pelo menos 6 caracteres.';
          isValid = false;
      }

      if (passwordData.newPassword !== passwordData.confirm) {
          errors.confirm = 'As senhas não coincidem.';
          isValid = false;
      }

      setPasswordErrors(errors);

      if (isValid) {
          console.log("Password change submitted:", passwordData);
          setIsPasswordModalOpen(false);
          setSuccessMessage('Senha alterada com sucesso!');
      }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Minha Conta</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Informações Pessoais</h2>
              {!isEditingInfo && (
                <button onClick={handleEditInfo} className="flex items-center text-sm font-semibold text-[#2A8C82] hover:underline">
                    <EditIcon className="h-4 w-4 mr-1"/> Editar
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nome</label>
                <input 
                    type="text" 
                    name="name"
                    value={isEditingInfo ? tempProfile.name : userProfile.name} 
                    onChange={handleInfoChange}
                    readOnly={!isEditingInfo} 
                    className={`w-full p-2 border rounded-md mt-1 ${isEditingInfo ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <input 
                    type="email" 
                    name="email"
                    value={isEditingInfo ? tempProfile.email : userProfile.email} 
                    onChange={handleInfoChange}
                    readOnly={!isEditingInfo} 
                    className={`w-full p-2 border rounded-md mt-1 ${isEditingInfo ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
                />
              </div>
            </div>
            {isEditingInfo && (
                <div className="flex justify-end space-x-3 mt-4">
                    <button onClick={handleCancelEditInfo} className="text-sm font-semibold text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100">Cancelar</button>
                    <button onClick={handleSaveInfo} className="flex items-center text-sm font-semibold text-white bg-[#2A8C82] px-4 py-2 rounded-md hover:bg-opacity-90">
                        <SaveIcon className="h-4 w-4 mr-2"/>
                        Salvar
                    </button>
                </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Segurança</h2>
            <button onClick={handlePasswordChange} className="font-semibold text-[#2A8C82] border border-[#2A8C82] px-4 py-2 rounded-lg hover:bg-[#E8F3F1]">
              Alterar Senha
            </button>
          </div>
        </div>

        {/* Addresses */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Meus Endereços</h2>
          <div className="space-y-4">
            {userProfile.addresses.map(addr => (
              <div key={addr.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
                  <input 
                    type="text"
                    placeholder="Ex: Casa, Escritório"
                    value={addr.name}
                    onChange={(e) => handleAddressChange(addr.id, 'name', e.target.value)}
                    className="w-full p-1 border-b font-semibold text-gray-700"
                  />
                  <input 
                    type="text"
                    placeholder="Endereço completo"
                    value={addr.fullAddress}
                    onChange={(e) => handleAddressChange(addr.id, 'fullAddress', e.target.value)}
                    className="w-full p-1 border-b text-sm text-gray-600"
                  />
                   <div className="flex justify-end pt-2">
                       <button onClick={() => handleRemoveAddress(addr.id)} className="text-xs font-semibold text-red-600 hover:underline">Remover</button>
                   </div>
              </div>
            ))}
          </div>
          <button onClick={handleAddAddress} className="mt-6 w-full flex items-center justify-center bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-200">
            <PlusCircleIcon className="h-5 w-5 mr-2"/>
            Adicionar Novo Endereço
          </button>
        </div>
      </div>
       {successMessage && (
        <SuccessToast 
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
        />
      )}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordSubmit}
        passwordData={passwordData}
        setPasswordData={setPasswordData}
        errors={passwordErrors}
      />
    </div>
  );
};

export default ProfileView;

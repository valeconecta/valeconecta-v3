import React, { useState, useEffect, useMemo } from 'react';
import { Professional } from '../../../data/professionals';
import { UserSubView } from '../../../pages/AdminPage';
import { MoreHorizontalIcon, StarIcon, XIcon, SpinnerIcon, CheckCircleIcon } from '../../Icons';
import { Page } from '../../../types';
import { supabase } from '../../../supabaseClient';

interface UsersViewProps {
    initialSubView: UserSubView;
    setCurrentPage: (page: Page, id?: number) => void;
}

const statusStyles: { [key: string]: string } = {
    'Ativo': 'bg-green-100 text-green-800',
    'Suspenso': 'bg-yellow-100 text-yellow-800',
    'Banido': 'bg-red-100 text-red-800',
    'Verificação Pendente': 'bg-blue-100 text-blue-800',
}

const ActionMenu: React.FC<{ onSelect: (action: string) => void; userStatus?: string }> = ({ onSelect, userStatus }) => {
    const suspendActionText = userStatus === 'Suspenso' ? 'Reativar Conta' : 'Suspender Conta';

    return (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <button onClick={() => onSelect('view')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Ver Perfil</button>
            <button onClick={() => onSelect('suspend')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                {userStatus !== undefined ? suspendActionText : 'Suspender Conta'}
            </button>
            <button onClick={() => onSelect('reset_pw')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Resetar Senha</button>
        </div>
    );
};

// Type for client data fetched from 'profiles' table
interface ClientProfile {
    id: string; // This will be the UUID from auth.users
    full_name: string;
    // We'll need to join or fetch email separately if not in profiles
    // For now, let's assume we get it.
    email: string; 
    created_at: string;
    // Status is not in DB, so we'll mock it for the UI
    status: 'Ativo' | 'Suspenso' | 'Banido';
}


const ClientProfileModal: React.FC<{ client: ClientProfile; onClose: () => void }> = ({ client, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose} aria-modal="true" role="dialog">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Perfil do Cliente</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Fechar">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-[#E8F3F1] rounded-full flex items-center justify-center text-[#2A8C82] font-bold text-3xl">
                            {client.full_name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{client.full_name}</h3>
                            <p className="text-sm text-gray-500">{client.email}</p>
                        </div>
                    </div>
                    <div className="mt-6 border-t pt-6">
                        <h4 className="font-semibold text-gray-700 mb-4">Detalhes da Conta</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">ID do Cliente</p>
                                <p className="font-medium text-gray-800 font-mono text-xs">{client.id}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Membro Desde</p>
                                <p className="font-medium text-gray-800">{new Date(client.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Status</p>
                                <p className="font-medium text-gray-800">
                                    <span className={`${statusStyles[client.status]} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                                        {client.status}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                     <div className="mt-6 border-t pt-6">
                        <h4 className="font-semibold text-gray-700 mb-4">Atividade (Simulado)</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-[#2A8C82]">5</p>
                                <p className="text-xs text-gray-500">Tarefas Criadas</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[#2A8C82]">3</p>
                                <p className="text-xs text-gray-500">Tarefas Concluídas</p>
                            </div>
                             <div>
                                <p className="text-2xl font-bold text-[#2A8C82]">R$ 450,00</p>
                                <p className="text-xs text-gray-500">Valor Gasto</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

type ModalState = {
    isOpen: boolean;
    userEmail?: string;
    userName?: string;
    status: 'idle' | 'confirming' | 'loading' | 'success' | 'error';
    error?: string;
};

const ResetPasswordModal: React.FC<{
    modalState: ModalState;
    onClose: () => void;
    onConfirm: () => void;
}> = ({ modalState, onClose, onConfirm }) => {
    const { status, userName, userEmail, error } = modalState;

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="p-8 text-center">
                        <SpinnerIcon className="h-12 w-12 text-[#2A8C82] animate-spin mx-auto" />
                        <h3 className="mt-4 text-lg font-medium text-gray-700">Enviando e-mail...</h3>
                    </div>
                );
            case 'success':
                return (
                    <div className="p-8 text-center">
                        <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto" />
                        <h3 className="mt-4 text-lg font-medium text-gray-800">E-mail Enviado!</h3>
                        <p className="mt-2 text-sm text-gray-600">Um link para redefinição de senha foi enviado para <strong>{userEmail}</strong>.</p>
                        <div className="mt-6">
                            <button onClick={onClose} className="w-full bg-gray-200 text-gray-800 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-300">Fechar</button>
                        </div>
                    </div>
                );
            case 'error':
                return (
                    <div className="p-8 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                           <XIcon className="h-7 w-7 text-red-600" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-800">Ocorreu um Erro</h3>
                        <p className="mt-2 text-sm text-red-700 bg-red-50 p-3 rounded-md">{error || 'Não foi possível enviar o e-mail.'}</p>
                        <div className="mt-6">
                            <button onClick={onClose} className="w-full bg-gray-200 text-gray-800 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-300">Fechar</button>
                        </div>
                    </div>
                );
            case 'confirming':
            default:
                return (
                    <>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800">Confirmar Ação</h3>
                            <p className="mt-2 text-gray-600">
                                Você tem certeza que deseja enviar um e-mail de redefinição de senha para <strong>{userName}</strong> ({userEmail})?
                            </p>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-xl">
                            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">Cancelar</button>
                            <button onClick={onConfirm} className="px-4 py-2 bg-[#2A8C82] text-white rounded-lg font-semibold hover:bg-opacity-90">Enviar E-mail</button>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={status !== 'loading' ? onClose : undefined}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                {renderContent()}
            </div>
        </div>
    );
};


// Extend Professional type for admin view
type AdminProfessional = Professional & { email: string; status: string; };


const UsersView: React.FC<UsersViewProps> = ({ initialSubView, setCurrentPage }) => {
    const [activeTab, setActiveTab] = useState<UserSubView>(initialSubView);
    const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);

    useEffect(() => {
        setActiveTab(initialSubView);
    }, [initialSubView]);
    
    // Client state
    const [clientsList, setClientsList] = useState<ClientProfile[]>([]);
    const [isLoadingClients, setIsLoadingClients] = useState(true);
    const [clientStatusFilter, setClientStatusFilter] = useState('Todos');
    const [clientSearch, setClientSearch] = useState('');
    const [clientPage, setClientPage] = useState(1);
    const [viewingClient, setViewingClient] = useState<ClientProfile | null>(null);
    const clientsPerPage = 7;

    const [modalState, setModalState] = useState<ModalState>({ isOpen: false, status: 'idle' });
    
    useEffect(() => {
      if (activeTab === 'clients') {
          const fetchClients = async () => {
              setIsLoadingClients(true);
              // In a real scenario, we would join with auth.users to get the email.
              // For now, we assume 'profiles' has the necessary info or we fetch it separately.
              // This is a simplified query.
              const { data, error } = await supabase
                  .from('profiles')
                  .select('id, full_name, created_at')
                  .eq('role', 'client');
              
              if (error) {
                  console.error('Error fetching clients:', error);
                  setClientsList([]);
              } else {
                  // Mocking status and email for demonstration
                  const statuses = ['Ativo', 'Suspenso', 'Banido'];
                  const clientsWithDetails = data.map((client, index) => ({
                      ...client,
                      email: `${client.full_name.split(' ')[0].toLowerCase()}@email.com`,
                      status: statuses[index % statuses.length],
                  }));
                  setClientsList(clientsWithDetails as ClientProfile[]);
              }
              setIsLoadingClients(false);
          };
          fetchClients();
      }
    }, [activeTab]);


    const handleCloseModal = () => {
        setModalState({ isOpen: false, status: 'idle' });
        setOpenMenuId(null);
    };

    const handleResetPassword = async () => {
        if (!modalState.userEmail) return;
        setModalState(prev => ({ ...prev, status: 'loading' }));
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(modalState.userEmail, {
                redirectTo: window.location.origin,
            });
            if (error) {
                if (error.message.toLowerCase().includes('user not found')) {
                    throw new Error('Usuário não encontrado no sistema de autenticação. O e-mail pode estar incorreto ou o usuário não foi cadastrado via autenticação.');
                }
                throw error;
            }
            setModalState(prev => ({ ...prev, status: 'success' }));
        } catch (error: any) {
            setModalState(prev => ({ ...prev, status: 'error', error: error.message }));
        }
    };

    const filteredClients = useMemo(() => {
        return clientsList
            .filter(c => clientStatusFilter === 'Todos' || c.status === clientStatusFilter)
            .filter(c => c.full_name.toLowerCase().includes(clientSearch.toLowerCase()) || c.email.toLowerCase().includes(clientSearch.toLowerCase()));
    }, [clientsList, clientStatusFilter, clientSearch]);

    const paginatedClients = useMemo(() => {
        const startIndex = (clientPage - 1) * clientsPerPage;
        return filteredClients.slice(startIndex, startIndex + clientsPerPage);
    }, [filteredClients, clientPage]);
    
    const totalClientPages = Math.ceil(filteredClients.length / clientsPerPage);

    const handleAction = async (clientId: string, action: string) => {
        const client = clientsList.find(c => c.id === clientId);
        if (!client) return;
    
        switch (action) {
            case 'view':
                setViewingClient(client);
                break;
            case 'suspend':
                setClientsList(currentList =>
                    currentList.map(c => {
                        if (c.id === clientId) {
                            if (c.status === 'Banido') {
                                alert(`Não é possível alterar o status de um usuário banido.`);
                                return c;
                            }
                            const newStatus = c.status === 'Suspenso' ? 'Ativo' : 'Suspenso';
                            alert(`O status de ${c.full_name} foi alterado para ${newStatus}.`);
                            return { ...c, status: newStatus };
                        }
                        return c;
                    })
                );
                break;
            case 'reset_pw':
                 setModalState({
                    isOpen: true,
                    userEmail: client.email,
                    userName: client.full_name,
                    status: 'confirming',
                });
                return; // Prevent setOpenMenuId(null) from running immediately
        }
        setOpenMenuId(null);
    };

    // Professional state
    const [professionalsList, setProfessionalsList] = useState<AdminProfessional[]>([]);
    const [isLoadingProfessionals, setIsLoadingProfessionals] = useState(true);
    const [professionalSearch, setProfessionalSearch] = useState('');
    const [professionalCategoryFilter, setProfessionalCategoryFilter] = useState('Todas');
    const [professionalPage, setProfessionalPage] = useState(1);
    const professionalsPerPage = 7;

    useEffect(() => {
      if (activeTab === 'professionals') {
        const fetchProfessionals = async () => {
          setIsLoadingProfessionals(true);
          const { data, error } = await supabase.from('professionals').select('*');
          if (error) {
            console.error('Error fetching professionals for admin:', error);
          } else {
             // Mocking email and status for admin view as they are not in the public table
            const statuses = ['Ativo', 'Verificação Pendente', 'Suspenso'];
            const adminData = data.map((p, index) => ({
              ...p,
              email: `${p.name.toLowerCase().replace(/\s/g, '.')}@provider.com`,
              status: statuses[index % statuses.length],
            }));
            setProfessionalsList(adminData as AdminProfessional[]);
          }
          setIsLoadingProfessionals(false);
        };
        fetchProfessionals();
      }
    }, [activeTab]);
    
    const professionalCategories = useMemo(() => ['Todas', ...new Set(professionalsList.map(p => p.category))], [professionalsList]);

    const filteredProfessionals = useMemo(() => {
        return professionalsList
            .filter(p => professionalCategoryFilter === 'Todas' || p.category === professionalCategoryFilter)
            .filter(p => p.name.toLowerCase().includes(professionalSearch.toLowerCase()) || p.email.toLowerCase().includes(professionalSearch.toLowerCase()));
    }, [professionalsList, professionalCategoryFilter, professionalSearch]);

    const paginatedProfessionals = useMemo(() => {
        const startIndex = (professionalPage - 1) * professionalsPerPage;
        return filteredProfessionals.slice(startIndex, startIndex + professionalsPerPage);
    }, [filteredProfessionals, professionalPage]);

    const totalProfessionalPages = Math.ceil(filteredProfessionals.length / professionalsPerPage);
    
    const handleProfessionalAction = async (professionalId: number, action: string) => {
        const professional = professionalsList.find(p => p.id === professionalId);
        if (!professional) return;

        switch (action) {
            case 'view':
                setCurrentPage('professional-profile', professionalId);
                break;
            case 'suspend':
                setProfessionalsList(currentList =>
                    currentList.map(p => {
                        if (p.id === professionalId) {
                            if (p.status === 'Verificação Pendente' || p.status === 'Banido') {
                                alert(`Não é possível alterar o status de um profissional com status "${p.status}".`);
                                return p;
                            }
                            const newStatus = p.status === 'Suspenso' ? 'Ativo' : 'Suspenso';
                            alert(`O status de ${p.name} foi alterado para ${newStatus}.`);
                            return { ...p, status: newStatus };
                        }
                        return p;
                    })
                );
                break;
            case 'reset_pw':
                 setModalState({
                    isOpen: true,
                    userEmail: professional.email,
                    userName: professional.name,
                    status: 'confirming',
                });
                return; // Prevent setOpenMenuId(null) from running immediately
        }
        setOpenMenuId(null);
    };
    
    const renderClientsTable = () => (
         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2 md:mb-0">Clientes</h2>
                <div className="flex space-x-2">
                    <input type="text" placeholder="Buscar cliente..." value={clientSearch} onChange={e => setClientSearch(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full md:w-auto"/>
                    <select value={clientStatusFilter} onChange={e => setClientStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                        <option>Todos</option>
                        <option>Ativo</option>
                        <option>Suspenso</option>
                        <option>Banido</option>
                    </select>
                </div>
            </div>
            {isLoadingClients ? (
                <div className="text-center py-10"><SpinnerIcon className="h-8 w-8 text-[#2A8C82] animate-spin mx-auto"/></div>
            ) : (
                <>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Nome</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Data de Cadastro</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedClients.map(client => (
                                <tr key={client.id} className="bg-white border-b">
                                    <td className="px-6 py-4 font-medium text-gray-900">{client.full_name}</td>
                                    <td className="px-6 py-4">{client.email}</td>
                                    <td className="px-6 py-4">{new Date(client.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`${statusStyles[client.status]} text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="relative inline-block">
                                            <button onClick={() => setOpenMenuId(openMenuId === client.id ? null : client.id)} className="p-1 rounded-full hover:bg-gray-200">
                                                <MoreHorizontalIcon className="h-5 w-5 text-gray-600" />
                                            </button>
                                            {openMenuId === client.id && <ActionMenu onSelect={(action) => handleAction(client.id, action)} userStatus={client.status} />}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-600">Página {clientPage} de {totalClientPages}</span>
                    <div className="flex space-x-2">
                        <button onClick={() => setClientPage(p => Math.max(1, p - 1))} disabled={clientPage === 1} className="px-3 py-1 text-sm border rounded-md disabled:opacity-50">Anterior</button>
                        <button onClick={() => setClientPage(p => Math.min(totalClientPages, p + 1))} disabled={clientPage === totalClientPages} className="px-3 py-1 text-sm border rounded-md disabled:opacity-50">Próxima</button>
                    </div>
                </div>
                </>
            )}
        </div>
    );
    
    const renderProfessionalsTable = () => (
         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2 md:mb-0">Profissionais (Conectados)</h2>
                <div className="flex space-x-2">
                    <input type="text" placeholder="Buscar profissional..." value={professionalSearch} onChange={e => setProfessionalSearch(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full md:w-auto"/>
                    <select value={professionalCategoryFilter} onChange={e => setProfessionalCategoryFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                        {professionalCategories.map(cat => <option key={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>
            {isLoadingProfessionals ? <p>Carregando...</p> : (
            <>
              <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                              <th className="px-6 py-3">Nome</th>
                              <th className="px-6 py-3">Categoria</th>
                              <th className="px-6 py-3">Avaliação</th>
                              <th className="px-6 py-3">Status</th>
                              <th className="px-6 py-3 text-center">Ações</th>
                          </tr>
                      </thead>
                      <tbody>
                          {paginatedProfessionals.map(pro => (
                              <tr key={pro.id} className="bg-white border-b">
                                  <td className="px-6 py-4 font-medium text-gray-900">{pro.name}</td>
                                  <td className="px-6 py-4">{pro.category}</td>
                                  <td className="px-6 py-4 flex items-center">
                                      <StarIcon className="h-4 w-4 text-yellow-400 mr-1"/>
                                      {pro.rating.toFixed(1)} <span className="text-gray-400 ml-1">({pro.reviewCount})</span>
                                  </td>
                                  <td className="px-6 py-4">
                                      <span className={`${statusStyles[pro.status]} text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full`}>
                                          {pro.status}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                      <div className="relative inline-block">
                                          <button onClick={() => setOpenMenuId(openMenuId === pro.id ? null : pro.id)} className="p-1 rounded-full hover:bg-gray-200">
                                              <MoreHorizontalIcon className="h-5 w-5 text-gray-600" />
                                          </button>
                                          {openMenuId === pro.id && <ActionMenu onSelect={(action) => handleProfessionalAction(pro.id, action)} userStatus={pro.status} />}
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
              <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-600">Página {professionalPage} de {totalProfessionalPages}</span>
                  <div className="flex space-x-2">
                      <button onClick={() => setProfessionalPage(p => Math.max(1, p - 1))} disabled={professionalPage === 1} className="px-3 py-1 text-sm border rounded-md disabled:opacity-50">Anterior</button>
                      <button onClick={() => setProfessionalPage(p => Math.min(totalProfessionalPages, p + 1))} disabled={professionalPage === totalProfessionalPages} className="px-3 py-1 text-sm border rounded-md disabled:opacity-50">Próxima</button>
                  </div>
              </div>
            </>
            )}
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestão de Usuários</h1>
            <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-4">
                    <button onClick={() => setActiveTab('clients')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'clients' ? 'border-b-2 border-[#2A8C82] text-[#2A8C82]' : 'text-gray-500'}`}>
                        Clientes
                    </button>
                    <button onClick={() => setActiveTab('professionals')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'professionals' ? 'border-b-2 border-[#2A8C82] text-[#2A8C82]' : 'text-gray-500'}`}>
                        Profissionais
                    </button>
                </nav>
            </div>

            {activeTab === 'clients' ? renderClientsTable() : renderProfessionalsTable()}

            {viewingClient && <ClientProfileModal client={viewingClient} onClose={() => setViewingClient(null)} />}
            {modalState.isOpen && (
                <ResetPasswordModal
                    modalState={modalState}
                    onClose={handleCloseModal}
                    onConfirm={handleResetPassword}
                />
            )}
        </div>
    );
};

export default UsersView;
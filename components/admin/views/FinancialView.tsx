import React, { useState, useMemo, useEffect } from 'react';
import { transactions, withdrawalRequests as initialWithdrawalRequests } from '../../../data/adminMockData';
import { FinancialSubView } from '../../../pages/AdminPage';

const transactionStatusStyles: { [key: string]: string } = {
    'Concluído': 'bg-green-100 text-green-800',
    'Pendente': 'bg-yellow-100 text-yellow-800',
    'Falhou': 'bg-red-100 text-red-800',
};

type ConfirmationModalState = {
    isOpen: boolean;
    action: 'approve' | 'deny' | null;
    requestId: number | null;
    message: string;
};

const ConfirmationModal: React.FC<{
    state: ConfirmationModalState;
    onClose: () => void;
    onConfirm: () => void;
}> = ({ state, onClose, onConfirm }) => {
    if (!state.isOpen) return null;

    const isApproval = state.action === 'approve';
    const confirmButtonClasses = isApproval
        ? 'bg-green-600 hover:bg-green-700'
        : 'bg-red-600 hover:bg-red-700';
    const confirmButtonText = isApproval ? 'Sim, Aprovar' : 'Sim, Negar';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800">Confirmar Ação</h3>
                    <p className="mt-2 text-gray-600">{state.message}</p>
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">Cancelar</button>
                    <button onClick={onConfirm} className={`px-4 py-2 text-white rounded-lg font-semibold ${confirmButtonClasses}`}>
                        {confirmButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface FinancialViewProps {
    initialSubView: FinancialSubView;
}

const FinancialView: React.FC<FinancialViewProps> = ({ initialSubView }) => {
    const [activeTab, setActiveTab] = useState<FinancialSubView>(initialSubView);

    useEffect(() => {
        setActiveTab(initialSubView);
    }, [initialSubView]);

    // State for transactions filters and pagination
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [page, setPage] = useState(1);
    const itemsPerPage = 7;

    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(t => typeFilter === 'Todos' || t.type === typeFilter)
            .filter(t => statusFilter === 'Todos' || t.status === statusFilter)
            .filter(t => t.id.toLowerCase().includes(search.toLowerCase()) || t.user.toLowerCase().includes(search.toLowerCase()));
    }, [typeFilter, statusFilter, search]);

    const paginatedTransactions = useMemo(() => {
        const startIndex = (page - 1) * itemsPerPage;
        return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredTransactions, page]);
    
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    // State for withdrawals
    const [withdrawals, setWithdrawals] = useState(initialWithdrawalRequests);
    const [confirmationModalState, setConfirmationModalState] = useState<ConfirmationModalState>({
        isOpen: false, action: null, requestId: null, message: ''
    });

    const handleApproveClick = (requestId: number) => {
        const request = withdrawals.find(r => r.id === requestId);
        if (!request) return;
        setConfirmationModalState({
            isOpen: true,
            action: 'approve',
            requestId,
            message: `Tem certeza que deseja APROVAR o saque de ${request.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} para ${request.professional}?`
        });
    };
    
    const handleDenyClick = (requestId: number) => {
        const request = withdrawals.find(r => r.id === requestId);
        if (!request) return;
        setConfirmationModalState({
            isOpen: true,
            action: 'deny',
            requestId,
            message: `Tem certeza que deseja NEGAR o saque para ${request.professional}? A ação não pode ser desfeita.`
        });
    };

    const handleConfirmAction = () => {
        const { action, requestId } = confirmationModalState;
        if (!action || requestId === null) return;
        
        setWithdrawals(current => current.filter(r => r.id !== requestId));
        
        handleCloseModal();
        alert(`Saque ${action === 'approve' ? 'aprovado' : 'negado'} com sucesso.`);
    };

    const handleCloseModal = () => {
        setConfirmationModalState({ isOpen: false, action: null, requestId: null, message: '' });
    };


    const renderTransactionsTable = () => (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Extrato Mestre de Transações</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <input type="text" placeholder="Buscar por ID ou usuário..." value={search} onChange={e => setSearch(e.target.value)} className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md text-sm"/>
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option>Todos os Tipos</option>
                    <option>Pagamento Cliente</option>
                    <option>Comissão</option>
                    <option>Repasse Profissional</option>
                    <option>Saque</option>
                    <option>Reembolso</option>
                </select>
                 <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option>Todos os Status</option>
                    <option>Concluído</option>
                    <option>Pendente</option>
                    <option>Falhou</option>
                </select>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">ID da Transação</th>
                            <th className="px-6 py-3">Data</th>
                            <th className="px-6 py-3">Tipo</th>
                            <th className="px-6 py-3">Usuário</th>
                            <th className="px-6 py-3">Valor</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedTransactions.map(t => (
                            <tr key={t.id} className="bg-white border-b">
                                <td className="px-6 py-4 font-mono text-xs">{t.id}</td>
                                <td className="px-6 py-4">{t.date}</td>
                                <td className="px-6 py-4 font-medium text-gray-800">{t.type}</td>
                                <td className="px-6 py-4">{t.user}</td>
                                <td className={`px-6 py-4 font-bold ${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`${transactionStatusStyles[t.status]} text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full`}>
                                        {t.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-600">Página {page} de {totalPages}</span>
                <div className="flex space-x-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 text-sm border rounded-md disabled:opacity-50">Anterior</button>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 text-sm border rounded-md disabled:opacity-50">Próxima</button>
                </div>
            </div>
        </div>
    );

    const renderWithdrawalsTable = () => (
         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Solicitações de Saque</h2>
             {withdrawals.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    <p>Não há solicitações de saque pendentes.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Profissional</th>
                                <th className="px-6 py-3">Valor</th>
                                <th className="px-6 py-3">Data</th>
                                <th className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {withdrawals.map(req => (
                                <tr key={req.id} className="bg-white border-b">
                                    <td className="px-6 py-4 font-medium text-gray-900">{req.professional}</td>
                                    <td className="px-6 py-4">{req.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                    <td className="px-6 py-4">{req.date}</td>
                                    <td className="px-6 py-4 text-center flex justify-center space-x-3">
                                        <button onClick={() => handleDenyClick(req.id)} className="font-semibold text-red-600 hover:text-red-800 transition-colors">Negar</button>
                                        <button onClick={() => handleApproveClick(req.id)} className="font-semibold text-green-600 hover:text-green-800 transition-colors">Aprovar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );


    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Financeiro</h1>

            <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-4">
                    <button onClick={() => setActiveTab('transactions')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'transactions' ? 'border-b-2 border-[#2A8C82] text-[#2A8C82]' : 'text-gray-500'}`}>
                        Transações
                    </button>
                    <button onClick={() => setActiveTab('withdrawals')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'withdrawals' ? 'border-b-2 border-[#2A8C82] text-[#2A8C82]' : 'text-gray-500'}`}>
                        Solicitações de Saque
                    </button>
                </nav>
            </div>

            {activeTab === 'transactions' ? renderTransactionsTable() : renderWithdrawalsTable()}
            
            <ConfirmationModal
                state={confirmationModalState}
                onClose={handleCloseModal}
                onConfirm={handleConfirmAction}
            />
        </div>
    );
};

export default FinancialView;
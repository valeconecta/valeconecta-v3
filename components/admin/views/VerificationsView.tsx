import React, { useState } from 'react';
import { verificationRequests as initialVerificationRequests } from '../../../data/adminMockData';
import SuccessToast from '../../client/SuccessToast';

const VerificationsView = () => {
    const [requests, setRequests] = useState(initialVerificationRequests);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const currentRequest = requests.length > 0 ? requests[0] : null;
    const nextRequest = requests.length > 1 ? requests[1] : null;

    const handleApprove = () => {
        if (!currentRequest) return;
        
        // Em um aplicativo real, aqui você atualizaria o status do profissional no banco de dados.
        // Para esta simulação, apenas exibiremos uma mensagem de sucesso e passaremos para a próxima solicitação.
        
        setSuccessMessage(`Profissional ${currentRequest.name} aprovado com sucesso!`);
        
        // Remove a solicitação processada da fila
        setTimeout(() => {
            setRequests(prev => prev.slice(1));
        }, 300); // Pequeno atraso para melhor UX
    };

    const handleReject = () => {
        if (!currentRequest) return;
        
        // Aqui você registraria a rejeição, possivelmente com um motivo.
        
        setSuccessMessage(`Verificação de ${currentRequest.name} rejeitada.`);
        
        // Remove a solicitação processada da fila
        setTimeout(() => {
            setRequests(prev => prev.slice(1));
        }, 300);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Verificações e Onboarding</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Fila de Verificação ({requests.length} pendentes)</h2>
                
                {currentRequest ? (
                    <>
                        {/* Interface de Verificação Lado a Lado */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <h3 className="font-bold text-lg">{currentRequest.name} - <span className="text-gray-500 font-medium">Enviado em {currentRequest.date}</span></h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                {/* Lado Esquerdo: Documentos */}
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Documento Enviado</h4>
                                    <div className="bg-gray-100 rounded-md flex items-center justify-center h-64">
                                        <img src={currentRequest.docUrl} alt="Documento do profissional" className="max-h-full max-w-full rounded-md" />
                                    </div>
                                </div>
                                {/* Lado Direito: Dados do Formulário */}
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Dados do Formulário</h4>
                                    <div className="space-y-3 bg-gray-50 p-4 rounded-md">
                                        <div>
                                            <label className="text-xs font-medium text-gray-500">Documento</label>
                                            <p className="font-mono text-sm text-gray-800">{currentRequest.formData.doc}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500">Endereço</label>
                                            <p className="text-sm text-gray-800">{currentRequest.formData.address}</p>
                                        </div>
                                    </div>
                                    {/* Ações */}
                                    <div className="flex space-x-4 mt-6">
                                        <button onClick={handleReject} className="flex-1 bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700">Rejeitar</button>
                                        <button onClick={handleApprove} className="flex-1 bg-[#2A8C82] text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90">Aprovar Verificação</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lista de Próximos na Fila */}
                        {nextRequest && (
                            <div className="mt-6">
                                <h3 className="font-semibold text-gray-700">Próximo na fila:</h3>
                                <p className="text-sm text-gray-600">{nextRequest.name}</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 mx-auto text-green-500 mb-4"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        <h3 className="text-lg font-semibold text-gray-700">Fila de verificação limpa!</h3>
                        <p>Não há novas solicitações de verificação no momento.</p>
                    </div>
                )}
            </div>
            
            {successMessage && (
                <SuccessToast 
                    message={successMessage}
                    onClose={() => setSuccessMessage(null)}
                />
            )}
        </div>
    );
};

export default VerificationsView;
import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { ArrowLeftIcon, ShieldCheckIcon, SpinnerIcon } from '../components/Icons';
import ProposalCard from '../components/client/ProposalCard';
import ClientHeader from '../components/client/ClientHeader';
import PaymentModal from '../components/client/PaymentModal';
import { DetailedProfessional } from '../data/professionalProfileMockData';
import { supabase } from '../supabaseClient';
import { Professional } from '../data/professionals';

interface CompareProposalsPageProps {
  taskId: number;
  setCurrentPage: (page: Page, id?: number) => void;
}

type ProposalWithDetails = Professional & {
    price: number;
    message: string;
    proposalId: number;
    profile_id: string; // The UUID from profiles table
};

const CompareProposalsPage: React.FC<CompareProposalsPageProps> = ({ taskId, setCurrentPage }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [proposals, setProposals] = useState<ProposalWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<ProposalWithDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const { data: taskData, error: taskError } = await supabase
                .from('tasks')
                .select('title')
                .eq('id', taskId)
                .single();
            if (taskError) throw taskError;
            setTaskTitle(taskData.title);

            const { data: proposalsData, error: proposalsError } = await supabase
                .from('proposals')
                .select('id, price, message, professional_id, profile:profiles(full_name, avatar_url)')
                .eq('task_id', taskId);
            if (proposalsError) throw proposalsError;
            
            // NOTE: This part is a workaround for the disconnected 'professionals' table.
            // It fetches basic profile info but lacks rich data like ratings.
            const formattedProposals = proposalsData.map((p: any) => ({
                id: p.professional_id, // Using UUID as id for now
                profile_id: p.professional_id,
                name: p.profile.full_name,
                photoUrl: p.profile.avatar_url || `https://i.pravatar.cc/150?u=${p.professional_id}`,
                price: p.price,
                message: p.message,
                proposalId: p.id,
                // Mocking data that is not available due to disconnected tables
                rating: 4.5 + (p.id % 5)/10, // Mock rating
                reviewCount: 20 + (p.id % 10) * 5, // Mock reviews
                medalhas: [],
            })) as unknown as ProposalWithDetails[];

            setProposals(formattedProposals);
        } catch (error) {
            console.error("Error fetching proposals:", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, [taskId]);


  const handleAcceptProposal = (proposal: ProposalWithDetails) => {
    setSelectedProposal(proposal);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async () => {
    if (!selectedProposal) return;

    try {
        // 1. Update task status, assign professional and price
        const { error: taskUpdateError } = await supabase
            .from('tasks')
            .update({ 
                status: 'scheduled', 
                professional_id: selectedProposal.profile_id, 
                price: selectedProposal.price 
            })
            .eq('id', taskId);
        if (taskUpdateError) throw taskUpdateError;

        // 2. Update accepted proposal's status
        const { error: proposalUpdateError } = await supabase
            .from('proposals')
            .update({ status: 'accepted' })
            .eq('id', selectedProposal.proposalId);
        if (proposalUpdateError) throw proposalUpdateError;
        
        // NOTE: Rejecting other proposals can be done here or via a DB trigger.
        // For simplicity, we are skipping it in this refactor.

        setPaymentModalOpen(false);
        setCurrentPage('task-detail', taskId);

    } catch(error) {
        console.error("Error accepting proposal:", error);
        alert('Ocorreu um erro ao aceitar a proposta. Tente novamente.');
    }
  };
  
  if (isLoading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <SpinnerIcon className="h-10 w-10 text-[#2A8C82] animate-spin"/>
        </div>
    );
  }


  return (
    <div className="bg-gray-50 min-h-screen">
      <ClientHeader activeView="tasks" setActiveView={() => {}} setCurrentPage={setCurrentPage} isSubPage />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => setCurrentPage('client-dashboard')} className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Voltar para Minhas Tarefas
        </button>
        
        <h1 className="text-3xl font-bold text-gray-800">Compare as Propostas</h1>
        <p className="mt-2 text-lg text-gray-600">Para: <span className="font-semibold">{taskTitle}</span></p>

        {proposals.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {proposals.map(prof => (
                    <ProposalCard 
                    key={prof.proposalId}
                    professional={prof as unknown as DetailedProfessional & { price: number; message: string }}
                    onAccept={() => handleAcceptProposal(prof)}
                    onChat={() => alert(`Para conversar com ${prof.name}, primeiro aceite e pague a proposta.`)}
                    setCurrentPage={setCurrentPage}
                    />
                ))}
            </div>
        ) : (
            <div className="mt-8 text-center bg-white p-10 rounded-lg border">
                <h3 className="text-xl font-semibold text-gray-700">Aguardando Propostas</h3>
                <p className="text-gray-500 mt-2">Nenhum profissional enviou uma proposta ainda. Você será notificado assim que a primeira chegar!</p>
            </div>
        )}

        <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6 flex items-start">
            <ShieldCheckIcon className="h-8 w-8 text-green-600 flex-shrink-0 mr-4" />
            <div>
                <h3 className="font-bold text-green-800">Seu pagamento está seguro.</h3>
                <p className="text-sm text-green-700 mt-1">
                    Lembre-se: seu pagamento fica retido conosco e só é liberado para o profissional 3 dias após você confirmar a conclusão do serviço. Isso é parte da nossa Garantia de Confiança.
                </p>
            </div>
        </div>
      </main>

      {selectedProposal && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          onSubmit={handlePaymentSuccess}
          professionalName={selectedProposal.name}
          price={selectedProposal.price}
        />
      )}
    </div>
  );
};

export default CompareProposalsPage;
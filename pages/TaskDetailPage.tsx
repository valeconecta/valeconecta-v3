import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { getTaskById, getClientById, getProfessionalById, DetailedTask, TaskStatus, supportUser, openDispute } from '../data/taskDetailMockData';
import { ArrowLeftIcon, MessageSquareIcon, ClipboardListIcon, SpinnerIcon } from '../components/Icons';
import StatusStepper from '../components/task/StatusStepper';
import ChatWorkspace from '../components/task/ChatWorkspace';
import ReferencePanel from '../components/task/ReferencePanel';
import RatingModal from '../components/task/RatingModal';
import DisputeModal from '../components/task/DisputeModal';
import { Professional } from '../data/professionals';
import { supabase } from '../supabaseClient';
import { checkAndAwardBadges } from '../data/gamificationService';

interface TaskDetailPageProps {
  taskId: number;
  currentUserRole: 'client' | 'professional';
  setCurrentPage: (page: Page, id?: number) => void;
}

// FIX: Define a consistent type for user profiles involved in a task.
interface UserProfile {
    id: string;
    name: string;
    photoUrl: string;
}

const TaskDetailPage: React.FC<TaskDetailPageProps> = ({ taskId, currentUserRole, setCurrentPage }) => {
  const [task, setTask] = useState<DetailedTask | null>(null);
  const [professional, setProfessional] = useState<UserProfile & { rating: number } | null>(null);
  const [client, setClient] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isRatingModalOpen, setRatingModalOpen] = useState(false);
  const [isDisputeModalOpen, setDisputeModalOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'chat' | 'details'>('chat');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const taskData = await getTaskById(taskId);
      if (taskData) {
        setTask(taskData);
        const [profData, clientData] = await Promise.all([
            getProfessionalById(taskData.professionalId),
            getClientById(taskData.clientId)
        ]);
        if(profData) setProfessional(profData);
        if(clientData) setClient(clientData);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [taskId]);

  if (isLoading || !task || !professional || !client) {
    return <div className="h-screen flex items-center justify-center"><SpinnerIcon className="h-10 w-10 animate-spin text-[#2A8C82]"/></div>;
  }
  
  const handleStatusChange = async (newStatus: TaskStatus) => {
    const { data, error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId)
        .select()
        .single();
    
    if (error) {
        console.error("Error updating status:", error);
        alert("Não foi possível atualizar o status. Tente novamente.");
    } else {
        setTask(prevTask => prevTask ? { ...prevTask, status: data.status } : null);
        if (newStatus === 'Confirmado Pelo Cliente' && currentUserRole === 'client') {
            setTimeout(() => setRatingModalOpen(true), 500);
        }
    }
  };
  
  const handleRatingSubmit = async (rating: number, comment: string) => {
    if (!task || !professional) return;
    
    console.log(`Rating submitted for task ${task.id}:`, { rating, comment });

    try {
        const { data: profDetails } = await supabase.from('professionals').select('id').eq('profile_id', professional.id).single();
        if(!profDetails) throw new Error("Professional details not found for gamification check.");

        const { error: reviewError } = await supabase.from('reviews').insert({
            professional_id: profDetails.id, // numeric ID for relation
            clientName: client.name,
            date: new Date().toISOString(),
            rating: rating,
            comment: comment,
            service: task.title
        });
        if (reviewError) throw reviewError;

        // The rest of the logic can be a database function/trigger for atomicity
        // For now, we continue on the client:
        const { data: currentProf, error: fetchError } = await supabase
            .from('professionals')
            .select('rating, reviewCount')
            .eq('id', profDetails.id)
            .single();
        if (fetchError || !currentProf) throw fetchError || new Error("Professional not found");

        const newReviewCount = currentProf.reviewCount + 1;
        const newAverageRating = ((currentProf.rating * currentProf.reviewCount) + rating) / newReviewCount;

        const { error: updateError } = await supabase
            .from('professionals')
            .update({ rating: newAverageRating, reviewCount: newReviewCount })
            .eq('id', profDetails.id);
        if (updateError) throw updateError;
        
        const newBadge = await checkAndAwardBadges(profDetails.id);
        if (newBadge) {
            sessionStorage.setItem('newBadgeNotification', JSON.stringify(newBadge));
        }

    } catch (error) {
        console.error("Error processing rating:", error);
    } finally {
        handleStatusChange('Avaliado');
        setRatingModalOpen(false);
    }
  };
  
  const handleSendMessage = async (message: string) => {
    if (!task) return;
    const senderId = currentUserRole === 'client' ? client.id : professional.id;
    
    const { data, error } = await supabase
        .from('chat_messages')
        .insert({
            task_id: taskId,
            sender_id: senderId,
            message_text: message
        })
        .select()
        .single();

    if (error) {
        console.error("Error sending message:", error);
    } else {
        const newMessage = {
            senderId: data.sender_id,
            text: data.message_text,
            timestamp: new Date(data.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setTask(prevTask => prevTask ? { ...prevTask, chatHistory: [...prevTask.chatHistory, newMessage] } : null);
    }
  }

  const handleDisputeSubmit = async (reason: string) => {
    const updatedTask = await openDispute(taskId, reason, client.id);
    if(updatedTask) {
        setTask(updatedTask);
    }
    setDisputeModalOpen(false);
  };

  const handleContactSupport = async () => {
    if (!task) return;
    const supportAlreadyCalled = task.chatHistory.some(m => m.senderId === supportUser.id || m.senderId === '0');
    if (supportAlreadyCalled) {
        alert("O suporte já foi acionado para esta tarefa.");
        return;
    }
    
    const messagesToInsert = [
        { task_id: taskId, sender_id: '0', message_text: 'O Suporte da Vale Conecta foi acionado e entrou na conversa.' },
        { task_id: taskId, sender_id: supportUser.id, message_text: 'Olá! Sou do suporte da Vale Conecta. Como posso ajudar?' }
    ];

    const { error } = await supabase.from('chat_messages').insert(messagesToInsert);
    if(error) {
        console.error("Error contacting support:", error);
    } else {
        const newMessages = messagesToInsert.map(m => ({
            senderId: m.sender_id,
            text: m.message_text,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }));
        setTask(prevTask => prevTask ? { ...prevTask, chatHistory: [...prevTask.chatHistory, ...newMessages] } : null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800 truncate">
              {task.title}
            </h1>
            <button onClick={() => setCurrentPage(currentUserRole === 'client' ? 'client-dashboard' : 'professional-dashboard')} className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-800">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Voltar ao Painel
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Tabs */}
        <div className="sm:hidden mb-4">
            <div className="flex border-b border-gray-200">
                <button onClick={() => setMobileView('chat')} className={`flex-1 py-2 text-sm font-semibold flex items-center justify-center gap-2 ${mobileView === 'chat' ? 'border-b-2 border-[#2A8C82] text-[#2A8C82]' : 'text-gray-500'}`}>
                    <MessageSquareIcon className="h-5 w-5" /> Chat e Status
                </button>
                <button onClick={() => setMobileView('details')} className={`flex-1 py-2 text-sm font-semibold flex items-center justify-center gap-2 ${mobileView === 'details' ? 'border-b-2 border-[#2A8C82] text-[#2A8C82]' : 'text-gray-500'}`}>
                    <ClipboardListIcon className="h-5 w-5" /> Detalhes
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Workspace) */}
          <div className={`lg:col-span-2 ${mobileView === 'details' ? 'hidden' : ''} sm:block`}>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
              <StatusStepper currentStatus={task.status} />
              <ChatWorkspace 
                task={task} 
                client={client}
                professional={professional}
                currentUserRole={currentUserRole}
                onStatusChange={handleStatusChange}
                onSendMessage={handleSendMessage}
                onReportProblem={() => setDisputeModalOpen(true)}
              />
            </div>
          </div>
          {/* Right Column (Reference) */}
          <div className={`lg:col-span-1 ${mobileView === 'chat' ? 'hidden' : ''} sm:block`}>
            <ReferencePanel
                task={task}
                client={client}
                professional={professional}
                currentUserRole={currentUserRole}
                onContactSupport={handleContactSupport}
            />
          </div>
        </div>
      </main>

      {isRatingModalOpen && currentUserRole === 'client' && (
        <RatingModal 
          isOpen={isRatingModalOpen}
          onClose={() => setRatingModalOpen(false)}
          onSubmit={handleRatingSubmit}
          professionalName={professional.name}
        />
      )}

      {isDisputeModalOpen && currentUserRole === 'client' && (
        <DisputeModal
            isOpen={isDisputeModalOpen}
            onClose={() => setDisputeModalOpen(false)}
            onSubmit={handleDisputeSubmit}
            professionalName={professional.name}
        />
      )}
    </div>
  );
};

export default TaskDetailPage;
import React, { useState, useEffect } from 'react';
import { Page } from '../../../types';
import { CheckCircleIcon, ChevronRightIcon, ClockIcon, XIcon, SpinnerIcon } from '../../Icons';
import RatingModal from '../../task/RatingModal';
import { supabase } from '../../../supabaseClient';

interface TasksViewProps {
  setCurrentPage: (page: Page, id?: number) => void;
}

type TaskTab = 'evaluating' | 'scheduled' | 'history';

interface EvaluatingTask {
    id: number;
    title: string;
    receivedProposals: number;
    totalProposals: number; // Mocked for UI
}

interface ScheduledTask {
    id: number;
    title: string;
    professional: string;
    date: string;
    status: string;
}

interface HistoryTask {
    id: number;
    title: string;
    professional: string;
    status: string;
    evaluationPending: boolean;
}

const TasksView: React.FC<TasksViewProps> = ({ setCurrentPage }) => {
  const [activeTab, setActiveTab] = useState<TaskTab>('evaluating');
  const [tasks, setTasks] = useState<{ evaluating: EvaluatingTask[], scheduled: ScheduledTask[], history: HistoryTask[] }>({ evaluating: [], scheduled: [], history: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [taskToRate, setTaskToRate] = useState<HistoryTask | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
        setIsLoading(true);
        // NOTA: ID do cliente mocado pois não há sistema de autenticação.
        const mockClientId = '8f5a6b02-1b1e-4c7b-83c3-6a9c5b0a1a3b';

        try {
            // Fetch tasks for 'evaluating' tab (status: open) and count proposals
            const { data: evaluatingData, error: evaluatingError } = await supabase
                .from('tasks')
                .select('id, title, proposals(count)')
                .eq('client_id', mockClientId)
                .eq('status', 'open');

            // Fetch tasks for 'scheduled' tab
            const { data: scheduledData, error: scheduledError } = await supabase
                .from('tasks')
                .select('id, title, scheduled_date, status, professional:profiles(full_name)')
                .eq('client_id', mockClientId)
                .in('status', ['scheduled', 'in_progress', 'disputed']);
            
            // Fetch tasks for 'history' tab
            const { data: historyData, error: historyError } = await supabase
                .from('tasks')
                .select('id, title, status, professional:profiles(full_name)')
                .eq('client_id', mockClientId)
                .in('status', ['completed', 'canceled', 'avaliado']);

            if (evaluatingError || scheduledError || historyError) {
                throw { evaluatingError, scheduledError, historyError };
            }

            setTasks({
                evaluating: (evaluatingData || []).map(t => ({ id: t.id, title: t.title, receivedProposals: (t.proposals as any)[0]?.count || 0, totalProposals: 5 })),
                scheduled: (scheduledData || []).map(t => ({ id: t.id, title: t.title, professional: (t.professional as any)?.full_name || 'N/A', date: t.scheduled_date ? new Date(t.scheduled_date).toLocaleDateString() : 'A agendar', status: t.status })),
                history: (historyData || []).map(t => ({ id: t.id, title: t.title, professional: (t.professional as any)?.full_name || 'N/A', status: t.status, evaluationPending: t.status === 'completed' }))
            });

        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchTasks();
  }, []);


  const handleRatingSubmit = (rating: number, comment: string) => {
    if (!taskToRate) return;

    console.log(`Rating submitted for task ${taskToRate.id}:`, { rating, comment });

    // Update the task in the local state to reflect it has been evaluated
    const updatedHistory = tasks.history.map(task => 
      task.id === taskToRate.id ? { ...task, evaluationPending: false, status: 'Avaliado' } : task
    );
    setTasks(prevTasks => ({ ...prevTasks, history: updatedHistory }));

    // Here you would also update the task status in the database
    supabase.from('tasks').update({ status: 'avaliado' }).eq('id', taskToRate.id).then();

    setTaskToRate(null); // Close the modal
  };

  const renderEvaluating = () => (
    <div className="space-y-4">
      {tasks.evaluating.map(task => (
        <button 
          key={task.id}
          onClick={() => setCurrentPage('compare-proposals', task.id)}
          className="w-full bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-[#2A8C82] flex justify-between items-center text-left"
        >
          <div>
            <h3 className="font-bold text-gray-800">{task.title}</h3>
            <p className="text-sm text-yellow-600 font-semibold mt-1">
              {task.receivedProposals} propostas recebidas
            </p>
          </div>
          <ChevronRightIcon className="h-6 w-6 text-gray-400" />
        </button>
      ))}
    </div>
  );
  
  const statusStyles: { [key: string]: string } = {
    'scheduled': 'text-blue-600',
    'in_progress': 'text-purple-600',
    'disputed': 'text-red-600',
  };

  const statusText: { [key: string]: string } = {
    'scheduled': 'Agendado',
    'in_progress': 'Em Andamento',
    'disputed': 'Em Disputa',
  }
  
  const renderScheduled = () => (
     <div className="space-y-4">
      {tasks.scheduled.map(task => (
        <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <div>
                <h3 className="font-bold text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-500 mt-1">com <span className="font-semibold">{task.professional}</span></p>
                <p className={`flex items-center text-sm font-semibold mt-2 ${statusStyles[task.status]}`}>
                    {task.status === 'disputed' ? <XIcon className="h-4 w-4 mr-2"/> : <ClockIcon className="h-4 w-4 mr-2" />}
                    {statusText[task.status]}: {task.date}
                </p>
            </div>
            <div className="flex space-x-2 mt-4 sm:mt-0">
                <button onClick={() => setCurrentPage('task-detail', task.id)} className="text-sm font-semibold text-[#2A8C82] px-3 py-1.5 rounded-md hover:bg-gray-100 border border-gray-300">Ver Detalhes</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderHistory = () => (
     <div className="space-y-4">
      {tasks.history.map(task => (
        <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 opacity-80">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <div>
                <h3 className="font-semibold text-gray-700">{task.title}</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${task.status === 'completed' || task.status === 'avaliado' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                    {task.status === 'avaliado' ? 'Avaliado' : task.status === 'completed' ? 'Concluído' : 'Cancelado'}
                </span>
            </div>
             <div className="mt-4 sm:mt-0">
                {task.evaluationPending ? (
                    <button onClick={() => setTaskToRate(task)} className="flex items-center bg-yellow-400 text-yellow-900 font-bold text-sm px-4 py-2 rounded-lg hover:bg-yellow-500">
                        Avalie o Profissional
                    </button>
                ) : (
                     <button className="flex items-center text-gray-500 font-semibold text-sm px-4 py-2 cursor-default">
                        <CheckCircleIcon className="h-5 w-5 mr-2 text-green-600"/>
                        Avaliado
                    </button>
                )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center py-10"><SpinnerIcon className="h-8 w-8 text-[#2A8C82] animate-spin mx-auto"/></div>;
    }
    switch (activeTab) {
      case 'evaluating': return tasks.evaluating.length > 0 ? renderEvaluating() : <p className="text-center text-gray-500 py-8">Nenhuma tarefa aguardando propostas.</p>;
      case 'scheduled': return tasks.scheduled.length > 0 ? renderScheduled() : <p className="text-center text-gray-500 py-8">Nenhum serviço agendado.</p>;
      case 'history': return tasks.history.length > 0 ? renderHistory() : <p className="text-center text-gray-500 py-8">Nenhum serviço no seu histórico.</p>;
      default: return null;
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Minhas Tarefas</h1>
      
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-2 sm:space-x-4 -mb-px">
          <button onClick={() => setActiveTab('evaluating')} className={`py-3 px-2 sm:px-4 text-sm font-semibold ${activeTab === 'evaluating' ? 'border-b-2 border-[#2A8C82] text-[#2A8C82]' : 'text-gray-500 hover:text-gray-800'}`}>
            Avaliando Propostas
          </button>
          <button onClick={() => setActiveTab('scheduled')} className={`py-3 px-2 sm:px-4 text-sm font-semibold ${activeTab === 'scheduled' ? 'border-b-2 border-[#2A8C82] text-[#2A8C82]' : 'text-gray-500 hover:text-gray-800'}`}>
            Agendadas
          </button>
          <button onClick={() => setActiveTab('history')} className={`py-3 px-2 sm:px-4 text-sm font-semibold ${activeTab === 'history' ? 'border-b-2 border-[#2A8C82] text-[#2A8C82]' : 'text-gray-500 hover:text-gray-800'}`}>
            Histórico
          </button>
        </nav>
      </div>

      {renderContent()}

      {taskToRate && (
        <RatingModal
            isOpen={!!taskToRate}
            onClose={() => setTaskToRate(null)}
            onSubmit={handleRatingSubmit}
            professionalName={taskToRate.professional}
        />
      )}
    </div>
  );
};

export default TasksView;
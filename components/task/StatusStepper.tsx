import React from 'react';
import { TaskStatus } from '../../data/taskDetailMockData';
import { CheckCircleIcon, XIcon } from '../Icons';

interface StatusStepperProps {
  currentStatus: TaskStatus;
}

// FIX: Changed steps to use the correct TaskStatus enum values.
const steps: TaskStatus[] = ['scheduled', 'in_progress', 'completed', 'Avaliado'];

// FIX: Added a map for displaying Portuguese labels for each status.
const statusLabels: { [key in TaskStatus]?: string } = {
  scheduled: 'Agendado',
  in_progress: 'Em Andamento',
  completed: 'Concluído',
  Avaliado: 'Avaliado',
};


const StatusStepper: React.FC<StatusStepperProps> = ({ currentStatus }) => {
  const getStepIndex = (status: TaskStatus) => {
      // FIX: Changed 'Em Disputa' to 'disputed' to match the TaskStatus type.
      if (status === 'Confirmado Pelo Cliente' || status === 'disputed') return 2;
      return steps.indexOf(status);
  }
  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="w-full pb-6 mb-4 border-b border-gray-200">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex || currentStatus === 'Avaliado';
          // FIX: Changed 'Em Disputa' to 'disputed' to match the TaskStatus type.
          const isDispute = isActive && currentStatus === 'disputed';

          let stepClasses = 'bg-gray-300';
          if (isCompleted) stepClasses = 'bg-green-500';
          if (isActive) stepClasses = 'bg-[#2A8C82]';
          if (isDispute) stepClasses = 'bg-red-600';

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${stepClasses}`}>
                  {isCompleted ? <CheckCircleIcon className="h-5 w-5 text-white" /> : 
                   isDispute ? <XIcon className="h-5 w-5 text-white" /> :
                   <span className="text-white font-bold">{index + 1}</span>}
                </div>
                <p className={`mt-2 text-xs font-semibold transition-colors duration-300 w-20 ${isActive || isCompleted ? 'text-gray-800' : 'text-gray-500'}`}>
                  {/* FIX: Changed 'Concluído' to 'completed' and used statusLabels for display. */}
                  {isDispute ? 'Em Disputa' : (step === 'completed' && currentStatus === 'Confirmado Pelo Cliente' ? 'Finalizado' : statusLabels[step] || step)}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 transition-colors duration-300 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StatusStepper;

import React, { useState, useRef, useEffect } from 'react';
import { DetailedTask, TaskStatus, supportUser } from '../../data/taskDetailMockData';
import { PaperclipIcon } from '../Icons';

interface UserProfile {
    id: string;
    name: string;
    photoUrl: string;
}

interface ChatWorkspaceProps {
    task: DetailedTask;
    client: UserProfile;
    professional: UserProfile;
    currentUserRole: 'client' | 'professional';
    onStatusChange: (newStatus: TaskStatus) => void;
    onSendMessage: (message: string) => void;
    onReportProblem: () => void;
}

const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({ task, client, professional, currentUserRole, onStatusChange, onSendMessage, onReportProblem }) => {
    const [message, setMessage] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [task.chatHistory]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };
    
    const renderActionButton = () => {
        const { status } = task;

        if (status === 'disputed') return null;

        if (currentUserRole === 'professional') {
            if (status === 'scheduled') {
                return <button onClick={() => onStatusChange('in_progress')} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">Iniciar Serviço</button>;
            }
            if (status === 'in_progress') {
                return <button onClick={() => onStatusChange('completed')} className="w-full bg-[#2A8C82] text-white font-bold py-3 rounded-lg hover:bg-opacity-90">Finalizar Serviço</button>;
            }
        }

        if (currentUserRole === 'client') {
            if (status === 'completed') {
                return (
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={onReportProblem} className="w-full bg-red-100 text-red-800 font-bold py-3 rounded-lg hover:bg-red-200 text-sm">Reportar Problema</button>
                        <button onClick={() => onStatusChange('Confirmado Pelo Cliente')} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 text-sm">Confirmar Conclusão</button>
                    </div>
                );
            }
            if (status === 'Confirmado Pelo Cliente') {
                 return <button onClick={() => onStatusChange('Confirmado Pelo Cliente')} className="w-full bg-yellow-500 text-white font-bold py-3 rounded-lg">Avaliar Profissional</button>;
            }
        }

        return null;
    };

    const renderMessage = (msg: typeof task.chatHistory[0], index: number) => {
        if (msg.senderId === '0') { // System Message
            return (
                <div key={index} className="text-center my-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{msg.text}</span>
                </div>
            )
        }
        
        const isCurrentUser = msg.senderId === (currentUserRole === 'client' ? client.id : professional.id);
        
        let sender;
        if (msg.senderId === client.id) sender = client;
        else if (msg.senderId === professional.id) sender = professional;
        else if (msg.senderId === supportUser.id) sender = supportUser;
        else return null;

        const isSupport = msg.senderId === supportUser.id;

        return (
            <div key={index} className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                {!isCurrentUser && <img src={sender.photoUrl} alt={sender.name} className={`w-8 h-8 rounded-full ${isSupport ? 'ring-2 ring-red-500' : ''}`}/>}
                <div className={`max-w-md p-3 rounded-xl ${isCurrentUser ? 'bg-[#2A8C82] text-white rounded-br-none' : isSupport ? 'bg-red-100 text-red-900 rounded-bl-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                    <p className="text-sm font-bold">{isCurrentUser ? "Você" : sender.name}</p>
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-70 text-right mt-1">{msg.timestamp}</p>
                </div>
            </div>
        );
    }


    return (
        <div className="flex-1 flex flex-col min-h-[60vh]">
            <div ref={chatContainerRef} className="flex-1 space-y-4 p-4 overflow-y-auto bg-gray-50 rounded-md">
                {task.chatHistory.map((msg, index) => renderMessage(msg, index))}
            </div>
            <div className="mt-4 pt-4 border-t">
                {task.status === 'disputed' && (
                    <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm text-center">
                        Esta tarefa está em disputa. Nossa equipe de suporte está mediando a conversa para encontrar a melhor solução.
                    </div>
                )}
                {renderActionButton()}
                <form onSubmit={handleSendMessage} className="mt-4 flex items-center space-x-2">
                    <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                        <PaperclipIcon className="h-5 w-5" />
                    </button>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2A8C82]"
                    />
                    <button type="submit" className="bg-[#2A8C82] text-white rounded-full p-2 hover:bg-opacity-90 transition-transform transform hover:scale-105">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" an fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWorkspace;
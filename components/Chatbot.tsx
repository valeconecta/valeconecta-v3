import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { MessageSquareIcon } from './Icons';
import { categories } from '../data/professionals';

interface Message {
    id: number;
    text: string;
    sender: 'bot' | 'user';
}

interface ChatbotProps {
    startSearch: (params: { query?: string; category?: string }) => void;
}

const TypingIndicator: React.FC = () => (
    <div className="flex justify-start">
        <div className="max-w-xs md:max-w-sm px-4 py-3 rounded-xl bg-[#E8F3F1] text-[#333333]">
            <div className="flex items-center justify-center space-x-1">
                <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
            </div>
        </div>
    </div>
);

const Chatbot: React.FC<ChatbotProps> = ({ startSearch }) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: 'Olá! 👋 Sou a assistente virtual da Vale Conecta. Como posso te ajudar hoje?', sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() === '' || isTyping) return;
        
        const userMessage: Message = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = inputValue;
        setInputValue('');
        setIsTyping(true);

        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const categoriesList = `["${categories.join('", "')}"]`;
            const prompt = `Analise a seguinte descrição de um serviço doméstico e identifique a categoria mais apropriada da lista fornecida.
            Lista de Categorias Válidas: ${categoriesList}
            Descrição do Serviço: "${currentInput}"
            Responda APENAS com um objeto JSON contendo uma única chave "categoria" com o valor exato da categoria encontrada na lista. Se nenhuma categoria da lista corresponder claramente, use "Reparos Gerais".`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            categoria: { 
                                type: Type.STRING,
                                enum: categories
                            }
                        },
                        required: ['categoria']
                    }
                }
            });
            
            let identifiedCategory = 'Reparos Gerais'; // Default
            if (response.text) {
                const cleanedText = response.text.trim().replace(/^```json\s*|```\s*$/g, '');
                const result = JSON.parse(cleanedText) as { categoria: string };
                if (result.categoria && categories.includes(result.categoria)) {
                    identifiedCategory = result.categoria;
                }
            }

            const botResponse: Message = { id: Date.now() + 1, text: `Entendido! Buscando os melhores profissionais de ${identifiedCategory} para você...`, sender: 'bot' };
            setMessages(prev => [...prev, botResponse]);

            setTimeout(() => {
                startSearch({ query: currentInput, category: identifiedCategory });
            }, 1500);

        } catch (error) {
            console.error("Erro ao analisar com Gemini:", error);
            const botResponse: Message = { id: Date.now() + 1, text: 'Não consegui identificar a categoria. Vou te levar para a busca para você encontrar o profissional ideal!', sender: 'bot' };
            setMessages(prev => [...prev, botResponse]);
            setTimeout(() => {
                startSearch({ query: currentInput });
            }, 1500);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl flex flex-col h-[500px] overflow-hidden border border-gray-100">
            <div className="bg-[#2A8C82] p-4 text-white flex items-center">
                <MessageSquareIcon className="h-6 w-6 mr-3" />
                <h3 className="font-bold text-lg">Agendamento Inteligente</h3>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-xl ${msg.sender === 'bot' ? 'bg-[#E8F3F1] text-[#333333]' : 'bg-[#2A8C82] text-white'}`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isTyping && <TypingIndicator />}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ex: Preciso instalar um chuveiro..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2A8C82]"
                        disabled={isTyping}
                    />
                    <button type="submit" disabled={isTyping} className="bg-[#2A8C82] text-white rounded-full p-2 hover:bg-opacity-90 transition-transform transform hover:scale-105 disabled:bg-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chatbot;
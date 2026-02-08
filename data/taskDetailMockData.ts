import { userProfile } from './clientMockData';
import { supabase } from '../supabaseClient';

export type TaskStatus = 'open' | 'evaluating' | 'scheduled' | 'in_progress' | 'completed' | 'Confirmado Pelo Cliente' | 'Avaliado' | 'disputed' | 'canceled';

export interface ChatMessage {
    senderId: string; // Now a UUID string, or '0' for system, '999' for support
    text: string;
    timestamp: string;
    attachmentUrl?: string;
}

export interface DetailedTask {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    clientId: string; // UUID
    professionalId: string; // UUID
    scheduledDateTime: string;
    category: string;
    address: string;
    financials: {
        serviceCost: number;
        materialsCost: number;
        total: number;
    };
    chatHistory: ChatMessage[];
}

export const supportUser = {
    id: '999',
    name: "Suporte Vale Conecta",
    photoUrl: "https://i.postimg.cc/J0YjP5v9/logo-vale-conecta-removebg-preview.png"
};

export const openDispute = async (taskId: number, reason: string, clientId: string): Promise<DetailedTask | undefined> => {
    const { error: taskUpdateError } = await supabase
        .from('tasks')
        .update({ status: 'disputed' })
        .eq('id', taskId);

    if (taskUpdateError) {
        console.error("Error opening dispute:", taskUpdateError);
        return;
    }

    const disputeMessages = [
        { task_id: taskId, sender_id: '0', message_text: `Uma disputa foi aberta pelo cliente. O pagamento está retido até a resolução.` },
        { task_id: taskId, sender_id: clientId, message_text: `Motivo da disputa: ${reason}` },
        { task_id: taskId, sender_id: supportUser.id, message_text: 'Olá! Sou do suporte da Vale Conecta e vou mediar esta conversa para chegarmos a uma solução.' }
    ];
    
    await supabase.from('chat_messages').insert(disputeMessages);

    return getTaskById(taskId);
};


export const getTaskById = async (id: number): Promise<DetailedTask | undefined> => {
    const { data: task, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();
    
    if (taskError || !task) {
        console.error('Error fetching task', taskError);
        return undefined;
    }

    const { data: chat, error: chatError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('task_id', id)
        .order('created_at');

    const chatHistory: ChatMessage[] = chat ? chat.map(c => ({
        senderId: c.sender_id,
        text: c.message_text,
        timestamp: new Date(c.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    })) : [];

    return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        clientId: task.client_id,
        professionalId: task.professional_id,
        scheduledDateTime: task.scheduled_date ? new Date(task.scheduled_date).toLocaleString('pt-BR') : 'A agendar',
        category: task.category,
        address: task.address,
        financials: {
            serviceCost: task.price || 0,
            materialsCost: 0,
            total: task.price || 0,
        },
        chatHistory: chatHistory
    };
};

export const getClientById = async (id: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', id)
        .single();
    
    if (error) {
        console.error("Error fetching client profile:", error);
        // Fallback to mock for testing
        return { id, name: userProfile.name, photoUrl: 'https://i.pravatar.cc/150?img=30' };
    }
    return { id: data.id, name: data.full_name, photoUrl: data.avatar_url || `https://i.pravatar.cc/150?u=${data.id}` };
};

export const getProfessionalById = async (id: string) => {
    if (!id) return undefined;
    // Fetches from profiles and joins with professionals for rich data
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, professional_details:professionals(rating)')
        .eq('id', id)
        .single();

    if (error) {
        console.error("Error fetching professional profile:", error);
        return undefined;
    }
    
    const rating = (data.professional_details as any)?.[0]?.rating || 4.5;

    return { 
        id: data.id, 
        name: data.full_name, 
        photoUrl: data.avatar_url || `https://i.pravatar.cc/150?u=${data.id}`,
        rating: rating,
    };
};
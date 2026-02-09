import { createClient } from '@supabase/supabase-js';

// Usando variáveis de ambiente para preparação para o deploy.
// Elas DEVEM ser configuradas no painel da Netlify.
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Adiciona um aviso no console se as variáveis de ambiente não estiverem configuradas.
if (supabaseUrl === 'https://your-supabase-url.supabase.co' || supabaseAnonKey === 'your-supabase-anon-key') {
    console.warn('Variáveis de ambiente do Supabase não configuradas. Usando valores placeholder. A aplicação pode não conseguir buscar dados.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

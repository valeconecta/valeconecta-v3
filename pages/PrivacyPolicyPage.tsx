
import React from 'react';

const LegalSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">{title}</h2>
        <div className="space-y-4 text-gray-600 leading-relaxed">
            {children}
        </div>
    </div>
);

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-4xl font-extrabold text-center text-[#2A8C82] mb-8">Política de Privacidade</h1>
                <p className="text-center text-gray-500 mb-12">Última atualização: 25 de Julho de 2024</p>
                
                <LegalSection title="1. Introdução">
                    <p>Bem-vindo à Vale Conecta. Sua privacidade é de extrema importância para nós. Esta Política de Privacidade explica como coletamos, usamos, compartilhamos e protegemos suas informações pessoais quando você utiliza nossa plataforma e serviços. Ao usar a Vale Conecta, você concorda com as práticas descritas nesta política.</p>
                </LegalSection>

                <LegalSection title="2. Informações que Coletamos">
                    <p>Coletamos diferentes tipos de informações para fornecer e melhorar nossos serviços:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>Informações de Cadastro:</strong> Nome, e-mail, senha, número de telefone e endereço, que você fornece ao criar uma conta.</li>
                        <li><strong>Informações de Perfil (Profissionais):</strong> Biografia, foto, especialidades, qualificações, documentos de identidade e comprovante de residência para verificação.</li>
                        <li><strong>Informações da Tarefa:</strong> Descrições, fotos, localização e detalhes dos serviços que você publica ou para os quais envia propostas.</li>
                        <li><strong>Informações de Pagamento:</strong> Dados de cartão de crédito/débito, informações de contas bancárias (para repasses a profissionais) e histórico de transações. Estes dados são processados de forma segura por nossos parceiros de pagamento.</li>
                        <li><strong>Comunicações:</strong> Conteúdo das mensagens trocadas através do nosso chat interno, incluindo comunicações com outros usuários e com nossa equipe de suporte.</li>
                        <li><strong>Informações de Uso:</strong> Como você interage com a plataforma, quais páginas visita, quais buscas realiza, e outras informações de navegação coletadas através de cookies e tecnologias similares.</li>
                    </ul>
                </LegalSection>

                <LegalSection title="3. Como Usamos Suas Informações">
                    <p>Utilizamos suas informações para os seguintes propósitos:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>Operar a Plataforma:</strong> Para conectar Clientes e Profissionais, facilitar a contratação de serviços, processar pagamentos e gerenciar contas.</li>
                        <li><strong>Segurança e Verificação:</strong> Para verificar a identidade dos Profissionais, prevenir fraudes e garantir um ambiente seguro para todos.</li>
                        <li><strong>Comunicação:</strong> Para enviar notificações sobre suas tarefas, propostas, mensagens e atualizações importantes da plataforma.</li>
                        <li><strong>Suporte ao Cliente:</strong> Para resolver problemas, responder a perguntas e mediar disputas.</li>
                        <li><strong>Melhoria de Serviços:</strong> Para analisar como nossos serviços são utilizados, identificar tendências e desenvolver novas funcionalidades.</li>
                        <li><strong>Marketing:</strong> Para enviar informações sobre promoções ou novos serviços que possam ser do seu interesse, sempre com a opção de cancelar o recebimento.</li>
                    </ul>
                </LegalSection>
                
                <LegalSection title="4. Compartilhamento de Informações">
                    <p>Não vendemos suas informações pessoais. Compartilhamos suas informações apenas nas seguintes circunstâncias:</p>
                     <ul className="list-disc list-inside space-y-2">
                        <li><strong>Entre Usuários:</strong> Compartilhamos informações necessárias para a realização do serviço (ex: o endereço do Cliente com o Profissional contratado) após a confirmação do pagamento.</li>
                        <li><strong>Com Provedores de Serviço:</strong> Trabalhamos com terceiros para processamento de pagamentos, verificação de documentos e análise de dados. Eles têm acesso limitado às suas informações apenas para realizar essas tarefas em nosso nome.</li>
                        <li><strong>Por Motivos Legais:</strong> Podemos divulgar suas informações se exigido por lei ou em resposta a solicitações legais válidas.</li>
                    </ul>
                </LegalSection>

                <LegalSection title="5. Segurança de Dados">
                    <p>Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum sistema é 100% seguro, e não podemos garantir segurança absoluta.</p>
                </LegalSection>
                
                <LegalSection title="6. Seus Direitos">
                    <p>Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Você pode gerenciar a maioria das suas informações diretamente em seu perfil ou entrando em contato com nossa equipe de suporte.</p>
                </LegalSection>

                <LegalSection title="7. Alterações a esta Política">
                    <p>Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações publicando a nova política na plataforma. Recomendamos que você revise esta página regularmente.</p>
                </LegalSection>
                
                <LegalSection title="8. Contato">
                    <p>Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco através da nossa Central de Ajuda ou pelo e-mail: <a href="mailto:privacidade@valeconecta.com" className="text-blue-600 hover:underline">privacidade@valeconecta.com</a>.</p>
                </LegalSection>

            </div>
        </div>
    );
};

export default PrivacyPolicyPage;

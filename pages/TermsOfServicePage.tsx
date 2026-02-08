
import React from 'react';

const LegalSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">{title}</h2>
        <div className="space-y-4 text-gray-600 leading-relaxed">
            {children}
        </div>
    </div>
);

const TermsOfServicePage: React.FC = () => {
    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-4xl font-extrabold text-center text-[#2A8C82] mb-8">Termos de Serviço</h1>
                <p className="text-center text-gray-500 mb-12">Última atualização: 25 de Julho de 2024</p>
                
                <LegalSection title="1. Aceitação dos Termos">
                    <p>Ao se cadastrar e utilizar a plataforma Vale Conecta ("Plataforma"), você ("Usuário") concorda em cumprir e estar vinculado a estes Termos de Serviço ("Termos"). Se você não concorda com estes Termos, não deve acessar ou usar a Plataforma.</p>
                </LegalSection>

                <LegalSection title="2. Descrição dos Serviços">
                    <p>A Vale Conecta é uma plataforma de tecnologia que conecta usuários que buscam serviços domésticos ("Clientes") a profissionais qualificados que oferecem tais serviços ("Profissionais"). A Vale Conecta atua como intermediária, facilitando a comunicação, o agendamento e o pagamento dos serviços.</p>
                    <p><strong>Importante:</strong> A Vale Conecta não emprega os Profissionais e não é responsável pela execução ou qualidade dos serviços prestados. O contrato de serviço é estabelecido diretamente entre o Cliente e o Profissional.</p>
                </LegalSection>

                <LegalSection title="3. Contas de Usuário">
                    <p>Para usar a Plataforma, você deve criar uma conta, fornecendo informações precisas e completas. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta.</p>
                </LegalSection>
                
                <LegalSection title="4. Obrigações dos Usuários">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">4.1 Clientes</h3>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Fornecer descrições claras e precisas das tarefas.</li>
                        <li>Tratar os Profissionais com respeito e profissionalismo.</li>
                        <li>Realizar o pagamento do valor acordado através da Plataforma antes do início do serviço.</li>
                        <li>Confirmar a conclusão do serviço de forma honesta para que o pagamento seja liberado ao Profissional.</li>
                    </ul>

                     <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">4.2 Profissionais</h3>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Fornecer informações verdadeiras e precisas em seu perfil, incluindo qualificações e experiência.</li>
                        <li>Passar pelo processo de verificação de identidade da Plataforma.</li>
                        <li>Executar os serviços com diligência, qualidade e profissionalismo.</li>
                        <li>Respeitar o local de serviço e a privacidade do Cliente.</li>
                        <li>Utilizar o sistema de créditos para enviar propostas, conforme as regras da Plataforma.</li>
                    </ul>
                </LegalSection>

                 <LegalSection title="5. Pagamentos, Taxas e Repasses">
                    <p><strong>Pagamento Seguro (Escrow):</strong> O Cliente paga o valor total do serviço à Vale Conecta no momento da contratação. Este valor fica retido e só é liberado para o Profissional após a confirmação de conclusão do serviço pelo Cliente, ou após a resolução de uma disputa.</p>
                    <p><strong>Taxa de Serviço:</strong> A Vale Conecta cobra uma taxa de comissão sobre o valor de cada serviço, que é deduzida do repasse ao Profissional. A taxa vigente é informada na Plataforma.</p>
                    <p><strong>Créditos:</strong> Profissionais devem adquirir pacotes de "créditos" para enviar propostas a Clientes. O custo em créditos de cada oportunidade pode variar.</p>
                </LegalSection>

                <LegalSection title="6. Disputas">
                    <p>Caso haja um desacordo entre Cliente e Profissional sobre a execução de um serviço, qualquer uma das partes pode iniciar uma disputa através da Plataforma. A equipe de suporte da Vale Conecta atuará como mediadora para ajudar a encontrar uma solução justa. A Vale Conecta reserva-se o direito de tomar a decisão final sobre a liberação do pagamento retido.</p>
                </LegalSection>

                <LegalSection title="7. Limitação de Responsabilidade">
                    <p>A Vale Conecta não é responsável por danos diretos, indiretos, incidentais ou consequenciais resultantes da utilização da Plataforma ou dos serviços prestados pelos Profissionais. Nossa responsabilidade total em qualquer circunstância está limitada ao valor da taxa de serviço paga por você para o serviço em questão.</p>
                </LegalSection>
                
                <LegalSection title="8. Encerramento de Conta">
                    <p>A Vale Conecta pode suspender ou encerrar sua conta a qualquer momento se você violar estes Termos. Você também pode encerrar sua conta a qualquer momento, desde que não haja tarefas ativas ou pagamentos pendentes.</p>
                </LegalSection>

                <LegalSection title="9. Alterações aos Termos">
                    <p>Podemos modificar estes Termos a qualquer momento. Notificaremos sobre as alterações e, ao continuar usando a Plataforma, você estará concordando com os Termos revisados.</p>
                </LegalSection>
                 
                <LegalSection title="10. Contato">
                    <p>Para dúvidas sobre estes Termos de Serviço, entre em contato através da nossa Central de Ajuda ou pelo e-mail: <a href="mailto:termos@valeconecta.com" className="text-blue-600 hover:underline">termos@valeconecta.com</a>.</p>
                </LegalSection>
            </div>
        </div>
    );
};

export default TermsOfServicePage;

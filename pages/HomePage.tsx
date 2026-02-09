
import React, { useEffect, useState } from 'react';
import { BroomIcon, LeafIcon, PaintBrushIcon, ShieldCheckIcon, StarIcon, WrenchIcon, CheckCircleIcon } from '../components/Icons';
import { Page } from '../types';
import { Professional } from '../data/professionals';
import { supabase } from '../supabaseClient';

interface HomePageProps {
  setCurrentPage: (page: Page, id?: number) => void;
  startSearch: (params: { query?: string; category?: string }) => void;
}

const CategoryCard: React.FC<{ icon: React.ReactNode; title: string; onClick: () => void; }> = ({ icon, title, onClick }) => (
  <div onClick={onClick} className="group text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
    <div className="inline-block p-4 bg-[#E8F3F1] rounded-full group-hover:bg-[#2A8C82] transition-colors duration-300">
      {React.cloneElement(icon as React.ReactElement, { className: "h-8 w-8 text-[#2A8C82] group-hover:text-white transition-colors duration-300" })}
    </div>
    <h3 className="mt-4 font-semibold text-[#333333]">{title}</h3>
  </div>
);

const TestimonialCard: React.FC<{ quote: string; name: string; service: string }> = ({ quote, name, service }) => (
  <div className="bg-white p-8 rounded-lg shadow-md">
    <div className="flex text-[#FFD700]">
      {[...Array(5)].map((_, i) => <StarIcon key={i} className="h-5 w-5" />)}
    </div>
    <blockquote className="mt-4 text-[#666666] italic">"{quote}"</blockquote>
    <div className="mt-4">
      <p className="font-bold text-[#333333]">{name}</p>
      <p className="text-sm text-[#666666]">{service}</p>
    </div>
  </div>
);

const FeaturedProfessionalCard: React.FC<{ professional: Professional; setCurrentPage: (page: Page, id?: number) => void; }> = ({ professional, setCurrentPage }) => (
  <div className="bg-white rounded-xl shadow-md text-center overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
    <div className="relative h-40">
        <img src={professional.photoUrl} alt={professional.name} className="w-full h-full object-cover" />
    </div>
    <div className="p-5">
        <h3 className="font-bold text-lg text-gray-800 truncate">{professional.name}</h3>
        <p className="font-semibold text-sm text-[#2A8C82] mt-1">{professional.category}</p>
        <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
            <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="font-bold text-gray-700">{professional.rating.toFixed(1)}</span>
            <span className="ml-1">({professional.reviewCount})</span>
        </div>
        <button 
            onClick={() => setCurrentPage('professional-profile', professional.id)}
            className="mt-4 w-full bg-white border-2 border-[#2A8C82] text-[#2A8C82] px-4 py-2 rounded-lg font-semibold hover:bg-[#2A8C82] hover:text-white transition-colors"
        >
            Ver Perfil
        </button>
    </div>
  </div>
);

const HomePage: React.FC<HomePageProps> = ({setCurrentPage, startSearch}) => {
  const [featuredProfessionals, setFeaturedProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        startSearch({ query: searchQuery });
    }
  };

  const handleCategoryClick = (category: string) => {
    startSearch({ category });
  };

  useEffect(() => {
    const anchor = sessionStorage.getItem('scrollToAnchor');
    if (anchor) {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      sessionStorage.removeItem('scrollToAnchor');
    }

    const fetchFeaturedProfessionals = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('professionals')
            .select('*')
            .order('rating', { ascending: false })
            .order('reviewCount', { ascending: false })
            .limit(8);

        if (error) {
            console.error("Error fetching featured professionals:", error);
        } else {
            setFeaturedProfessionals(data as Professional[]);
        }
        setIsLoading(false);
    };

    fetchFeaturedProfessionals();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="custom-gradient pt-20 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#333333] tracking-tight leading-tight">
              A solução completa para sua casa, <span className="text-[#2A8C82]">conectada a você.</span>
            </h1>
            <p className="mt-6 text-lg text-[#666666]">
              Encontre profissionais qualificados para qualquer serviço. Simples, rápido e seguro.
            </p>
            <div className="mt-10 max-w-xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Qual serviço você precisa? Ex: Pintor"
                      className="flex-grow px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A8C82] shadow-sm text-lg"
                  />
                  <button
                      type="submit"
                      className="bg-[#2A8C82] text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
                  >
                      Buscar
                  </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-20 bg-gray-50/70">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#333333]">Serviços mais procurados</h2>
          <p className="mt-4 text-lg text-[#666666] max-w-2xl mx-auto">Encontre ajuda para qualquer tarefa, grande ou pequena.</p>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
            <CategoryCard icon={<WrenchIcon />} title="Reparos Gerais" onClick={() => handleCategoryClick('Reparos Gerais')} />
            <CategoryCard icon={<PaintBrushIcon />} title="Pintura" onClick={() => handleCategoryClick('Pintura')} />
            <CategoryCard icon={<BroomIcon />} title="Faxina e Limpeza" onClick={() => handleCategoryClick('Faxina e limpeza doméstica')} />
            <CategoryCard icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 12H3"/><path d="M16 12h-2"/><path d="M6 12v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2"/><path d="M18 12v2a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4v-2"/></svg>} title="Encanamento" onClick={() => handleCategoryClick('Encanamento')} />
            <CategoryCard icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22v-5l5-5 5 5-5 5z"/><path d="M9.5 14.5 16 8l3 3-6.5 6.5z"/><path d="m17 11 4.5-4.5"/></svg>} title="Jardinagem" onClick={() => handleCategoryClick('Jardinagem')} />
            <CategoryCard icon={<LeafIcon />} title="Serviços Ecológicos" onClick={() => handleCategoryClick('Serviços Ecológicos')} />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#333333]">Simples, Rápido e Seguro</h2>
            <p className="mt-4 text-lg text-[#666666] max-w-2xl mx-auto">Encontrar o profissional certo nunca foi tão fácil. Siga os 3 passos:</p>
          </div>

          <div className="mt-16 space-y-24">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img src="https://i.postimg.cc/vB4bRnzF/image1.png" alt="Mulher descrevendo serviço no celular" className="rounded-lg shadow-xl" />
              </div>
              <div>
                <span className="text-6xl font-black text-[#E8F3F1]">01</span>
                <h3 className="text-3xl font-bold text-[#333333] mt-2">Descreva sua necessidade</h3>
                <p className="mt-4 text-lg text-[#666666]">
                  Use nosso Agendamento Inteligente para publicar uma tarefa detalhando o que você precisa. Quanto mais informações você der, melhores serão as propostas.
                </p>
                <ul className="mt-4 space-y-2 text-[#666666]">
                  <li className="flex items-start"><CheckCircleIcon className="h-5 w-5 text-[#2A8C82] mr-2 mt-1 flex-shrink-0"/> Seja específico sobre o serviço.</li>
                  <li className="flex items-start"><CheckCircleIcon className="h-5 w-5 text-[#2A8C82] mr-2 mt-1 flex-shrink-0"/> Adicione fotos para ilustrar.</li>
                  <li className="flex items-start"><CheckCircleIcon className="h-5 w-5 text-[#2A8C82] mr-2 mt-1 flex-shrink-0"/> Informe seu prazo e endereço.</li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-last">
                <img src="https://i.postimg.cc/bNsb6VbL/image2.png" alt="Recebendo propostas de profissionais" className="rounded-lg shadow-xl" />
              </div>
              <div>
                <span className="text-6xl font-black text-[#E8F3F1]">02</span>
                <h3 className="text-3xl font-bold text-[#333333] mt-2">Receba e Compare Propostas</h3>
                <p className="mt-4 text-lg text-[#666666]">
                  Profissionais qualificados e verificados enviarão propostas com valores e mensagens. Analise perfis, avaliações e converse pelo chat para tirar dúvidas.
                </p>
                 <ul className="mt-4 space-y-2 text-[#666666]">
                  <li className="flex items-start"><CheckCircleIcon className="h-5 w-5 text-[#2A8C82] mr-2 mt-1 flex-shrink-0"/> Perfis completos com histórico.</li>
                  <li className="flex items-start"><CheckCircleIcon className="h-5 w-5 text-[#2A8C82] mr-2 mt-1 flex-shrink-0"/> Avaliações de clientes reais.</li>
                  <li className="flex items-start"><CheckCircleIcon className="h-5 w-5 text-[#2A8C82] mr-2 mt-1 flex-shrink-0"/> Comunicação segura via chat.</li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img src="https://i.postimg.cc/HLpP7C8d/image3.png" alt="Pagamento seguro e serviço concluído" className="rounded-lg shadow-xl" />
              </div>
              <div>
                <span className="text-6xl font-black text-[#E8F3F1]">03</span>
                <h3 className="text-3xl font-bold text-[#333333] mt-2">Contrate com Segurança</h3>
                <p className="mt-4 text-lg text-[#666666]">
                  Escolha a melhor proposta e faça o pagamento seguro pela plataforma. O valor só é liberado para o profissional após você confirmar que o serviço foi concluído com sucesso.
                </p>
                 <ul className="mt-4 space-y-2 text-[#666666]">
                  <li className="flex items-start"><CheckCircleIcon className="h-5 w-5 text-[#2A8C82] mr-2 mt-1 flex-shrink-0"/> Pagamento retido até sua aprovação.</li>
                  <li className="flex items-start"><CheckCircleIcon className="h-5 w-5 text-[#2A8C82] mr-2 mt-1 flex-shrink-0"/> Garantia de Confiança Vale Conecta.</li>
                  <li className="flex items-start"><CheckCircleIcon className="h-5 w-5 text-[#2A8C82] mr-2 mt-1 flex-shrink-0"/> Suporte dedicado em todas as etapas.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Professionals Section */}
      <section className="py-20 bg-gray-50/70">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#333333]">Profissionais em Destaque</h2>
          <p className="mt-4 text-lg text-[#666666] max-w-2xl mx-auto">Conheça alguns dos nossos melhores talentos, avaliados pela comunidade.</p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
                <p>Carregando profissionais...</p>
            ) : (
                featuredProfessionals.map(prof => (
                    <FeaturedProfessionalCard key={prof.id} professional={prof} setCurrentPage={setCurrentPage} />
                ))
            )}
          </div>
        </div>
      </section>
      
      {/* Trust Guarantee Section */}
      <section id="garantia-confianca" className="py-20 bg-[#E8F3F1]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
               <ShieldCheckIcon className="h-16 w-16 text-[#2A8C82] mx-auto md:mx-0" />
              <h2 className="text-3xl font-bold text-[#333333] mt-4">Nossa Garantia de Confiança</h2>
              <p className="mt-4 text-lg text-[#666666]">
                Sua tranquilidade é nossa prioridade. Com a Vale Conecta, você tem a segurança que merece.
              </p>
              <ul className="mt-6 space-y-4 text-left">
                <li className="flex items-start">
                  <ShieldCheckIcon className="h-6 w-6 text-[#2A8C82] mr-3 flex-shrink-0 mt-1" />
                  <span><strong>Pagamento Seguro (Escrow):</strong> Liberamos o pagamento ao profissional só depois que você confirma a conclusão do serviço.</span>
                </li>
                <li className="flex items-start">
                   <ShieldCheckIcon className="h-6 w-6 text-[#2A8C82] mr-3 flex-shrink-0 mt-1" />
                  <span><strong>Profissionais Verificados:</strong> Todos os "Conectados" passam por um processo de verificação de documentos e antecedentes.</span>
                </li>
                 <li className="flex items-start">
                   <ShieldCheckIcon className="h-6 w-6 text-[#2A8C82] mr-3 flex-shrink-0 mt-1" />
                  <span><strong>Suporte Dedicado:</strong> Nossa equipe está pronta para ajudar em qualquer etapa do processo.</span>
                </li>
              </ul>
            </div>
            <div>
              <img src="https://i.postimg.cc/QC4fnxmg/background-removed-image-ZXd-JP4VBRQKp-X2WSi-Ru-OA.png" alt="Cliente satisfeito com o serviço" className="rounded-lg shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#333333]">O que nossos clientes dizem</h2>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard name="Mariana S." service="Instalação de Prateleiras" quote="Plataforma incrível! Encontrei um profissional ótimo em menos de uma hora e o serviço foi impecável. O pagamento seguro me deu muita tranquilidade." />
            <TestimonialCard name="João Pedro" service="Pintura de Quarto" quote="O 'Conectado' foi super profissional e ainda me ajudou a escolher a tinta certa pelo marketplace integrado. Economizei tempo e dor de cabeça." />
            <TestimonialCard name="Cláudia R." service="Reparo Elétrico" quote="Tinha medo de contratar alguém online, mas a Vale Conecta superou minhas expectativas. Perfil completo, avaliações reais e tudo muito transparente." />
          </div>
        </div>
      </section>
      
       {/* Plus Banner Section */}
      <section className="bg-white pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#2A8C82] rounded-lg p-10 md:p-16 text-center text-white relative overflow-hidden">
             <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>
             <div className="absolute -bottom-16 -right-5 w-48 h-48 bg-white/10 rounded-full"></div>
            <h2 className="text-3xl md:text-4xl font-bold">Eleve sua experiência com o Vale Conecta Plus</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              Tenha acesso a benefícios exclusivos, taxas reduzidas e um gerente do lar para cuidar de tudo por você.
            </p>
            <button onClick={() => setCurrentPage('plus')} className="mt-8 bg-[#FFD700] text-[#333333] font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Conheça o Plano Plus
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
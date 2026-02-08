
import React from 'react';
import { Page } from '../types';
import { Logo } from './Icons';

interface FooterProps {
  currentPage: Page;
  setCurrentPage: (page: Page, id?: number) => void;
}

const Footer: React.FC<FooterProps> = ({ currentPage, setCurrentPage }) => {
  const whatsappLink = `https://wa.me/5513991472036`;

  const handleScrollToGarantia = () => {
    if (currentPage === 'home') {
        document.getElementById('garantia-confianca')?.scrollIntoView({ behavior: 'smooth' });
    } else {
        sessionStorage.setItem('scrollToAnchor', 'garantia-confianca');
        setCurrentPage('home');
    }
  };

  return (
    <footer className="bg-[#E8F3F1] text-[#333333]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <button onClick={() => setCurrentPage('home')}>
              <Logo className="h-24 w-auto"/>
            </button>
            <p className="text-sm text-[#666666]">
              A solução completa para sua casa, conectada a você.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Plataforma</h3>
            <ul className="mt-4 space-y-2">
              <li><button onClick={() => setCurrentPage('home')} className="text-base text-[#666666] hover:text-[#2A8C82]">Como funciona</button></li>
              <li><button onClick={() => setCurrentPage('plus')} className="text-base text-[#666666] hover:text-[#2A8C82]">Vale Conecta Plus</button></li>
              <li><button onClick={() => setCurrentPage('professional')} className="text-base text-[#666666] hover:text-[#2A8C82]">Seja um Conectado</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Suporte</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-base text-[#666666] hover:text-[#2A8C82]">Central de Ajuda</a></li>
              <li><a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-base text-[#666666] hover:text-[#2A8C82]">Fale Conosco</a></li>
              <li><button onClick={handleScrollToGarantia} className="text-base text-left text-[#666666] hover:text-[#2A8C82]">Garantia de Confiança</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><button onClick={() => setCurrentPage('terms-of-service')} className="text-base text-[#666666] hover:text-[#2A8C82]">Termos de Serviço</button></li>
              <li><button onClick={() => setCurrentPage('privacy-policy')} className="text-base text-[#666666] hover:text-[#2A8C82]">Política de Privacidade</button></li>
               <li><button onClick={() => setCurrentPage('admin')} className="text-base text-[#666666] hover:text-[#2A8C82]">Painel do Administrador</button></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-[#2A8C82]/20 pt-8 text-center text-sm text-[#666666]">
          <p>&copy; {new Date().getFullYear()} Vale Conecta. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { WhatsAppIcon } from './Icons';

const WhatsAppButton: React.FC = () => {
  const phoneNumber = '5513991472036';
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      className="fixed bottom-6 right-6 bg-[#25D366] text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform duration-300 z-50 flex items-center justify-center"
    >
      <WhatsAppIcon className="h-8 w-8" />
    </a>
  );
};

export default WhatsAppButton;

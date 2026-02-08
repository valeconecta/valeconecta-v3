
export type MedalhaType = 'Mestre da Montagem' | 'Super Pontual' | 'Excelência em Avaliações' | 'Top Pro';

export interface Professional {
  id: number;
  name: string;
  photoUrl: string;
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  category: string;
  city: string;
  medalhas: MedalhaType[];
}

export const categories = [
    'Montagem de Móveis',
    'Instalação',
    'Pintura',
    'Reparos Gerais',
    'Encanamento',
    'Faxina e limpeza doméstica',
    'Jardinagem',
    'Serviços Ecológicos',
];

export const medalhas: MedalhaType[] = [
    'Mestre da Montagem',
    'Super Pontual',
    'Excelência em Avaliações',
];

import { DetailedProfessional } from './professionalProfileMockData';
import { MedalhaType } from './professionals';

export const dashboardData = {
    alerts: [
        { id: 1, text: '3 novas propostas para avaliar', link: 'tasks' },
        { id: 2, text: '2 serviços agendados para esta semana', link: 'tasks' },
        { id: 3, text: '1 mensagem não lida de profissionais', link: 'tasks' },
    ],
    activeTasks: [
        { id: 1, title: 'Instalação de chuveiro elétrico', status: 'Avaliando Propostas' },
        { id: 2, title: 'Pintura completa de apartamento', status: 'Agendado' },
        { id: 3, title: 'Montagem de guarda-roupas', status: 'Agendado' },
    ]
};

export const mockProfessionals: DetailedProfessional[] = [
    {
        id: 3,
        name: 'Ricardo Souza',
        photoUrl: 'https://i.pravatar.cc/150?img=3',
        rating: 4.9,
        reviewCount: 98,
        pricePerHour: 110,
        category: 'Encanamento',
        city: 'São Paulo',
        medalhas: ['Top Pro', 'Excelência em Avaliações'],
        memberSince: 2022,
        responseRate: 99,
        bio: 'Encanador experiente com foco em resolver vazamentos e realizar instalações complexas. Qualidade e limpeza garantidas.',
        services: ['Encanamento', 'Reparos Gerais'],
        reviews: [],
        gallery: []
    },
    {
        id: 4,
        name: 'Jorge Almeida',
        photoUrl: 'https://i.pravatar.cc/150?img=4',
        rating: 4.8,
        reviewCount: 75,
        pricePerHour: 95,
        category: 'Reparos Gerais',
        city: 'São Paulo',
        medalhas: ['Super Pontual'],
        memberSince: 2023,
        responseRate: 95,
        bio: 'Faz-tudo confiável para todos os tipos de reparos em sua casa. De elétrica a pequenos consertos, pode contar comigo.',
        services: ['Reparos Gerais', 'Instalação'],
        reviews: [],
        gallery: []
    },
    {
        id: 5,
        name: 'Ana Pereira',
        photoUrl: 'https://i.pravatar.cc/150?img=5',
        rating: 5.0,
        reviewCount: 150,
        pricePerHour: 100,
        category: 'Faxina e limpeza doméstica',
        city: 'São Paulo',
        medalhas: ['Excelência em Avaliações', 'Top Pro'],
        memberSince: 2021,
        responseRate: 100,
        bio: 'Ofereço um serviço de limpeza detalhado e de alta qualidade. Deixo sua casa brilhando e organizada. Tenho ótimas referências.',
        services: ['Faxina e limpeza doméstica', 'Serviços Ecológicos'],
        reviews: [],
        gallery: []
    }
];

export const payments = {
    history: [
        { id: 'pay_1', date: '2023-11-10', service: 'Pintura completa...', professional: 'Mariana Costa', amount: 1500.00, status: 'Pago' },
        { id: 'pay_2', date: '2023-10-28', service: 'Limpeza pós-obra', professional: 'Ana Pereira', amount: 450.00, status: 'Pago' },
        { id: 'pay_3', date: '2023-10-15', service: 'Instalação de prateleiras', professional: 'Carlos Silva', amount: 90.00, status: 'Pago' },
    ],
    methods: [
        { id: 1, type: 'credit-card', details: '**** **** **** 4242', brand: 'visa', isDefault: true },
        { id: 2, type: 'credit-card', details: '**** **** **** 5151', brand: 'mastercard', isDefault: false },
        { id: 3, type: 'pix', details: 'mariana@email.com', brand: 'pix', isDefault: false },
    ]
};

export const userProfile = {
    name: 'Mariana S.',
    email: 'mariana@email.com',
    addresses: [
        { id: 1, name: 'Casa', fullAddress: 'Rua das Flores, 123, São Paulo, SP' },
        { id: 2, name: 'Escritório', fullAddress: 'Av. Principal, 456, São Paulo, SP' },
    ]
};
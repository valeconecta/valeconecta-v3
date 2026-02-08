import { Professional, MedalhaType } from './professionals';
import { supabase } from '../supabaseClient';

export interface Review {
  id: number;
  clientName: string;
  date: string;
  rating: number;
  comment: string;
  service: string;
  professionalReply?: string;
}

export interface DetailedProfessional extends Professional {
  memberSince: number;
  responseRate: number;
  bio: string;
  services: string[];
  reviews: Review[];
  gallery: string[];
}

// Function to get a detailed profile by ID from Supabase
export const getProfessionalById = async (id: number): Promise<DetailedProfessional | undefined> => {
  const { data: professionalData, error: professionalError } = await supabase
    .from('professionals')
    .select('*')
    .eq('id', id)
    .single();

  if (professionalError || !professionalData) {
    console.error(`Error fetching professional with id ${id}:`, professionalError);
    return undefined;
  }

  const { data: reviewsData, error: reviewsError } = await supabase
    .from('reviews')
    .select('*')
    .eq('professional_id', id)
    .order('date', { ascending: false });
  
  if (reviewsError) {
    console.error(`Error fetching reviews for professional id ${id}:`, reviewsError);
    // Non-fatal error, continue with empty reviews
  }

  // Combine data and add mock values for fields not in 'professionals' table
  // This prevents the profile page from crashing on render due to missing properties.
  const detailedProfessional: DetailedProfessional = {
    ...(professionalData as Professional),
    memberSince: 2023,
    responseRate: 98,
    bio: `Profissional dedicado com vasta experiência em ${professionalData.category}. Comprometido em oferecer um serviço de alta qualidade, com foco na satisfação total do cliente.`,
    services: [professionalData.category, "Reparos Gerais", "Instalação"],
    reviews: (reviewsData as Review[]) || [],
    gallery: [
      "https://i.postimg.cc/W4Kx6D9z/gallery1.jpg",
      "https://i.postimg.cc/k4z14W1M/gallery2.jpg",
      "https://i.postimg.cc/rpM4pSjV/gallery3.jpg",
      "https://i.postimg.cc/Y0CrKJ8C/gallery4.jpg",
    ],
  };

  return detailedProfessional;
};
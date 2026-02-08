
import React, { useState, useEffect } from 'react';
import FiltersPanel from '../components/search/FiltersPanel';
import ProfessionalCard from '../components/search/ProfessionalCard';
import { Professional } from '../data/professionals';
import { MenuIcon, SpinnerIcon } from '../components/Icons';
import { Page } from '../types';
import { supabase } from '../supabaseClient';

interface SearchPageProps {
    setCurrentPage: (page: Page, id?: number) => void;
    initialQuery?: string;
    initialCategory?: string;
}

const SearchPage: React.FC<SearchPageProps> = ({ setCurrentPage, initialQuery, initialCategory }) => {
    const [searchText, setSearchText] = useState(initialQuery || '');
    const [filters, setFilters] = useState({
        categories: initialCategory ? [initialCategory] : [],
        priceRange: { min: 20, max: 200 },
        radius: 50,
        rating: null as number | null,
        selectedMedalhas: [] as string[],
    });
    const [sortBy, setSortBy] = useState('relevance');
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfessionals = async () => {
            setIsLoading(true);
            let query = supabase.from('professionals').select('*');

            if (searchText) {
                query = query.or(`name.ilike.%${searchText}%,category.ilike.%${searchText}%,city.ilike.%${searchText}%`);
            }
            if (filters.categories.length > 0) {
                query = query.in('category', filters.categories);
            }
            query = query.gte('pricePerHour', filters.priceRange.min);
            query = query.lte('pricePerHour', filters.priceRange.max);

            if (filters.rating) {
                query = query.gte('rating', filters.rating);
            }
            if (filters.selectedMedalhas.length > 0) {
                query = query.contains('medalhas', filters.selectedMedalhas);
            }

            let orderOptions: { column: string, options?: { ascending: boolean } } = { column: 'rating', options: { ascending: false } };
            switch (sortBy) {
                case 'price_asc':
                    orderOptions = { column: 'pricePerHour', options: { ascending: true } };
                    break;
                case 'price_desc':
                    orderOptions = { column: 'pricePerHour', options: { ascending: false } };
                    break;
                case 'rating':
                    orderOptions = { column: 'rating', options: { ascending: false } };
                    break;
                case 'relevance':
                default:
                    query = query.order('rating', { ascending: false });
                    orderOptions = { column: 'reviewCount', options: { ascending: false } };
                    break;
            }
            query = query.order(orderOptions.column, orderOptions.options);

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching professionals:", error);
                setProfessionals([]);
            } else {
                setProfessionals(data as Professional[]);
            }
            setIsLoading(false);
        };

        const debounceTimer = setTimeout(() => {
            fetchProfessionals();
        }, 500); // Add a debounce to avoid too many requests while typing

        return () => clearTimeout(debounceTimer);

    }, [searchText, filters, sortBy]);

    return (
        <div className="bg-[#E8F3F1]/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="lg:flex lg:space-x-8">
                    <div className="lg:hidden mb-4">
                        <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <MenuIcon className="h-5 w-5 mr-2" />
                            Filtrar
                        </button>
                    </div>
                    <div className="hidden lg:block">
                        <FiltersPanel filters={filters} setFilters={setFilters} />
                    </div>
                    <main className="flex-1">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Busque por serviço, profissional ou cidade..."
                                className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A8C82]"
                            />
                            <div className="w-full sm:w-auto flex items-center justify-between gap-4">
                                <p className="text-sm text-[#666666] flex-shrink-0">
                                    <span className="font-bold text-[#333333]">{professionals.length}</span> encontrados
                                </p>
                                <select id="sort" value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-sm border-gray-300 rounded-md focus:ring-[#2A8C82] focus:border-[#2A8C82]">
                                    <option value="relevance">Relevância</option>
                                    <option value="price_asc">Preço (Menor ao Maior)</option>
                                    <option value="price_desc">Preço (Maior ao Menor)</option>
                                    <option value="rating">Melhores Avaliações</option>
                                </select>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <SpinnerIcon className="h-10 w-10 text-[#2A8C82] animate-spin" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {professionals.length > 0 ? (
                                    professionals.map(prof => (
                                        <ProfessionalCard key={prof.id} professional={prof} setCurrentPage={setCurrentPage} />
                                    ))
                                ) : (
                                    <div className="md:col-span-2 xl:col-span-3 text-center py-10">
                                        <h3 className="text-xl font-semibold">Nenhum profissional encontrado</h3>
                                        <p className="text-gray-600 mt-2">Tente ajustar seus filtros ou termos de busca.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;

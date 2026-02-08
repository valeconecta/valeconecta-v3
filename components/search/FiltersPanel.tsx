
import React, { useState } from 'react';
import { categories, medalhas, MedalhaType } from '../../data/professionals';
import { AwardIcon, ClockIcon, StarIcon, ToolboxIcon } from '../Icons';

interface Filters {
    categories: string[];
    priceRange: { min: number; max: number };
    radius: number;
    rating: number | null;
    selectedMedalhas: MedalhaType[];
}

interface FiltersPanelProps {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const MedalhaIcon: React.FC<{ medalha: MedalhaType, className?: string }> = ({ medalha, className }) => {
  const medalhaMap: Record<MedalhaType, React.ReactNode> = {
    'Mestre da Montagem': <ToolboxIcon className={className} />,
    'Super Pontual': <ClockIcon className={className} />,
    'Excelência em Avaliações': <StarIcon className={className} fill="#FFD700" stroke="#FFD700" />,
    'Top Pro': <AwardIcon className={className} />,
  };
  return medalhaMap[medalha];
};

const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, setFilters }) => {

    const handleCategoryChange = (category: string) => {
        setFilters(prev => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category]
        }));
    };

    const handleMedalhaChange = (medalha: MedalhaType) => {
        setFilters(prev => ({
            ...prev,
            selectedMedalhas: prev.selectedMedalhas.includes(medalha)
                ? prev.selectedMedalhas.filter(m => m !== medalha)
                : [...prev.selectedMedalhas, medalha]
        }));
    }

    return (
        <aside className="w-full lg:w-80 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
                <div className="p-6 bg-white border border-gray-200 rounded-xl">
                    <h3 className="text-lg font-semibold text-[#333333]">Categorias</h3>
                    <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                        {categories.map(cat => (
                            <label key={cat} className="flex items-center space-x-2 text-[#666666]">
                                <input type="checkbox" checked={filters.categories.includes(cat)} onChange={() => handleCategoryChange(cat)} className="h-4 w-4 rounded border-gray-300 text-[#2A8C82] focus:ring-[#2A8C82]" />
                                <span>{cat}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-white border border-gray-200 rounded-xl">
                    <h3 className="text-lg font-semibold text-[#333333]">Localização</h3>
                    <input type="text" placeholder="Digite uma cidade" className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#2A8C82]"/>
                    <div className="mt-4">
                        <label className="text-sm font-medium text-[#666666]">Raio de busca: <span className="font-bold text-[#2A8C82]">{filters.radius} km</span></label>
                        <input type="range" min="5" max="50" value={filters.radius} onChange={e => setFilters(p => ({...p, radius: Number(e.target.value)}))} className="w-full h-2 mt-2 bg-[#E8F3F1] rounded-lg appearance-none cursor-pointer" style={{ accentColor: '#2A8C82' }}/>
                    </div>
                </div>

                <div className="p-6 bg-white border border-gray-200 rounded-xl">
                    <h3 className="text-lg font-semibold text-[#333333]">Faixa de Preço</h3>
                     <div className="mt-4 text-center text-[#666666]">
                        R$ {filters.priceRange.min}/h - R$ {filters.priceRange.max}/h
                    </div>
                    <div className="mt-2">
                        <label className="text-sm font-medium text-[#666666]">Preço Mínimo</label>
                         <input type="range" min="20" max="200" value={filters.priceRange.min} onChange={e => setFilters(prev => ({...prev, priceRange: {...prev.priceRange, min: Math.min(Number(e.target.value), prev.priceRange.max)}}))} className="w-full h-2 mt-1 bg-[#E8F3F1] rounded-lg appearance-none cursor-pointer" style={{ accentColor: '#2A8C82' }}/>
                    </div>
                     <div className="mt-2">
                         <label className="text-sm font-medium text-[#666666]">Preço Máximo</label>
                         <input type="range" min="20" max="200" value={filters.priceRange.max} onChange={e => setFilters(prev => ({...prev, priceRange: {...prev.priceRange, max: Math.max(Number(e.target.value), prev.priceRange.min)}}))} className="w-full h-2 mt-1 bg-[#E8F3F1] rounded-lg appearance-none cursor-pointer" style={{ accentColor: '#2A8C82' }}/>
                    </div>
                </div>

                <div className="p-6 bg-white border border-gray-200 rounded-xl">
                    <h3 className="text-lg font-semibold text-[#333333]">Reputação</h3>
                    <div className="mt-4 space-y-3">
                        <h4 className="text-sm font-medium text-[#666666]">Avaliação Média</h4>
                        <div className="flex space-x-2">
                             <button onClick={() => setFilters(p => ({...p, rating: 4.5}))} className={`flex-1 text-sm border rounded-md py-1 px-2 ${filters.rating === 4.5 ? 'bg-[#E8F3F1] border-[#2A8C82]' : 'border-gray-300 hover:bg-gray-100'}`}>4.5+ ⭐</button>
                             <button onClick={() => setFilters(p => ({...p, rating: 4.0}))} className={`flex-1 text-sm border rounded-md py-1 px-2 ${filters.rating === 4.0 ? 'bg-[#E8F3F1] border-[#2A8C82]' : 'border-gray-300 hover:bg-gray-100'}`}>4.0+ ⭐</button>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                         <h4 className="text-sm font-medium text-[#666666]">Medalhas de Reconhecimento</h4>
                        {medalhas.map(medalha => (
                            <label key={medalha} className="flex items-center space-x-2 text-[#666666]">
                                <input type="checkbox" checked={filters.selectedMedalhas.includes(medalha)} onChange={() => handleMedalhaChange(medalha)} className="h-4 w-4 rounded border-gray-300 text-[#2A8C82] focus:ring-[#2A8C82]" />
                                <MedalhaIcon medalha={medalha} className="w-5 h-5 text-[#2A8C82]" />
                                <span>{medalha}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default FiltersPanel;

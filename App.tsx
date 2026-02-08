
import React, { useState, useEffect } from 'react';
import { Page } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProfessionalPage from './pages/ProfessionalPage';
import PlusPage from './pages/PlusPage';
import SearchPage from './pages/SearchPage';
import AdminPage from './pages/AdminPage';
import ProfessionalDashboardPage from './pages/ProfessionalDashboardPage';
import ProfessionalProfilePage from './pages/ProfessionalProfilePage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import CompareProposalsPage from './pages/CompareProposalsPage';
import TaskDetailPage from './pages/TaskDetailPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import WhatsAppButton from './components/WhatsAppButton';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<number | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<'client' | 'professional'>('client');
  const [searchState, setSearchState] = useState<{ query?: string, category?: string }>({});

  useEffect(() => {
    if (currentPage !== 'search') {
      if (Object.keys(searchState).length > 0) {
        setSearchState({});
      }
    }
  }, [currentPage, searchState]);


  const handleSetPage = (page: Page, id?: number) => {
    setCurrentPage(page);
    if (page === 'professional-profile' && id !== undefined) {
      setSelectedProfessionalId(id);
    }
    if ((page === 'compare-proposals' || page === 'task-detail') && id !== undefined) {
      setSelectedTaskId(id);
    }
    if (page === 'client-dashboard') {
      setCurrentUserRole('client');
    }
    if (page === 'professional-dashboard') {
      setCurrentUserRole('professional');
    }
    window.scrollTo(0, 0);
  };
  
  const startSearch = (params: { query?: string, category?: string }) => {
    setSearchState(params);
    setCurrentPage('search');
    window.scrollTo(0, 0);
  };

  const showWhatsAppButton = !['admin', 'professional-dashboard', 'client-dashboard', 'task-detail'].includes(currentPage);

  // Render AdminPage with its own layout
  if (currentPage === 'admin') {
    return <AdminPage setCurrentPage={handleSetPage} />;
  }

  // Render ProfessionalDashboardPage with its own layout
  if (currentPage === 'professional-dashboard') {
    return <ProfessionalDashboardPage setCurrentPage={handleSetPage} />;
  }
  
  // Render ClientDashboardPage with its own layout
  if (currentPage === 'client-dashboard') {
      return <ClientDashboardPage setCurrentPage={handleSetPage} />;
  }

  // Render TaskDetailPage with its own layout
  if (currentPage === 'task-detail' && selectedTaskId) {
    return <TaskDetailPage taskId={selectedTaskId} currentUserRole={currentUserRole} setCurrentPage={handleSetPage} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={handleSetPage} startSearch={startSearch} />;
      case 'professional':
        return <ProfessionalPage setCurrentPage={handleSetPage} />;
      case 'plus':
        return <PlusPage />;
      case 'search':
        return <SearchPage setCurrentPage={handleSetPage} initialQuery={searchState.query} initialCategory={searchState.category} />;
      case 'opportunities':
        return <OpportunitiesPage setCurrentPage={handleSetPage} />;
      case 'privacy-policy':
        return <PrivacyPolicyPage />;
      case 'terms-of-service':
        return <TermsOfServicePage />;
      case 'professional-profile':
        if (selectedProfessionalId) {
          return <ProfessionalProfilePage professionalId={selectedProfessionalId} setCurrentPage={handleSetPage} />;
        }
        return <SearchPage setCurrentPage={handleSetPage} />;
      case 'compare-proposals':
        if(selectedTaskId) {
            return <CompareProposalsPage taskId={selectedTaskId} setCurrentPage={handleSetPage} />;
        }
        // Fallback if no task id is provided
        return <ClientDashboardPage setCurrentPage={handleSetPage} />;
      default:
        return <HomePage setCurrentPage={handleSetPage} startSearch={startSearch} />;
    }
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen flex flex-col">
      <Header currentPage={currentPage} setCurrentPage={handleSetPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer currentPage={currentPage} setCurrentPage={handleSetPage} />
      {showWhatsAppButton && <WhatsAppButton />}
    </div>
  );
};

export default App;
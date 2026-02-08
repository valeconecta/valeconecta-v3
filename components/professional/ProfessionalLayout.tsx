import React, { useState, useEffect } from 'react';
import { Page, MedalhaInfo, BadgeNotificationData, BadgeIconName } from '../../types';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { AwardIcon, StarIcon, CheckCircleIcon, ToolboxIcon, CalendarDaysIcon } from '../Icons';

import DashboardView from './views/DashboardView';
import OpportunitiesView from './views/OpportunitiesView';
import ServicesView from './views/ServicesView';
import FinancialsView from './views/FinancialsView';
import ProfileView from './views/ProfileView';
import AnalyticsView from './views/AnalyticsView';
import BadgeNotificationToast from './BadgeNotificationToast';

export type ProfessionalView = 'dashboard' | 'opportunities' | 'services' | 'financials' | 'profile' | 'analytics';

interface ProfessionalLayoutProps {
  setCurrentPage: (page: Page, id?: number) => void;
}

const ProfessionalLayout: React.FC<ProfessionalLayoutProps> = ({ setCurrentPage }) => {
  const [activeView, setActiveView] = useState<ProfessionalView>('dashboard');
  const [notification, setNotification] = useState<MedalhaInfo | null>(null);

  // Icon map to convert string names from sessionStorage into actual components
  const iconMap: Record<BadgeIconName, React.ReactNode> = {
    StarIcon: <StarIcon className="h-8 w-8 text-white" />,
    AwardIcon: <AwardIcon className="h-8 w-8 text-white" />,
    CheckCircleIcon: <CheckCircleIcon className="h-8 w-8 text-white" />,
    ToolboxIcon: <ToolboxIcon className="h-8 w-8 text-white" />,
    CalendarDaysIcon: <CalendarDaysIcon className="h-8 w-8 text-white" />,
  };

  useEffect(() => {
    // This effect checks for a badge notification when the dashboard loads.
    // In a real app, this would be handled by a WebSocket or push notification.
    const checkBadgeNotification = () => {
        const badgeInfoString = sessionStorage.getItem('newBadgeNotification');
        if (badgeInfoString) {
            try {
                const badgeData: BadgeNotificationData = JSON.parse(badgeInfoString);
                const notificationData: MedalhaInfo = {
                    nome: badgeData.nome,
                    descricao: badgeData.descricao,
                    icone: iconMap[badgeData.iconName] || iconMap['StarIcon'] // Fallback to StarIcon
                };
                setNotification(notificationData);
                sessionStorage.removeItem('newBadgeNotification');
            } catch (e) {
                console.error("Failed to parse badge notification from sessionStorage", e);
                sessionStorage.removeItem('newBadgeNotification');
            }
        }
    };
    
    // Check for notifications as soon as the professional panel is loaded.
    checkBadgeNotification();
  }, []);


  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView setActiveView={setActiveView} />;
      case 'opportunities':
        return <OpportunitiesView setCurrentPage={setCurrentPage} />;
      case 'services':
        return <ServicesView setCurrentPage={setCurrentPage} />;
      case 'financials':
        return <FinancialsView />;
      case 'profile':
        return <ProfileView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <DashboardView setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50/50 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 py-8">
            {renderView()}
          </div>
        </main>
      </div>
      <BottomNav activeView={activeView} setActiveView={setActiveView} />

      {notification && (
        <BadgeNotificationToast
          medalha={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default ProfessionalLayout;
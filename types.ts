// FIX: Import React to resolve namespace error for React.ReactNode.
import React from 'react';

export type Page = 'home' | 'professional' | 'plus' | 'search' | 'admin' | 'professional-dashboard' | 'professional-profile' | 'client-dashboard' | 'compare-proposals' | 'task-detail' | 'opportunities' | 'privacy-policy' | 'terms-of-service';

// Add new types for gamification notifications
export type BadgeIconName = 'StarIcon' | 'AwardIcon' | 'CheckCircleIcon' | 'ToolboxIcon' | 'CalendarDaysIcon';

export interface MedalhaInfo {
  nome: string;
  descricao: string;
  icone: React.ReactNode;
}

export interface BadgeNotificationData {
    nome: string;
    descricao: string;
    iconName: BadgeIconName;
}
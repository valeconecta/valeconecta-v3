import { supabase } from '../supabaseClient';
import { MedalhaType } from './professionals';
import { BadgeNotificationData, BadgeIconName } from '../types';

// Registry of all earnable badges and their notification data
const BADGE_DEFINITIONS: Record<string, { notification: BadgeNotificationData, criteria: (stats: any) => boolean }> = {
    'Excelência em Avaliações': {
        notification: {
            nome: 'Excelência em Avaliações',
            descricao: 'Você alcançou 50 avaliações com nota média 4.9+!',
            iconName: 'StarIcon' as BadgeIconName
        },
        criteria: (stats) => stats.reviewCount >= 50 && stats.rating >= 4.9
    },
    'Top Pro': {
        notification: {
            nome: 'Top Pro',
            descricao: 'Parabéns! Você completou 100 serviços com excelência.',
            iconName: 'AwardIcon' as BadgeIconName
        },
        criteria: (stats) => stats.totalServices >= 100 && stats.rating >= 4.8
    },
    'Mestre da Montagem': {
        notification: { nome: 'Mestre da Montagem', descricao: 'Você se tornou um mestre na montagem!', iconName: 'ToolboxIcon' as BadgeIconName },
        criteria: (stats) => false // Logic to be implemented
    },
    'Super Pontual': {
        notification: { nome: 'Super Pontual', descricao: 'Clientes te elogiam pela sua pontualidade!', iconName: 'CalendarDaysIcon' as BadgeIconName },
        criteria: (stats) => false // Logic to be implemented
    }
};


/**
 * Checks if a professional has earned any new badges based on their updated stats.
 * If a badge is earned, it updates the professional's profile in the database.
 * @param professionalId The ID of the professional to check.
 * @returns The notification data for the *first* newly earned badge, or null if no new badges were earned.
 */
export const checkAndAwardBadges = async (professionalId: number): Promise<BadgeNotificationData | null> => {
    // 1. Get the professional's current data
    const { data: professional, error: profError } = await supabase
        .from('professionals')
        .select('medalhas, reviewCount, rating, servicesCompleted') // servicesCompleted used for Top Pro
        .eq('id', professionalId)
        .single();

    if (profError || !professional) {
        console.error("Gamification Service: Could not fetch professional stats.", profError);
        return null;
    }
    
    // Create a stats object that matches criteria expectations
    const professionalStats = {
        ...professional,
        totalServices: professional.servicesCompleted || professional.reviewCount // Fallback for totalServices
    };

    const currentBadges: MedalhaType[] = professional.medalhas || [];
    let newlyAwardedBadge: BadgeNotificationData | null = null;
    let badgesToUpdate = [...currentBadges];

    // 2. Iterate through all defined badges and check criteria
    for (const badgeKey in BADGE_DEFINITIONS) {
        const badgeName = badgeKey as MedalhaType;
        if (Object.prototype.hasOwnProperty.call(BADGE_DEFINITIONS, badgeName)) {
            const badge = BADGE_DEFINITIONS[badgeName];

            // Check if the professional doesn't have this badge yet AND meets the criteria
            if (!currentBadges.includes(badgeName) && badge.criteria(professionalStats)) {
                badgesToUpdate.push(badgeName);
                
                // We only want to notify for the first new badge found in a single check
                if (!newlyAwardedBadge) {
                    newlyAwardedBadge = badge.notification;
                }
            }
        }
    }

    // 3. If any new badges were added, update the database
    if (badgesToUpdate.length > currentBadges.length) {
        const { error: updateError } = await supabase
            .from('professionals')
            .update({ medalhas: badgesToUpdate })
            .eq('id', professionalId);
        
        if (updateError) {
            console.error("Gamification Service: Failed to update professional's badges.", updateError);
            return null;
        }

        return newlyAwardedBadge;
    }

    // 4. No new badges earned
    return null;
};
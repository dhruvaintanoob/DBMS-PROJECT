// Utility functions for subscription plan management

export type SubscriptionPlan = 'Basic' | 'Standard' | 'Premium';

const planHierarchy: Record<SubscriptionPlan, number> = {
  'Basic': 1,
  'Standard': 2,
  'Premium': 3,
};

/**
 * Check if a user's subscription plan allows access to content
 * @param userPlan - The user's current subscription plan
 * @param requiredPlan - The minimum plan required for the content
 * @returns true if user has access, false otherwise
 */
export const canAccessContent = (
  userPlan: string | undefined,
  requiredPlan: string | undefined
): boolean => {
  // Default to Basic if not specified
  const userTier = planHierarchy[(userPlan as SubscriptionPlan) || 'Basic'] || 1;
  const requiredTier = planHierarchy[(requiredPlan as SubscriptionPlan) || 'Basic'] || 1;
  
  return userTier >= requiredTier;
};

/**
 * Get the plan name that user needs to upgrade to
 * @param requiredPlan - The minimum plan required for the content
 * @returns The plan name or null if already accessible
 */
export const getRequiredUpgrade = (
  userPlan: string | undefined,
  requiredPlan: string | undefined
): string | null => {
  if (canAccessContent(userPlan, requiredPlan)) {
    return null;
  }
  return requiredPlan || 'Basic';
};

/**
 * Get plan features description
 */
export const getPlanFeatures = (plan: string): string => {
  switch (plan) {
    case 'Basic':
      return 'Watch on 1 device • Standard Definition';
    case 'Standard':
      return 'Watch on 2 devices • High Definition';
    case 'Premium':
      return 'Watch on 4 devices • Ultra High Definition';
    default:
      return 'Watch on 1 device • Standard Definition';
  }
};

// Utility functions for subscription plan management

export type SubscriptionPlan = 'Basic' | 'Standard' | 'Premium';

const planHierarchy: Record<SubscriptionPlan, number> = {
  Basic: 1,
  Standard: 2,
  Premium: 3,
};

/**
 * Normalize any plan string coming from backend/DB/UI
 * into one of the canonical SubscriptionPlan values.
 */
const normalizePlan = (plan?: string): SubscriptionPlan => {
  if (!plan) return 'Basic';

  const normalized = plan.trim().toLowerCase();

  // Be very forgiving about how the plan is stored, e.g.
  // "Premium", "premium", "Premium Plan", "user_premium", etc.
  if (normalized.includes('premium')) return 'Premium';
  if (normalized.includes('standard')) return 'Standard';
  if (normalized.includes('basic')) return 'Basic';

  // Fallback to Basic for unknown values
  return 'Basic';
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
  const userTier = planHierarchy[normalizePlan(userPlan)];
  const requiredTier = planHierarchy[normalizePlan(requiredPlan)];

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

  return normalizePlan(requiredPlan);
};

/**
 * Get plan features description
 */
export const getPlanFeatures = (plan: string): string => {
  switch (normalizePlan(plan)) {
    case 'Basic':
      return 'Watch on 1 device • Standard Definition';
    case 'Standard':
      return 'Watch on 2 devices • High Definition';
    case 'Premium':
      return 'Watch on 4 devices • Ultra High Definition';
  }
};

import type { UserIdentity, FeatureFlagConfig } from './types.js';
import { getConfig } from './config.js';
import { Logger } from './environment.js';

/**
 * Checks if a feature flag is enabled for the given user
 */
export function isFeatureEnabled(featureName: string, user?: UserIdentity): boolean {
  try {
    const config = getConfig();
    const feature = config.features[featureName];

    if (!feature) {
      Logger.warn(`Feature "${featureName}" not found in configuration`);
      return false;
    }

    // If onlyForUserIds is specified and has values, check if user is in list
    if (feature.onlyForUserIds && feature.onlyForUserIds.length > 0) {
      if (!user?.userId) {
        return false;
      }
      return feature.onlyForUserIds.includes(user.userId);
    }

    // Otherwise check the enabled flag
    if ('enabled' in feature) {
      return feature.enabled === true;
    }

    return false;
  } catch (error) {
    Logger.error(
      `Error evaluating feature "${featureName}": ${(error as Error).message}`
    );
    return false;
  }
}

/**
 * Checks if any of the specified features are enabled
 */
export function isAnyFeatureEnabled(
  featureNames: string[],
  user?: UserIdentity
): boolean {
  return featureNames.some((name) => isFeatureEnabled(name, user));
}

/**
 * Checks if all of the specified features are enabled
 */
export function areAllFeaturesEnabled(
  featureNames: string[],
  user?: UserIdentity
): boolean {
  return featureNames.every((name) => isFeatureEnabled(name, user));
}

/**
 * Gets all enabled features for the given user
 */
export function getEnabledFeatures(user?: UserIdentity): string[] {
  try {
    const config = getConfig();
    return Object.keys(config.features).filter((name) => isFeatureEnabled(name, user));
  } catch (error) {
    Logger.error(`Error getting enabled features: ${(error as Error).message}`);
    return [];
  }
}

/**
 * Gets the configuration for a specific feature
 * Useful for debugging
 */
export function getFeatureConfig(featureName: string): FeatureFlagConfig | null {
  try {
    const config = getConfig();
    return config.features[featureName] || null;
  } catch (error) {
    Logger.error(
      `Error getting feature config for "${featureName}": ${(error as Error).message}`
    );
    return null;
  }
}

/**
 * Checks if a feature exists in the configuration
 */
export function featureExists(featureName: string): boolean {
  try {
    const config = getConfig();
    return featureName in config.features;
  } catch (error) {
    Logger.error(`Error checking feature existence: ${(error as Error).message}`);
    return false;
  }
}

/**
 * Gets all feature names from the configuration
 */
export function getAllFeatureNames(): string[] {
  try {
    const config = getConfig();
    return Object.keys(config.features);
  } catch (error) {
    Logger.error(`Error getting feature names: ${(error as Error).message}`);
    return [];
  }
}

/**
 * Gets multiple feature flags at once as an object
 */
export function getFeatureFlags(
  featureNames: string[],
  user?: UserIdentity
): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const name of featureNames) {
    result[name] = isFeatureEnabled(name, user);
  }
  return result;
}

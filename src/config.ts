import type { FeatureFlagsConfig } from './types.js';
import { Logger } from './environment.js';

let cachedConfig: FeatureFlagsConfig | null = null;

/**
 * Retrieves the feature flags configuration from environment variable
 * This works in both browser and Node.js environments
 */
export function getConfig(): FeatureFlagsConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    // Check for config in environment variable
    const configString =
      typeof process !== 'undefined' && process.env
        ? process.env.FEATURE_FLAGS_CONFIG || process.env.FFXL_CONFIG
        : undefined;

    if (!configString) {
      Logger.warn('No feature flags configuration found in environment');
      cachedConfig = { features: {} };
      return cachedConfig;
    }

    const parsed = JSON.parse(configString) as FeatureFlagsConfig;
    cachedConfig = parsed;

    Logger.info('Feature flags configuration loaded successfully');
    return cachedConfig;
  } catch (error) {
    Logger.error(`Failed to parse feature flags config: ${(error as Error).message}`);
    cachedConfig = { features: {} };
    return cachedConfig;
  }
}

/**
 * Clears the cached configuration
 * Useful for testing or hot-reloading scenarios
 */
export function clearCache(): void {
  cachedConfig = null;
}

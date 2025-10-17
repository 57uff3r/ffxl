// Types
export type {
  FeatureFlagConfig,
  FeatureFlagsConfig,
  UserIdentity,
  Environment,
} from './types.js';
export { FeatureFlagValidationError } from './types.js';

// Environment detection
export { detectEnvironment, isDevelopment, Logger } from './environment.js';

// Loader (Node.js only)
export { loadFeatureFlags, loadFeatureFlagsAsString } from './loader.js';

// Config management
export { getConfig, clearCache } from './config.js';

// Feature evaluation
export {
  isFeatureEnabled,
  isAnyFeatureEnabled,
  areAllFeaturesEnabled,
  getEnabledFeatures,
  getFeatureConfig,
  featureExists,
  getAllFeatureNames,
  getFeatureFlags,
} from './evaluator.js';

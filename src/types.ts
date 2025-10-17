/**
 * Configuration for a single feature flag
 */
export interface FeatureFlagConfig {
  /**
   * Whether the feature is enabled globally
   */
  enabled?: boolean;

  /**
   * List of user IDs for which this feature is enabled
   * If present and non-empty, only these users will have access
   */
  onlyForUserIds?: string[];

  /**
   * Optional comment describing the feature flag's purpose
   */
  comment?: string;
}

/**
 * Root configuration containing all feature flags
 */
export interface FeatureFlagsConfig {
  /**
   * Map of feature names to their configurations
   */
  features: Record<string, FeatureFlagConfig>;
}

/**
 * User identity for feature flag evaluation
 */
export interface UserIdentity {
  /**
   * Unique user identifier
   */
  userId?: string;

  /**
   * User handle/username (optional)
   */
  handle?: string;

  /**
   * User email (optional)
   */
  email?: string;
}

/**
 * Custom error for feature flag validation failures
 */
export class FeatureFlagValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FeatureFlagValidationError';
    Object.setPrototypeOf(this, FeatureFlagValidationError.prototype);
  }
}

/**
 * Environment type for detecting frontend vs backend
 */
export type Environment = 'browser' | 'node';

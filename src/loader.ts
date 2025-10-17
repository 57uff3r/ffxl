import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import type { FeatureFlagsConfig, FeatureFlagConfig } from './types.js';
import { FeatureFlagValidationError } from './types.js';
import { Logger, detectEnvironment } from './environment.js';

/**
 * Gets the feature flags file path from environment or uses default
 */
function getFeatureFlagsPath(): string {
  // Check environment variable for custom path
  const envPath = process.env.FEATURE_FLAGS_FILE || process.env.FFXL_FILE;

  if (envPath) {
    Logger.info(`Using feature flags file from environment: ${envPath}`);
    return path.isAbsolute(envPath) ? envPath : path.join(process.cwd(), envPath);
  }

  // Default to feature-flags.yaml in project root
  const defaultPath = path.join(process.cwd(), 'feature-flags.yaml');
  Logger.info(`Using default feature flags file: ${defaultPath}`);
  return defaultPath;
}

/**
 * Validates a single feature flag configuration
 */
function validateFeatureConfig(
  name: string,
  config: any
): asserts config is FeatureFlagConfig {
  if (typeof config !== 'object' || config === null) {
    throw new FeatureFlagValidationError(`Feature "${name}" must be an object`);
  }

  const hasEnabled = 'enabled' in config;
  const hasOnlyForUserIds = 'onlyForUserIds' in config;

  if (!hasEnabled && !hasOnlyForUserIds) {
    throw new FeatureFlagValidationError(
      `Feature "${name}" must have either "enabled" or "onlyForUserIds" property`
    );
  }

  if (hasEnabled && typeof config.enabled !== 'boolean') {
    throw new FeatureFlagValidationError(
      `Feature "${name}": "enabled" must be a boolean`
    );
  }

  if (hasOnlyForUserIds) {
    if (!Array.isArray(config.onlyForUserIds)) {
      throw new FeatureFlagValidationError(
        `Feature "${name}": "onlyForUserIds" must be an array`
      );
    }

    if (!config.onlyForUserIds.every((id: any) => typeof id === 'string')) {
      throw new FeatureFlagValidationError(
        `Feature "${name}": all items in "onlyForUserIds" must be strings`
      );
    }
  }

  if ('comment' in config && typeof config.comment !== 'string') {
    throw new FeatureFlagValidationError(`Feature "${name}": "comment" must be a string`);
  }
}

/**
 * Validates the complete feature flags configuration
 */
function validateConfig(data: any): asserts data is FeatureFlagsConfig {
  if (typeof data !== 'object' || data === null) {
    throw new FeatureFlagValidationError('Configuration must be an object');
  }

  if (!('features' in data)) {
    throw new FeatureFlagValidationError('Configuration must have a "features" property');
  }

  if (typeof data.features !== 'object' || data.features === null) {
    throw new FeatureFlagValidationError('"features" must be an object');
  }

  // Validate each feature
  for (const [name, config] of Object.entries(data.features)) {
    validateFeatureConfig(name, config);
  }
}

/**
 * Loads and validates feature flags from YAML file
 * This should only be called in Node.js environment during build
 */
export function loadFeatureFlags(): FeatureFlagsConfig {
  const env = detectEnvironment();

  if (env !== 'node') {
    throw new Error('loadFeatureFlags() can only be called in Node.js environment');
  }

  const filePath = getFeatureFlagsPath();

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new FeatureFlagValidationError(`Feature flags file not found: ${filePath}`);
    }

    // Read file contents
    const fileContents = fs.readFileSync(filePath, 'utf8');

    // Parse YAML
    const data = yaml.load(fileContents);

    // Validate configuration
    validateConfig(data);

    Logger.info(`Successfully loaded feature flags from ${filePath}`);
    Logger.info(`Loaded ${Object.keys(data.features).length} feature flag(s)`);

    return data;
  } catch (error) {
    if (error instanceof FeatureFlagValidationError) {
      Logger.error(`Feature flags validation failed: ${error.message}`);
      throw error;
    }

    if (error instanceof yaml.YAMLException) {
      Logger.error(`Failed to parse feature flags YAML: ${error.message}`);
      throw new FeatureFlagValidationError(`Invalid YAML syntax: ${error.message}`);
    }

    Logger.error(`Failed to load feature flags: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Loads feature flags configuration at build time and returns as JSON string
 * This is useful for embedding in build tools or bundlers
 */
export function loadFeatureFlagsAsString(): string {
  const config = loadFeatureFlags();
  return JSON.stringify(config);
}

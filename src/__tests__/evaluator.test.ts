import { describe, it, expect, beforeEach } from 'vitest';
import {
  isFeatureEnabled,
  isAnyFeatureEnabled,
  areAllFeaturesEnabled,
  getEnabledFeatures,
  featureExists,
  getAllFeatureNames,
  getFeatureFlags,
} from '../evaluator.js';
import { clearCache } from '../config.js';

describe('Feature Flag Evaluator', () => {
  beforeEach(() => {
    clearCache();
    // Set up test config
    process.env.FFXL_CONFIG = JSON.stringify({
      features: {
        test_feature_enabled: {
          enabled: true,
          comment: 'Test feature that is enabled',
        },
        test_feature_disabled: {
          enabled: false,
          comment: 'Test feature that is disabled',
        },
        test_feature_user_specific: {
          onlyForUserIds: ['user-123', 'user-456'],
          comment: 'Feature for specific users',
        },
        test_feature_combined: {
          enabled: false,
          onlyForUserIds: ['user-789'],
          comment: 'Combined config - user list takes precedence',
        },
      },
    });
  });

  describe('isFeatureEnabled', () => {
    it('should return true for enabled features', () => {
      expect(isFeatureEnabled('test_feature_enabled')).toBe(true);
    });

    it('should return false for disabled features', () => {
      expect(isFeatureEnabled('test_feature_disabled')).toBe(false);
    });

    it('should return false for non-existent features', () => {
      expect(isFeatureEnabled('non_existent')).toBe(false);
    });

    it('should return false for user-specific feature without user', () => {
      expect(isFeatureEnabled('test_feature_user_specific')).toBe(false);
    });

    it('should return true for user-specific feature with matching user', () => {
      expect(isFeatureEnabled('test_feature_user_specific', { userId: 'user-123' })).toBe(
        true
      );
    });

    it('should return false for user-specific feature with non-matching user', () => {
      expect(isFeatureEnabled('test_feature_user_specific', { userId: 'user-999' })).toBe(
        false
      );
    });

    it('should prioritize onlyForUserIds over enabled flag', () => {
      expect(isFeatureEnabled('test_feature_combined')).toBe(false);
      expect(isFeatureEnabled('test_feature_combined', { userId: 'user-789' })).toBe(
        true
      );
      expect(isFeatureEnabled('test_feature_combined', { userId: 'user-999' })).toBe(
        false
      );
    });
  });

  describe('isAnyFeatureEnabled', () => {
    it('should return true if any feature is enabled', () => {
      expect(isAnyFeatureEnabled(['test_feature_enabled', 'test_feature_disabled'])).toBe(
        true
      );
    });

    it('should return false if no features are enabled', () => {
      expect(isAnyFeatureEnabled(['test_feature_disabled', 'non_existent'])).toBe(false);
    });

    it('should work with user-specific features', () => {
      expect(
        isAnyFeatureEnabled(['test_feature_disabled', 'test_feature_user_specific'], {
          userId: 'user-123',
        })
      ).toBe(true);
    });
  });

  describe('areAllFeaturesEnabled', () => {
    it('should return true if all features are enabled', () => {
      expect(
        areAllFeaturesEnabled(['test_feature_enabled'], { userId: 'user-123' })
      ).toBe(true);
    });

    it('should return false if any feature is disabled', () => {
      expect(
        areAllFeaturesEnabled(['test_feature_enabled', 'test_feature_disabled'])
      ).toBe(false);
    });

    it('should work with user-specific features', () => {
      expect(
        areAllFeaturesEnabled(['test_feature_enabled', 'test_feature_user_specific'], {
          userId: 'user-123',
        })
      ).toBe(true);

      expect(
        areAllFeaturesEnabled(['test_feature_enabled', 'test_feature_user_specific'], {
          userId: 'user-999',
        })
      ).toBe(false);
    });
  });

  describe('getEnabledFeatures', () => {
    it('should return all enabled features', () => {
      const enabled = getEnabledFeatures();
      expect(enabled).toContain('test_feature_enabled');
      expect(enabled).not.toContain('test_feature_disabled');
      expect(enabled).not.toContain('test_feature_user_specific');
    });

    it('should include user-specific features for matching user', () => {
      const enabled = getEnabledFeatures({ userId: 'user-123' });
      expect(enabled).toContain('test_feature_enabled');
      expect(enabled).toContain('test_feature_user_specific');
      expect(enabled).not.toContain('test_feature_disabled');
    });
  });

  describe('featureExists', () => {
    it('should return true for existing features', () => {
      expect(featureExists('test_feature_enabled')).toBe(true);
    });

    it('should return false for non-existent features', () => {
      expect(featureExists('non_existent')).toBe(false);
    });
  });

  describe('getAllFeatureNames', () => {
    it('should return all feature names', () => {
      const names = getAllFeatureNames();
      expect(names).toHaveLength(4);
      expect(names).toContain('test_feature_enabled');
      expect(names).toContain('test_feature_disabled');
      expect(names).toContain('test_feature_user_specific');
      expect(names).toContain('test_feature_combined');
    });
  });

  describe('getFeatureFlags', () => {
    it('should return object with multiple feature states', () => {
      const flags = getFeatureFlags(['test_feature_enabled', 'test_feature_disabled']);
      expect(flags).toEqual({
        test_feature_enabled: true,
        test_feature_disabled: false,
      });
    });

    it('should work with user-specific features', () => {
      const flags = getFeatureFlags(
        ['test_feature_enabled', 'test_feature_user_specific'],
        { userId: 'user-123' }
      );
      expect(flags).toEqual({
        test_feature_enabled: true,
        test_feature_user_specific: true,
      });
    });
  });
});

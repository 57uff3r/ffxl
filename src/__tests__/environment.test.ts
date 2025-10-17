import { describe, it, expect } from 'vitest';
import { detectEnvironment, isDevelopment } from '../environment.js';

describe('Environment Detection', () => {
  describe('detectEnvironment', () => {
    it('should detect Node.js environment', () => {
      expect(detectEnvironment()).toBe('node');
    });
  });

  describe('isDevelopment', () => {
    it('should detect development mode based on NODE_ENV', () => {
      const originalEnv = process.env.NODE_ENV;

      process.env.NODE_ENV = 'development';
      expect(isDevelopment()).toBe(true);

      process.env.NODE_ENV = 'production';
      expect(isDevelopment()).toBe(false);

      process.env.NODE_ENV = 'dev';
      expect(isDevelopment()).toBe(true);

      // Restore
      process.env.NODE_ENV = originalEnv;
    });
  });
});

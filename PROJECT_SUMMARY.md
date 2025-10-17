# ffxl - Project Summary

## Overview

**ffxl** (Feature Flags Extra Light) is a production-ready TypeScript library for managing feature flags in JavaScript applications. It works seamlessly in both frontend (browser) and backend (Node.js) environments.

## Key Features

- **Lightweight**: Zero runtime dependencies (only `js-yaml` for build-time)
- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Universal**: Works in both browser and Node.js environments
- **YAML-Based**: Simple, human-readable configuration
- **User-Specific Flags**: Support for user-based feature toggles
- **Development-Friendly**: Informative logging in development mode
- **Well-Tested**: Comprehensive test suite with 22 passing tests
- **Modern Tooling**: ESM + CJS builds, CI/CD ready

## Architecture

### Core Components

1. **types.ts**: Type definitions for feature flags, user identity, and errors
2. **environment.ts**: Environment detection (browser vs Node.js) and smart logging
3. **loader.ts**: YAML loading, parsing, and validation (Node.js only)
4. **config.ts**: Configuration management and caching
5. **evaluator.ts**: Feature flag evaluation logic
6. **index.ts**: Public API exports

### How It Works

```
Build Time (Node.js)
├── Load feature-flags.yaml
├── Validate configuration
└── Embed as environment variable (JSON)

Runtime (Browser/Node.js)
├── Parse config from environment
├── Cache in memory
└── Evaluate features based on user context
```

## Configuration

### YAML Format

```yaml
features:
  feature_name:
    enabled: true          # Global enable/disable
    comment: "Description"

  user_specific_feature:
    onlyForUserIds:        # User-specific access
      - "user-id-1"
      - "user-id-2"
```

### Environment Variables

- `FEATURE_FLAGS_FILE` or `FFXL_FILE`: Custom YAML file path
- `FFXL_CONFIG` or `FEATURE_FLAGS_CONFIG`: JSON config (set at build time)
- `NODE_ENV`: Development mode detection

## API

### Loading (Build Time)
- `loadFeatureFlags()`: Load and validate YAML
- `loadFeatureFlagsAsString()`: Load as JSON string

### Evaluation (Runtime)
- `isFeatureEnabled(name, user?)`: Check single feature
- `isAnyFeatureEnabled(names[], user?)`: Check if any enabled
- `areAllFeaturesEnabled(names[], user?)`: Check if all enabled
- `getEnabledFeatures(user?)`: Get all enabled features
- `getFeatureFlags(names[], user?)`: Batch check multiple features

### Utilities
- `featureExists(name)`: Check feature existence
- `getAllFeatureNames()`: Get all feature names
- `getFeatureConfig(name)`: Get raw config (debugging)
- `clearCache()`: Clear cached config

## Development Tools

### Package Scripts

```bash
npm run build         # Build library (CJS + ESM + types)
npm run dev          # Watch mode for development
npm test             # Run tests
npm run test:watch   # Watch mode for tests
npm run test:coverage # Generate coverage report
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
npm run typecheck    # TypeScript type checking
```

### CI/CD

GitHub Actions workflows:
- **ci.yml**: Runs on push/PR (lint, typecheck, test, build) across Node 18, 20, 22
- **publish.yml**: Publishes to NPM on release

## Project Structure

```
ffxl/
├── src/                    # Source code
│   ├── __tests__/         # Test files (Vitest)
│   ├── types.ts           # Type definitions
│   ├── environment.ts     # Env detection & logging
│   ├── loader.ts          # YAML loading
│   ├── config.ts          # Config management
│   ├── evaluator.ts       # Feature evaluation
│   └── index.ts           # Public API
├── examples/              # Usage examples
│   ├── basic-usage.ts
│   └── nextjs-usage.ts
├── .github/workflows/     # CI/CD pipelines
├── dist/                  # Build output (generated)
│   ├── index.js          # CJS bundle
│   ├── index.mjs         # ESM bundle
│   └── index.d.ts        # Type definitions
└── [config files]         # tsconfig, eslint, prettier, etc.
```

## Technology Stack

- **Language**: TypeScript 5.7
- **Build Tool**: tsup (esbuild-based)
- **Test Framework**: Vitest
- **Linting**: ESLint + TypeScript ESLint
- **Formatting**: Prettier
- **CI/CD**: GitHub Actions
- **Package Manager**: npm

## Testing

- 22 tests covering all major functionality
- Tests for environment detection
- Tests for feature evaluation logic
- Tests for user-specific features
- Tests for error handling

## Distribution

The library is distributed with:
- **CommonJS**: `dist/index.js` (for Node.js require)
- **ESM**: `dist/index.mjs` (for modern import)
- **Types**: `dist/index.d.ts` and `dist/index.d.mts`
- **Source Maps**: Included for debugging

Package exports configuration supports modern Node.js resolution.

## Smart Features

### Environment Detection
- Automatically detects browser vs Node.js environment
- Uses `globalThis` for cross-platform compatibility

### Development Logging
- Logs only in development mode (`NODE_ENV=development|dev`)
- Browser: Uses `console` (info, warn, error)
- Node.js: Uses `process.stdout` / `process.stderr`
- Prefixed with `[ffxl]` for easy filtering

### Validation
- Comprehensive YAML validation at build time
- Clear error messages for configuration issues
- Type-safe assertions

### User Targeting
- User-specific feature flags via `onlyForUserIds`
- User list takes precedence over global `enabled` flag
- Flexible user identity (userId, handle, email)

## Next Steps for Publishing

1. Update `package.json` with correct repository URL
2. Update `package.json` with author information
3. Create GitHub repository
4. Add NPM token to GitHub secrets (`NPM_TOKEN`)
5. Create a release on GitHub to trigger publish
6. Verify published package on npm

## Usage Example

```typescript
// Build time (next.config.ts, vite.config.ts, etc.)
import { loadFeatureFlags } from 'ffxl';
const config = loadFeatureFlags();
process.env.FFXL_CONFIG = JSON.stringify(config);

// Runtime
import { isFeatureEnabled } from 'ffxl';
if (isFeatureEnabled('new_dashboard', { userId: '123' })) {
  // Show new dashboard
}
```

## License

MIT License - See LICENSE file

---

**Built with**: TypeScript, tsup, Vitest, ESLint, Prettier
**Target**: Node.js 18+, Modern browsers
**Bundle Size**: ~9KB (CJS), ~8KB (ESM)

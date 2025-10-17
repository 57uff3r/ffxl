# ffxl - Feature Flags Extra Light

[![npm version](https://badge.fury.io/js/ffxl.svg)](https://www.npmjs.com/package/ffxl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Write for me an intro paragraph for project summary based on my inputs

There are many different feature flag services. Most of them are large and hard to use: they rely on APIs,
store flags on remote servers. Some of them require sophisticated condifs. Featue flags extra light (ffxl)
is a lightweight solution for those, who need very simple feature flags (which can be easily stored in local
repository via YAML files).

## Features

- Lightweight and zero-dependency runtime
- TypeScript support with full type safety
- Works in both browser and Node.js environments
- YAML-based configuration
- Environment variable support for custom config paths
- User-specific feature flags
- Development mode with informative logging
- Comprehensive test coverage
- Modern build tooling with ESM and CJS support

## Installation

```bash
npm install ffxl
```

## Quick Start

### 1. Create a feature flags configuration file

Create a `feature-flags.yaml` file in your project root:

```yaml
features:
  new_dashboard:
    enabled: true
    comment: "New dashboard UI"

  beta_feature:
    enabled: false
    comment: "Beta feature - not ready yet"

  admin_panel:
    onlyForUserIds:
      - "user-123"
      - "user-456"
    comment: "Admin panel - restricted access"
```

### 2. Load configuration at build time (Backend/Node.js)

```typescript
import { loadFeatureFlags } from 'ffxl';

// During your build process or server initialization
const config = loadFeatureFlags();

// Set as environment variable for runtime access
process.env.FFXL_CONFIG = JSON.stringify(config);
```

### 3. Use feature flags in your code

```typescript
import { isFeatureEnabled } from 'ffxl';

// Simple check
if (isFeatureEnabled('new_dashboard')) {
  // Show new dashboard
}

// With user context
const user = { userId: 'user-123' };
if (isFeatureEnabled('admin_panel', user)) {
  // Show admin panel
}
```

## API Reference

### Loading Configuration

#### `loadFeatureFlags(): FeatureFlagsConfig`

Loads and validates feature flags from YAML file. **Only works in Node.js environment.**

```typescript
import { loadFeatureFlags } from 'ffxl';

const config = loadFeatureFlags();
```

#### `loadFeatureFlagsAsString(): string`

Loads feature flags and returns as JSON string. Useful for build tools.

```typescript
import { loadFeatureFlagsAsString } from 'ffxl';

const configString = loadFeatureFlagsAsString();
process.env.FFXL_CONFIG = configString;
```

### Feature Evaluation

#### `isFeatureEnabled(featureName: string, user?: UserIdentity): boolean`

Checks if a feature is enabled for the given user.

```typescript
import { isFeatureEnabled } from 'ffxl';

// Global feature
isFeatureEnabled('new_dashboard'); // true/false

// User-specific feature
isFeatureEnabled('admin_panel', { userId: 'user-123' }); // true/false
```

#### `isAnyFeatureEnabled(featureNames: string[], user?: UserIdentity): boolean`

Returns true if ANY of the specified features are enabled.

```typescript
import { isAnyFeatureEnabled } from 'ffxl';

isAnyFeatureEnabled(['feature1', 'feature2'], user);
```

#### `areAllFeaturesEnabled(featureNames: string[], user?: UserIdentity): boolean`

Returns true if ALL of the specified features are enabled.

```typescript
import { areAllFeaturesEnabled } from 'ffxl';

areAllFeaturesEnabled(['feature1', 'feature2'], user);
```

#### `getEnabledFeatures(user?: UserIdentity): string[]`

Gets all enabled features for the given user.

```typescript
import { getEnabledFeatures } from 'ffxl';

const enabled = getEnabledFeatures(user);
// ['new_dashboard', 'admin_panel']
```

#### `getFeatureFlags(featureNames: string[], user?: UserIdentity): Record<string, boolean>`

Gets multiple feature flags at once as an object.

```typescript
import { getFeatureFlags } from 'ffxl';

const flags = getFeatureFlags(['feature1', 'feature2'], user);
// { feature1: true, feature2: false }
```

### Utility Functions

#### `featureExists(featureName: string): boolean`

Checks if a feature exists in the configuration.

#### `getAllFeatureNames(): string[]`

Gets all feature names from the configuration.

#### `getFeatureConfig(featureName: string): FeatureFlagConfig | null`

Gets the raw configuration for a specific feature. Useful for debugging.

## Configuration

### YAML File Location

By default, ffxl looks for `feature-flags.yaml` in your project root. You can customize this using environment variables:

```bash
# Option 1: Use FEATURE_FLAGS_FILE
FEATURE_FLAGS_FILE=./config/flags.yaml

# Option 2: Use FFXL_FILE
FFXL_FILE=./config/flags.yaml
```

### YAML Configuration Format

```yaml
features:
  feature_name:
    enabled: true          # Global enable/disable
    comment: "Description" # Optional comment

  user_specific_feature:
    onlyForUserIds:        # User-specific access
      - "user-id-1"
      - "user-id-2"
    comment: "Description"

  combined_feature:
    enabled: false         # User list takes precedence
    onlyForUserIds:
      - "test-user-id"
```

### Feature Flag Rules

1. Each feature must have either `enabled` (boolean) or `onlyForUserIds` (array)
2. When `onlyForUserIds` is present and non-empty, it takes precedence over `enabled`
3. User-specific features require a user object with `userId` property
4. Unknown features default to disabled with a development warning

### User Identity

```typescript
interface UserIdentity {
  userId?: string;   // Primary identifier
  handle?: string;   // Optional username
  email?: string;    // Optional email
}
```

## Usage Examples

### Backend (Node.js)

```typescript
// In your build script or server initialization
import { loadFeatureFlags } from 'ffxl';

const config = loadFeatureFlags();
process.env.FFXL_CONFIG = JSON.stringify(config);

// In your application code
import { isFeatureEnabled } from 'ffxl';

app.get('/api/dashboard', (req, res) => {
  if (isFeatureEnabled('new_dashboard', req.user)) {
    // Serve new dashboard
  } else {
    // Serve old dashboard
  }
});
```

### Frontend (Browser)

Ensure your build tool sets the `FFXL_CONFIG` environment variable:

```typescript
// In your Vite/Webpack config
import { loadFeatureFlagsAsString } from 'ffxl';

export default {
  define: {
    'process.env.FFXL_CONFIG': loadFeatureFlagsAsString()
  }
}

// In your application
import { isFeatureEnabled } from 'ffxl';

function Dashboard({ user }) {
  const showNewUI = isFeatureEnabled('new_dashboard', user);

  return showNewUI ? <NewDashboard /> : <OldDashboard />;
}
```

### Next.js Example

```typescript
// next.config.ts
import { loadFeatureFlags } from 'ffxl';

const featureFlags = loadFeatureFlags();

export default {
  env: {
    FFXL_CONFIG: JSON.stringify(featureFlags)
  }
}

// In your components or API routes
import { isFeatureEnabled } from 'ffxl';

export default function Page() {
  if (isFeatureEnabled('new_feature')) {
    return <NewFeature />;
  }
  return <OldFeature />;
}
```

## Development Mode

In development mode (`NODE_ENV=development` or `NODE_ENV=dev`), ffxl provides helpful logging:

- Configuration load success/failure
- Unknown feature warnings
- Evaluation errors

Logs output to:
- **Browser**: `console` (info, warn, error)
- **Node.js**: `process.stdout` and `process.stderr`

## TypeScript Support

ffxl is written in TypeScript and provides full type definitions:

```typescript
import type {
  FeatureFlagConfig,
  FeatureFlagsConfig,
  UserIdentity,
  Environment
} from 'ffxl';
```

## Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contacts

Drop me a line if uo have any questions or suggestions:

[LinkedIn](https://www.linkedin.com/in/a-korchak/) • [X/Twitter](https://x.com/andreykorchak) • [Website](https://akorchak.software/) • [me@akorchak.software](mailto:me@akorchak.software)


## License

MIT

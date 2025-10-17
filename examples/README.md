# ffxl Examples

This directory contains example usage patterns for the ffxl library.

## Examples

### basic-usage.ts
Basic usage example showing how to load and evaluate feature flags in a Node.js application.

**Key concepts:**
- Loading feature flags at startup
- Checking global features
- Checking user-specific features
- Getting all enabled features
- Batch checking multiple features

### nextjs-usage.ts
Complete Next.js integration example showing:
- Build-time configuration
- Server Components
- API Routes
- Client Components
- Middleware for route protection

## Running the Examples

The examples are written in TypeScript and are meant to be educational. To use them in your project:

1. Install ffxl in your project:
   ```bash
   npm install ffxl
   ```

2. Copy the relevant code patterns from the examples

3. Create your `feature-flags.yaml` file based on `feature-flags.example.yaml`

4. Adapt the code to your specific use case

## Common Patterns

### Loading at Build Time
```typescript
import { loadFeatureFlags } from 'ffxl';

const config = loadFeatureFlags();
process.env.FFXL_CONFIG = JSON.stringify(config);
```

### Checking Features
```typescript
import { isFeatureEnabled } from 'ffxl';

// Global check
if (isFeatureEnabled('feature_name')) {
  // Feature is enabled
}

// User-specific check
if (isFeatureEnabled('feature_name', { userId: '123' })) {
  // Feature is enabled for this user
}
```

### Multiple Features
```typescript
import { getFeatureFlags } from 'ffxl';

const flags = getFeatureFlags(['feature1', 'feature2'], user);
// { feature1: true, feature2: false }
```

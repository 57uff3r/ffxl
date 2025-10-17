/**
 * Basic usage example for ffxl
 *
 * This example demonstrates how to use ffxl in a Node.js backend application
 */

import {
  loadFeatureFlags,
  isFeatureEnabled,
  getEnabledFeatures,
  getFeatureFlags,
} from 'ffxl';

// Step 1: Load feature flags at application startup
// This would typically be done in your server initialization code
const config = loadFeatureFlags();
process.env.FFXL_CONFIG = JSON.stringify(config);

console.log('Feature flags loaded successfully!\n');

// Step 2: Use feature flags in your application

// Simple global feature check
if (isFeatureEnabled('new_dashboard')) {
  console.log('✓ New dashboard is enabled globally');
} else {
  console.log('✗ New dashboard is disabled');
}

// User-specific feature check
const user = { userId: 'user-123' };

if (isFeatureEnabled('admin_panel', user)) {
  console.log('✓ Admin panel is enabled for user-123');
} else {
  console.log('✗ Admin panel is not enabled for user-123');
}

// Get all enabled features for a user
const enabledFeatures = getEnabledFeatures(user);
console.log('\nEnabled features for user:', enabledFeatures);

// Get multiple feature flags at once
const flags = getFeatureFlags(['new_dashboard', 'beta_feature', 'admin_panel'], user);
console.log('\nFeature flags status:', flags);

// Example: Using in an Express.js-style route handler
function dashboardHandler(req: any, res: any) {
  const user = req.user; // Assume user is attached to request

  if (isFeatureEnabled('new_dashboard', user)) {
    // Show new dashboard
    return res.render('dashboard-v2', { user });
  }

  // Show old dashboard
  return res.render('dashboard-v1', { user });
}

console.log('\n✓ Example completed successfully');

/**
 * Next.js integration example for ffxl
 *
 * This shows how to integrate ffxl with Next.js for both server-side
 * and client-side feature flags
 */

// ============================================================
// 1. next.config.ts - Load flags at build time
// ============================================================

import { loadFeatureFlags } from 'ffxl';

const featureFlags = loadFeatureFlags();

const nextConfig = {
  env: {
    FFXL_CONFIG: JSON.stringify(featureFlags),
  },
};

export default nextConfig;

// ============================================================
// 2. Server Component Example
// ============================================================

import { isFeatureEnabled } from 'ffxl';

export default function DashboardPage() {
  // Check feature flag on server
  const showNewUI = isFeatureEnabled('new_dashboard');

  return (
    <div>
      <h1>Dashboard</h1>
      {showNewUI ? <NewDashboardUI /> : <OldDashboardUI />}
    </div>
  );
}

function NewDashboardUI() {
  return <div>New Dashboard (v2)</div>;
}

function OldDashboardUI() {
  return <div>Old Dashboard (v1)</div>;
}

// ============================================================
// 3. API Route Example
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { isFeatureEnabled } from 'ffxl';

export async function GET(request: NextRequest) {
  // Get user from session/auth
  const user = { userId: 'user-123' }; // Replace with actual user from auth

  // Check if feature is enabled for this user
  if (isFeatureEnabled('beta_analytics', user)) {
    // Return new analytics data
    return NextResponse.json({
      analytics: 'beta',
      data: { /* ... */ },
    });
  }

  // Return standard analytics data
  return NextResponse.json({
    analytics: 'standard',
    data: { /* ... */ },
  });
}

// ============================================================
// 4. Client Component Example
// ============================================================

'use client';

import { isFeatureEnabled } from 'ffxl';
import { useEffect, useState } from 'react';

export function FeatureToggleComponent() {
  const [user, setUser] = useState<{ userId: string } | null>(null);

  useEffect(() => {
    // Fetch current user
    // setUser(...);
  }, []);

  const showAdminPanel = user && isFeatureEnabled('admin_panel', user);

  return (
    <div>
      {showAdminPanel && <AdminPanel />}
      <MainContent />
    </div>
  );
}

function AdminPanel() {
  return <div>Admin Panel</div>;
}

function MainContent() {
  return <div>Main Content</div>;
}

// ============================================================
// 5. Middleware Example (Route Protection)
// ============================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isFeatureEnabled } from 'ffxl';

export function middleware(request: NextRequest) {
  // Check if the new admin panel feature is enabled
  if (!isFeatureEnabled('admin_panel')) {
    // Redirect to 404 if feature is disabled globally
    return NextResponse.redirect(new URL('/404', request.url));
  }

  // For user-specific checks, you'd need to get the user from cookies/session
  // const user = getUserFromRequest(request);
  // if (!isFeatureEnabled('admin_panel', user)) {
  //   return NextResponse.redirect(new URL('/unauthorized', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};

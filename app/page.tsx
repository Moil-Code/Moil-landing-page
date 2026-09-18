import { permanentRedirect } from 'next/navigation';

// moilapp.com (/) serves the primary "Stop Wearing Every Hat" business landing
// page. Root redirects to /business so there is one canonical home, and all
// homepage authority consolidates onto the business page.
export default function Page() {
  // Permanent (308), not the default 307: a temporary redirect tells Google
  // `/` may come back, so it keeps `/` as a candidate URL instead of
  // consolidating onto /business.
  permanentRedirect('/business');
}

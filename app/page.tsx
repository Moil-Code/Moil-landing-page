import { redirect } from 'next/navigation';

// moilapp.com (/) serves the primary "Stop Wearing Every Hat" business landing
// page. Root redirects to /business so there is one canonical home, and all
// homepage authority consolidates onto the business page.
export default function Page() {
  redirect('/business');
}

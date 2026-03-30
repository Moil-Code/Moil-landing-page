import { redirect } from 'next/navigation';

// Redirect root to /business — consolidates all SEO authority to the
// canonical business landing page and eliminates duplicate content.
export default function Page() {
  redirect('/business');
}

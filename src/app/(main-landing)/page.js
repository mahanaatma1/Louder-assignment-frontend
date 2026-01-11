/**
 * Main Landing Page
 * Redirects to events page
 */

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/events');
}


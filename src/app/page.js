/**
 * Root Page
 * Redirects to main landing
 */

import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/events');
}

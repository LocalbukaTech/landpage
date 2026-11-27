'use client';

import { AboutUsContactEditor } from '@/components/admin/contact/AboutUsContactEditor';

export default function AdminAboutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
          About Us &amp; Public Contact Management
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Update the live About Us page (Hero, Our Story, Mission &amp; Vision,
          Core Values, CTA Banner) and public Contact Us channels in real time
        </p>
      </div>

      <AboutUsContactEditor />
    </div>
  );
}

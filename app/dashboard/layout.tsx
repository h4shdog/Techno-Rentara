'use client';

import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/');
      return;
    }
    // Redirect providers away from the renter dashboard root
    if (user.role === 'provider' && window.location.pathname === '/dashboard') {
      router.replace('/dashboard/provider');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
          <p className="text-foreground/40 text-sm tracking-wide">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pb-6">{children}</div>
    </div>
  );
}

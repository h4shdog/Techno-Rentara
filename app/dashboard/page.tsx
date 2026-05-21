'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { VEHICLE_TYPES, getProvidersByVehicleType, type VehicleType } from '@/lib/mockData';
import { useRouter } from 'next/navigation';
import VehicleIcon from '@/components/VehicleIcon';
import { ShieldCheck, Star, MapPin } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect providers to their own dashboard
  useEffect(() => {
    if (user?.role === 'provider') {
      router.replace('/dashboard/provider');
    }
  }, [user, router]);

  // Show nothing while redirecting
  if (!user || user.role === 'provider') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main>
      {/* Hero */}
      <div className="bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
          <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Dashboard</p>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-wide">
            Hello, <span className="text-primary">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-white/50 text-sm mt-1 tracking-wide">What would you like to rent today?</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Vehicle type grid */}
        <div className="mb-2">
          <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-4">Choose Vehicle Type</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {Object.entries(VEHICLE_TYPES).map(([type, data]) => {
              const count = getProvidersByVehicleType(type as VehicleType).length;
              return (
                <button
                  key={type}
                  onClick={() => router.push(`/dashboard/map?type=${type}`)}
                  className="group flex flex-col items-center gap-2 p-4 sm:p-6 bg-card border border-border rounded-2xl hover:border-primary hover:shadow-md active:scale-95 transition-all duration-200"
                >
                  <VehicleIcon
                    name={data.icon}
                    size={32}
                    className="text-foreground/60 group-hover:text-primary transition-colors"
                    strokeWidth={1.5}
                  />
                  <div className="text-center">
                    <p className="text-xs font-bold text-foreground tracking-wide leading-none">{data.label}</p>
                    <p className="text-xs text-foreground/30 mt-0.5">{count} providers</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border my-8" />

        {/* Why RenTara */}
        <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-4">Why RenTara</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { Icon: ShieldCheck, title: 'Verified Providers', desc: 'All providers are background-checked and fully insured.' },
            { Icon: Star, title: 'Best Prices', desc: 'Compare rates from multiple providers in one place.' },
            { Icon: MapPin, title: 'Map View', desc: 'Find the closest available vehicle on an interactive map.' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4 p-5 bg-card border border-border rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <item.Icon size={18} className="text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground tracking-wide">{item.title}</p>
                <p className="text-xs text-foreground/50 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

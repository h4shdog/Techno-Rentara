'use client';

import { useSearchParams } from 'next/navigation';
import { getProvidersByVehicleType, VEHICLE_TYPES, type VehicleType } from '@/lib/mockData';
import MapView from '@/components/MapView';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import VehicleIcon from '@/components/VehicleIcon';
import { MapPin, ArrowLeft } from 'lucide-react';

export default function MapPage() {
  const searchParams = useSearchParams();
  const vehicleType = (searchParams.get('type') as VehicleType) || null;

  if (!vehicleType || !VEHICLE_TYPES[vehicleType]) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="font-serif font-semibold text-foreground mb-2">Invalid vehicle type</p>
          <Link href="/dashboard" className="text-primary text-sm hover:underline">← Go back</Link>
        </div>
      </div>
    );
  }

  const providers = getProvidersByVehicleType(vehicleType);
  const vehicleData = VEHICLE_TYPES[vehicleType];
  const vehicleLabel = vehicleData?.label || '';
  const totalVehicles = providers.reduce((acc, p) => acc + p.vehicles.length, 0);

  if (providers.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <VehicleIcon name={vehicleData?.icon} size={40} className="text-foreground/20" strokeWidth={1} />
          </div>
          <p className="font-serif font-semibold text-foreground mb-1">No {vehicleLabel.toLowerCase()} available</p>
          <p className="text-foreground/40 text-sm mb-5">No providers for this type right now.</p>
          <Link href="/dashboard" className="text-primary text-sm hover:underline">← Try another type</Link>
        </div>
      </div>
    );
  }

  return (
    <main>
      {/* Header */}
      <div className="bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 relative z-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-xs tracking-widest uppercase font-medium transition-colors mb-3"
          >
            <ArrowLeft size={13} />
            Back
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <VehicleIcon name={vehicleData?.icon} size={22} className="text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                Available {vehicleLabel}
              </h1>
              <p className="text-white/50 text-sm mt-0.5">
                {providers.length} provider{providers.length !== 1 ? 's' : ''} · {totalVehicles} vehicle{totalVehicles !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Provider pills */}
        <div className="flex gap-2 flex-wrap mb-5">
          {providers.map((provider) => (
            <div key={provider.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-xs">
              <MapPin size={11} className="text-primary" />
              <span className="font-medium text-foreground">{provider.name}</span>
              <span className="text-foreground/40">· {provider.vehicles.length}v</span>
            </div>
          ))}
        </div>

        {/* Map card */}
        <div className="bg-card border border-border rounded-2xl">
          <div className="px-5 py-3 border-b border-border flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest">Live Map</p>
          </div>
          <div className="p-3 sm:p-4">
            <MapView
              providers={providers}
              center={{ lat: 14.5994, lng: 120.9842 }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

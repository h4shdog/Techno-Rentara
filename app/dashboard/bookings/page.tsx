'use client';

import { useState } from 'react';
import { Car, Van, Calendar, Star, MapPin, Navigation, User2, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import ChatModal from '@/components/ChatModal';

type Status = 'confirmed' | 'completed';
type PickupMethod = 'meetup' | 'delivery';
type DriverOption = 'yes' | 'no';

interface Booking {
  id: number;
  status: Status;
  vehicle: string;
  vehicleIcon: 'car' | 'van';
  year: string;
  provider: string;
  rating: number;
  reviews: number;
  dates: string;
  days: string;
  total: string;
  pickupMethod: PickupMethod;
  withDriver: DriverOption;
}

const bookings: Booking[] = [
  {
    id: 1,
    status: 'confirmed',
    vehicle: 'Toyota Corolla',
    vehicleIcon: 'car',
    year: '2023',
    provider: "Maria's Vehicle Rentals",
    rating: 4.8,
    reviews: 247,
    dates: 'May 25–28',
    days: '3 days',
    total: '₱4,500',
    pickupMethod: 'meetup',
    withDriver: 'no',
  },
  {
    id: 2,
    status: 'completed',
    vehicle: 'Ford Transit',
    vehicleIcon: 'van',
    year: '2023',
    provider: "Juan's Transport Services",
    rating: 4.6,
    reviews: 189,
    dates: 'May 10–15',
    days: '5 days',
    total: '₱12,500',
    pickupMethod: 'delivery',
    withDriver: 'yes',
  },
];

const statusStyle: Record<Status, { label: string; dot: string; text: string; bg: string; bar: string }> = {
  confirmed: { label: 'Confirmed', dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-500/10', bar: 'bg-primary' },
  completed: { label: 'Completed', dot: 'bg-gray-400',  text: 'text-gray-500',  bg: 'bg-gray-500/10',  bar: 'bg-gray-300' },
};

function Badge({ status }: { status: Status }) {
  const s = statusStyle[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-widest uppercase ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export default function BookingsPage() {
  const [chatBooking, setChatBooking] = useState<Booking | null>(null);

  return (
    <main>
      {/* Header */}
      <div className="bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 relative z-10">
          <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Dashboard</p>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">My Bookings</h1>
          <p className="text-white/50 text-sm mt-1">Track and manage your rentals</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-4">

        {bookings.map((b) => {
          const s   = statusStyle[b.status];
          const dim = b.status === 'completed';
          return (
            <div
              key={b.id}
              className={`bg-card border border-border rounded-2xl overflow-hidden transition-opacity ${dim ? 'opacity-60 hover:opacity-80' : ''}`}
            >
              <div className={`h-1 ${s.bar}`} />
              <div className="p-5 sm:p-6">

                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${dim ? 'bg-muted' : 'bg-primary/10'}`}>
                      {b.vehicleIcon === 'car'
                        ? <Car  size={22} className={dim ? 'text-foreground/40' : 'text-primary'} strokeWidth={1.5} />
                        : <Van  size={22} className={dim ? 'text-foreground/40' : 'text-primary'} strokeWidth={1.5} />}
                    </div>
                    <div>
                      <p className="font-serif font-bold text-foreground tracking-wide">{b.vehicle}</p>
                      <p className="text-xs text-foreground/40 tracking-wide mt-0.5">{b.year} · {b.provider}</p>
                    </div>
                  </div>
                  <Badge status={b.status} />
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-border">
                  <div>
                    <p className="text-xs text-foreground/40 uppercase tracking-widest mb-1">Provider</p>
                    <p className="text-sm font-medium text-foreground">{b.provider.split("'")[0]}'s</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={11} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs text-foreground/40">{b.rating} ({b.reviews})</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40 uppercase tracking-widest mb-1">Dates</p>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-foreground/30" />
                      <p className="text-sm font-medium text-foreground">{b.dates}</p>
                    </div>
                    <p className="text-xs text-foreground/40 mt-1">{b.days}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs text-foreground/40 uppercase tracking-widest mb-1">Total</p>
                    <p className={`text-xl font-bold ${dim ? 'text-foreground' : 'text-primary'}`}>{b.total}</p>
                  </div>
                </div>

                {/* Booking options */}
                <div className="flex flex-wrap gap-2 mt-4 mb-1">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${dim ? 'bg-muted text-foreground/50' : 'bg-primary/10 text-primary'}`}>
                    {b.pickupMethod === 'meetup'
                      ? <><Navigation size={11} /> Meet-up / Pick-up</>
                      : <><MapPin size={11} /> Provider Delivers</>}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${dim ? 'bg-muted text-foreground/50' : 'bg-primary/10 text-primary'}`}>
                    <User2 size={11} /> {b.withDriver === 'yes' ? 'With Driver' : 'Self-Drive'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {b.status === 'confirmed' && (
                    <>
                      <button className="h-10 px-5 bg-primary text-white text-xs font-semibold rounded-xl tracking-widest uppercase hover:bg-primary/90 active:scale-95 transition-all">
                        View Details
                      </button>
                      <button
                        onClick={() => setChatBooking(b)}
                        className="h-10 px-5 border border-border text-foreground/60 text-xs font-semibold rounded-xl tracking-widest uppercase hover:border-primary/40 hover:text-primary active:scale-95 transition-all flex items-center gap-2"
                      >
                        <MessageSquare size={13} /> Message Provider
                      </button>
                      <button className="h-10 px-5 border border-border text-foreground/60 text-xs font-semibold rounded-xl tracking-widest uppercase hover:border-foreground/30 hover:text-foreground active:scale-95 transition-all">
                        Cancel
                      </button>
                    </>
                  )}
                  {b.status === 'completed' && (
                    <>
                      <button
                        onClick={() => setChatBooking(b)}
                        className="h-10 px-5 border border-border text-foreground/60 text-xs font-semibold rounded-xl tracking-widest uppercase hover:border-primary/40 hover:text-primary active:scale-95 transition-all flex items-center gap-2"
                      >
                        <MessageSquare size={13} /> View Messages
                      </button>
                      <button className="h-10 px-5 border border-border text-foreground/60 text-xs font-semibold rounded-xl tracking-widest uppercase hover:border-foreground/30 hover:text-foreground active:scale-95 transition-all">
                        Leave Review
                      </button>
                      <button className="h-10 px-5 border border-border text-foreground/60 text-xs font-semibold rounded-xl tracking-widest uppercase hover:border-foreground/30 hover:text-foreground active:scale-95 transition-all">
                        Book Again
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        <div className="border border-dashed border-border rounded-2xl p-12 text-center">
          <Calendar size={36} className="text-foreground/15 mx-auto mb-4" strokeWidth={1} />
          <p className="font-serif font-semibold text-foreground mb-1 tracking-wide">No more bookings</p>
          <p className="text-foreground/40 text-sm mb-6">You've seen all your bookings</p>
          <Link href="/dashboard">
            <button className="h-10 px-6 bg-primary text-white text-xs font-semibold rounded-xl tracking-widest uppercase hover:bg-primary/90 active:scale-95 transition-all">
              Find a Vehicle
            </button>
          </Link>
        </div>
      </div>

      {/* Chat modal */}
      {chatBooking && (
        <ChatModal
          bookingId={chatBooking.id}
          viewerRole="renter"
          otherPartyName={chatBooking.provider}
          context={`${chatBooking.vehicle} · ${chatBooking.dates}`}
          onClose={() => setChatBooking(null)}
        />
      )}
    </main>
  );
}

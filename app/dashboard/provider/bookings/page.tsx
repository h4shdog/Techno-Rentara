'use client';

import { useState } from 'react';
import VehicleIcon from '@/components/VehicleIcon';
import { User, Mail, Calendar, Clock, X, MessageSquare, Navigation, User2, MapPin, Star } from 'lucide-react';
import ChatModal from '@/components/ChatModal';

type Status = 'pending' | 'confirmed' | 'completed' | 'declined' | 'cancelled';
type PickupMethod = 'meetup' | 'delivery';
type DriverOption = 'yes' | 'no';

const statusCfg: Record<Status, { label: string; bar: string; border: string; bg: string; badge: string; badgeText: string; dot: string }> = {
  pending:   { label: 'Waiting for Decision', bar: 'bg-yellow-500', border: 'border-yellow-500/20', bg: 'bg-yellow-500/5',  badge: 'bg-yellow-500/10', badgeText: 'text-yellow-700', dot: 'bg-yellow-500' },
  confirmed: { label: 'Confirmed',            bar: 'bg-green-500',  border: 'border-green-500/20',  bg: 'bg-green-500/5',   badge: 'bg-green-500/10',  badgeText: 'text-green-700',  dot: 'bg-green-500'  },
  completed: { label: 'Completed',            bar: 'bg-gray-300',   border: 'border-border',         bg: '',                 badge: 'bg-gray-500/10',   badgeText: 'text-gray-500',   dot: 'bg-gray-400'   },
  declined:  { label: 'Declined',             bar: 'bg-red-400',    border: 'border-red-400/20',     bg: 'bg-red-500/5',     badge: 'bg-red-500/10',    badgeText: 'text-red-600',    dot: 'bg-red-400'    },
  cancelled: { label: 'Cancelled',            bar: 'bg-gray-300',   border: 'border-border',         bg: '',                 badge: 'bg-gray-500/10',   badgeText: 'text-gray-500',   dot: 'bg-gray-400'   },
};

interface Booking {
  id: number;
  status: Status;
  renter: string;
  email: string;
  vehicle: string;
  year: string;
  icon: string;
  dates: string;
  days: string;
  cost: string;
  pickupMethod: PickupMethod;
  withDriver: DriverOption;
  review?: { rating: number; comment: string };
}

const initialBookings: Booking[] = [
  { id: 1, status: 'pending',   renter: 'John Renter', email: 'john@email.com',  vehicle: 'Toyota Corolla', year: '2023', icon: 'car',   dates: 'May 25–28', days: '3 days', cost: '₱4,500', pickupMethod: 'meetup',   withDriver: 'no'  },
  { id: 2, status: 'confirmed', renter: 'Jane Doe',    email: 'jane@email.com',  vehicle: 'Ford Transit',   year: '2023', icon: 'van',   dates: 'May 22–24', days: '2 days', cost: '₱5,000', pickupMethod: 'delivery', withDriver: 'yes' },
  { id: 3, status: 'completed', renter: 'Bob Smith',   email: 'bob@email.com',   vehicle: 'Isuzu Truck',    year: '2023', icon: 'truck', dates: 'May 10–12', days: '2 days', cost: '₱7,000', pickupMethod: 'meetup',   withDriver: 'no',  review: { rating: 5, comment: 'Great truck, very clean and well-maintained!' } },
];

// ── Details Modal ─────────────────────────────────────────
function DetailsModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <h3 className="font-serif font-bold text-foreground text-lg">Booking Details</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground/50 hover:text-foreground">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: 'Renter',        value: booking.renter },
            { label: 'Email',         value: booking.email },
            { label: 'Vehicle',       value: `${booking.vehicle} (${booking.year})` },
            { label: 'Dates',         value: booking.dates },
            { label: 'Duration',      value: booking.days },
            { label: 'Total',         value: booking.cost },
            { label: 'Pickup',        value: booking.pickupMethod === 'meetup' ? 'Meet-up / Pick-up' : 'Provider Delivers' },
            { label: 'Driver',        value: booking.withDriver === 'yes' ? 'With Driver' : 'Self-Drive' },
            { label: 'Status',        value: statusCfg[booking.status].label },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-xs text-foreground/40 uppercase tracking-widest">{row.label}</span>
              <span className="text-sm font-semibold text-foreground">{row.value}</span>
            </div>
          ))}
          <button onClick={onClose} className="w-full h-10 bg-primary text-white text-xs font-bold rounded-xl tracking-widest uppercase hover:bg-primary/90 transition-all mt-2">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────
export default function ProviderBookingsPage() {
  const [bookings, setBookings]       = useState<Booking[]>(initialBookings);
  const [chatBooking, setChatBooking] = useState<Booking | null>(null);
  const [viewDetails, setViewDetails] = useState<Booking | null>(null);

  const updateStatus = (id: number, status: Status) => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
  };

  const counts = {
    pending:   bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
  };

  return (
    <main>
      {/* Header */}
      <div className="bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 relative z-10">
          <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Provider Dashboard</p>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">Booking Requests</h1>
          <p className="text-white/50 text-sm mt-1">Review and manage incoming requests</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Summary pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {[
            { label: `${counts.pending} Pending`,   bg: 'bg-yellow-500/10 border-yellow-500/20', text: 'text-yellow-700', Icon: Clock },
            { label: `${counts.confirmed} Confirmed`, bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-700', dot: 'bg-green-500' },
            { label: `${counts.completed} Completed`, bg: 'bg-gray-500/10 border-gray-500/20',   text: 'text-gray-500',  dot: 'bg-gray-400' },
          ].map((p, i) => (
            <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-widest uppercase ${p.bg} ${p.text}`}>
              {p.Icon ? <p.Icon size={11} /> : <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />}
              {p.label}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {bookings.map((b) => {
            const c   = statusCfg[b.status];
            const dim = b.status === 'completed' || b.status === 'declined' || b.status === 'cancelled';
            return (
              <div key={b.id} className={`border rounded-2xl overflow-hidden transition-all ${c.border} ${c.bg} ${dim ? 'opacity-60' : ''}`}>
                <div className={`h-1 ${c.bar}`} />
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:grid sm:grid-cols-5 gap-4 sm:gap-6 sm:items-start">

                    {/* Renter */}
                    <div>
                      <p className="text-xs text-foreground/40 uppercase tracking-widest mb-2">Renter</p>
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <User size={15} className="text-primary" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{b.renter}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Mail size={10} className="text-foreground/30" />
                            <p className="text-xs text-foreground/40">{b.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle */}
                    <div>
                      <p className="text-xs text-foreground/40 uppercase tracking-widest mb-2">Vehicle</p>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <VehicleIcon name={b.icon} size={16} className="text-primary" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{b.vehicle}</p>
                          <p className="text-xs text-foreground/40 tracking-widest">{b.year}</p>
                        </div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div>
                      <p className="text-xs text-foreground/40 uppercase tracking-widest mb-2">Dates</p>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-foreground/30" strokeWidth={1.5} />
                        <p className="text-sm font-semibold text-foreground">{b.dates}</p>
                      </div>
                      <p className="text-xs text-foreground/40 mt-0.5 pl-5">{b.days}</p>
                    </div>

                    {/* Cost */}
                    <div>
                      <p className="text-xs text-foreground/40 uppercase tracking-widest mb-2">Cost</p>
                      <p className={`text-xl font-bold ${dim ? 'text-foreground' : 'text-primary'}`}>{b.cost}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col gap-2">
                      {b.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(b.id, 'confirmed')}
                            className="flex-1 sm:flex-none h-10 px-4 bg-primary text-white text-xs font-bold rounded-xl tracking-widest uppercase hover:bg-primary/90 active:scale-95 transition-all">
                            Accept
                          </button>
                          <button onClick={() => updateStatus(b.id, 'declined')}
                            className="flex-1 sm:flex-none h-10 px-4 border border-border text-xs font-semibold rounded-xl tracking-widest uppercase text-foreground/60 hover:border-foreground/30 hover:text-foreground active:scale-95 transition-all">
                            Decline
                          </button>
                        </>
                      )}
                      {b.status === 'confirmed' && (
                        <>
                          <button onClick={() => setChatBooking(b)}
                            className="flex-1 sm:flex-none h-10 px-4 bg-primary text-white text-xs font-bold rounded-xl tracking-widest uppercase hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-1.5">
                            <MessageSquare size={13} /> Message
                          </button>
                          <button onClick={() => updateStatus(b.id, 'cancelled')}
                            className="flex-1 sm:flex-none h-10 px-4 border border-border text-xs font-semibold rounded-xl tracking-widest uppercase text-foreground/60 hover:border-foreground/30 hover:text-foreground active:scale-95 transition-all">
                            Cancel
                          </button>
                        </>
                      )}
                      {(b.status === 'completed' || b.status === 'declined' || b.status === 'cancelled') && (
                        <button onClick={() => setViewDetails(b)}
                          className="flex-1 sm:flex-none h-10 px-4 border border-border text-xs font-semibold rounded-xl tracking-widest uppercase text-foreground/60 hover:border-foreground/30 hover:text-foreground active:scale-95 transition-all">
                          View Details
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status badge + booking options */}
                  <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-widest uppercase ${c.badge} ${c.badgeText}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                      {c.label}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-foreground/50 text-xs font-semibold">
                      {b.pickupMethod === 'meetup'
                        ? <><Navigation size={11} /> Meet-up / Pick-up</>
                        : <><MapPin size={11} /> Provider Delivers</>}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-foreground/50 text-xs font-semibold">
                      <User2 size={11} /> {b.withDriver === 'yes' ? 'With Driver' : 'Self-Drive'}
                    </span>
                  </div>

                  {/* Review (completed bookings) */}
                  {b.status === 'completed' && b.review && (
                    <div className="mt-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map((s) => (
                            <Star key={s} size={12} className={s <= b.review!.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200 fill-gray-200'} />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-foreground/60">by {b.renter}</span>
                      </div>
                      <p className="text-xs text-foreground/60 italic">"{b.review.comment}"</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {chatBooking && (
        <ChatModal
          bookingId={chatBooking.id}
          viewerRole="provider"
          otherPartyName={chatBooking.renter}
          context={`${chatBooking.vehicle} · ${chatBooking.dates}`}
          onClose={() => setChatBooking(null)}
        />
      )}
      {viewDetails && <DetailsModal booking={viewDetails} onClose={() => setViewDetails(null)} />}
    </main>
  );
}

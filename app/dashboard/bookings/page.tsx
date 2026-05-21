'use client';

import { useState, useEffect, useRef } from 'react';
import { Car, Van, Calendar, Star, MapPin, Navigation, User2, MessageSquare, X, CheckCircle2, AlertTriangle, LocateFixed, Loader2, Info } from 'lucide-react';
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

// ── View Details Modal ────────────────────────────────────
function DetailsModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <h3 className="font-serif font-bold text-foreground text-lg">Booking Details</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground/50 hover:text-foreground"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-3">
          {[
            { label: 'Vehicle',  value: `${booking.vehicle} (${booking.year})` },
            { label: 'Provider', value: booking.provider },
            { label: 'Dates',    value: booking.dates },
            { label: 'Duration', value: booking.days },
            { label: 'Total',    value: booking.total },
            { label: 'Pickup',   value: booking.pickupMethod === 'meetup' ? 'Meet-up / Pick-up' : 'Provider Delivers' },
            { label: 'Driver',   value: booking.withDriver === 'yes' ? 'With Driver' : 'Self-Drive' },
            { label: 'Status',   value: statusStyle[booking.status].label },
          ].map((r) => (
            <div key={r.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-xs text-foreground/40 uppercase tracking-widest">{r.label}</span>
              <span className="text-sm font-semibold text-foreground">{r.value}</span>
            </div>
          ))}
          <button onClick={onClose} className="w-full h-10 bg-primary text-white text-xs font-bold rounded-xl tracking-widest uppercase hover:bg-primary/90 transition-all mt-2">Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Cancel Confirmation Modal ─────────────────────────────
function CancelModal({ booking, onClose, onConfirm }: { booking: Booking; onClose: () => void; onConfirm: () => void }) {
  const [loading, setLoading] = useState(false);
  const handle = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    onConfirm();
  };
  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-sm bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={26} className="text-primary" />
          </div>
          <h3 className="font-serif font-bold text-foreground text-lg mb-1">Cancel Booking?</h3>
          <p className="text-sm text-foreground/50 mb-1">{booking.vehicle}</p>
          <p className="text-xs text-foreground/40 mb-6">{booking.dates} · {booking.days}</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 h-11 border border-border text-foreground/60 text-xs font-bold rounded-xl tracking-widest uppercase hover:border-foreground/30 transition-all">Keep It</button>
            <button onClick={handle} disabled={loading} className="flex-1 h-11 bg-primary text-white text-xs font-bold rounded-xl tracking-widest uppercase hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Cancelling…</> : 'Yes, Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Leave Review Modal ────────────────────────────────────
function ReviewModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const [rating, setRating]   = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const handle = async () => {
    if (!rating) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <div>
            <h3 className="font-serif font-bold text-foreground text-lg">Leave a Review</h3>
            <p className="text-xs text-foreground/50 mt-0.5">{booking.provider}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground/50 hover:text-foreground"><X size={16} /></button>
        </div>
        <div className="p-5">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={28} className="text-green-600" />
              </div>
              <p className="font-semibold text-foreground mb-1">Review Submitted!</p>
              <p className="text-xs text-foreground/50 mb-5">Thanks for your feedback on {booking.vehicle}.</p>
              <button onClick={onClose} className="w-full h-10 bg-primary text-white text-xs font-bold rounded-xl tracking-widest uppercase hover:bg-primary/90 transition-all">Done</button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="p-3 bg-muted/50 rounded-xl border border-border text-xs text-foreground/60">
                {booking.vehicle} · {booking.dates}
              </div>
              <div className="text-center">
                <p className="text-xs text-foreground/40 uppercase tracking-widest mb-3">Your Rating</p>
                <div className="flex items-center justify-center gap-2">
                  {[1,2,3,4,5].map((s) => (
                    <button key={s} type="button"
                      onMouseEnter={() => setHovered(s)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(s)}
                      className="transition-transform hover:scale-110 active:scale-95">
                      <Star size={32} className={`transition-colors ${s <= (hovered || rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200 fill-gray-200'}`} />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-xs text-foreground/40 mt-2">
                    {['','Poor','Fair','Good','Great','Excellent'][rating]}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">Comment (optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience…"
                  rows={3}
                  className="w-full px-3 py-3 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
              <button onClick={handle} disabled={!rating || loading}
                className="w-full h-11 bg-primary text-white text-xs font-bold rounded-xl tracking-widest uppercase hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting…</> : 'Submit Review'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── GPS Tracking Modal ────────────────────────────────────
function TrackingModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [locating, setLocating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLocating(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (locating || !mapRef.current) return;
    import('leaflet').then((L) => {
      const el = mapRef.current as any;
      if (!el || el._leaflet_id) return;
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      const map = L.map(el, { center: [14.5995, 120.9842], zoom: 14, zoomControl: true });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
      // Mock vehicle location
      const vehicleIcon = L.divIcon({
        className: '',
        html: `<div style="background:#dc2626;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(220,38,38,0.5)"></div>`,
        iconSize: [14, 14], iconAnchor: [7, 7],
      });
      const marker = L.marker([14.5995, 120.9842], { icon: vehicleIcon }).addTo(map);
      marker.bindPopup(`<b>${booking.vehicle}</b><br/><small>Live Location</small>`).openPopup();
    });
  }, [locating, booking.vehicle]);

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ height: 'min(560px, 90dvh)' }}>
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <LocateFixed size={16} className="text-primary" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-foreground text-base">Track Vehicle</h3>
              <p className="text-xs text-foreground/40 mt-0.5">{booking.vehicle} · {booking.dates}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground/50 hover:text-foreground"><X size={16} /></button>
        </div>
        <div className="flex-1 relative">
          {locating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <Loader2 size={28} className="text-primary animate-spin" />
              <p className="text-sm text-foreground/50">Getting vehicle location…</p>
            </div>
          ) : (
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          )}
        </div>
        <div className="shrink-0 px-5 py-3 border-t border-border bg-muted/30 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <p className="text-xs text-foreground/60">Live tracking active · Updates every 30s</p>
        </div>
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const [chatBooking,   setChatBooking]   = useState<Booking | null>(null);
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);
  const [cancelBooking, setCancelBooking] = useState<Booking | null>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [trackBooking,  setTrackBooking]  = useState<Booking | null>(null);
  const [bookingList,   setBookingList]   = useState(bookings);

  const handleCancel = (id: number) => {
    setBookingList((prev) => prev.filter((b) => b.id !== id));
    setCancelBooking(null);
  };

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

        {bookingList.map((b) => {
          const s   = statusStyle[b.status];
          const dim = b.status === 'completed';
          return (
            <div key={b.id} className={`bg-card border border-border rounded-2xl overflow-hidden transition-opacity ${dim ? 'opacity-60 hover:opacity-80' : ''}`}>
              <div className={`h-1 ${s.bar}`} />
              <div className="p-5 sm:p-6">

                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${dim ? 'bg-muted' : 'bg-primary/10'}`}>
                      {b.vehicleIcon === 'car'
                        ? <Car size={22} className={dim ? 'text-foreground/40' : 'text-primary'} strokeWidth={1.5} />
                        : <Van size={22} className={dim ? 'text-foreground/40' : 'text-primary'} strokeWidth={1.5} />}
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
                    {b.pickupMethod === 'meetup' ? <><Navigation size={11} /> Meet-up / Pick-up</> : <><MapPin size={11} /> Provider Delivers</>}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${dim ? 'bg-muted text-foreground/50' : 'bg-primary/10 text-primary'}`}>
                    <User2 size={11} /> {b.withDriver === 'yes' ? 'With Driver' : 'Self-Drive'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {b.status === 'confirmed' && (
                    <>
                      <button onClick={() => setDetailBooking(b)}
                        className="h-10 px-5 bg-primary text-white text-xs font-semibold rounded-xl tracking-widest uppercase hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-2">
                        <Info size={13} /> View Details
                      </button>
                      <button onClick={() => setTrackBooking(b)}
                        className="h-10 px-5 border border-border text-foreground/60 text-xs font-semibold rounded-xl tracking-widest uppercase hover:border-primary/40 hover:text-primary active:scale-95 transition-all flex items-center gap-2">
                        <LocateFixed size={13} /> Track Vehicle
                      </button>
                      <button onClick={() => setChatBooking(b)}
                        className="h-10 px-5 border border-border text-foreground/60 text-xs font-semibold rounded-xl tracking-widest uppercase hover:border-primary/40 hover:text-primary active:scale-95 transition-all flex items-center gap-2">
                        <MessageSquare size={13} /> Message
                      </button>
                      <button onClick={() => setCancelBooking(b)}
                        className="h-10 px-5 border border-border text-foreground/60 text-xs font-semibold rounded-xl tracking-widest uppercase hover:border-red-400/40 hover:text-red-500 active:scale-95 transition-all">
                        Cancel
                      </button>
                    </>
                  )}
                  {b.status === 'completed' && (
                    <>
                      <button onClick={() => setDetailBooking(b)}
                        className="h-10 px-5 bg-primary text-white text-xs font-semibold rounded-xl tracking-widest uppercase hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-2">
                        <Info size={13} /> View Details
                      </button>
                      <button onClick={() => setChatBooking(b)}
                        className="h-10 px-5 border border-border text-foreground/60 text-xs font-semibold rounded-xl tracking-widest uppercase hover:border-primary/40 hover:text-primary active:scale-95 transition-all flex items-center gap-2">
                        <MessageSquare size={13} /> Messages
                      </button>
                      <button onClick={() => setReviewBooking(b)}
                        className="h-10 px-5 border border-border text-foreground/60 text-xs font-semibold rounded-xl tracking-widest uppercase hover:border-yellow-400/40 hover:text-yellow-600 active:scale-95 transition-all flex items-center gap-2">
                        <Star size={13} /> Leave Review
                      </button>
                      <Link href="/dashboard">
                        <button className="h-10 px-5 border border-border text-foreground/60 text-xs font-semibold rounded-xl tracking-widest uppercase hover:border-foreground/30 hover:text-foreground active:scale-95 transition-all">
                          Book Again
                        </button>
                      </Link>
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

      {/* Modals */}
      {chatBooking   && <ChatModal bookingId={chatBooking.id} viewerRole="renter" otherPartyName={chatBooking.provider} context={`${chatBooking.vehicle} · ${chatBooking.dates}`} onClose={() => setChatBooking(null)} />}
      {detailBooking && <DetailsModal booking={detailBooking} onClose={() => setDetailBooking(null)} />}
      {cancelBooking && <CancelModal  booking={cancelBooking} onClose={() => setCancelBooking(null)} onConfirm={() => handleCancel(cancelBooking.id)} />}
      {reviewBooking && <ReviewModal  booking={reviewBooking} onClose={() => setReviewBooking(null)} />}
      {trackBooking  && <TrackingModal booking={trackBooking} onClose={() => setTrackBooking(null)} />}
    </main>
  );
}

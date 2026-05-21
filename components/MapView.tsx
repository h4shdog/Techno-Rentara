'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { VehicleProvider, Vehicle } from '@/lib/mockData';
import {
  MapPin, Star, Car, X, Navigation, Phone, ChevronRight,
  Loader2, ShieldCheck, Mail, Clock, BadgeCheck, Users,
  CalendarDays, CheckCircle2,
} from 'lucide-react';
import VehicleIcon from '@/components/VehicleIcon';

// ── Types ─────────────────────────────────────────────────
interface MapViewProps {
  providers: VehicleProvider[];
  center: { lat: number; lng: number };
}

type View = 'map' | 'profile';

interface BookingState {
  vehicle: Vehicle;
  provider: VehicleProvider;
  startDate: string;
  endDate: string;
}

// ── Helpers ───────────────────────────────────────────────
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getDays(start: string, end: string): number {
  if (!start || !end) return 0;
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function addDays(date: string, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

// ── Booking Modal ─────────────────────────────────────────
function BookingModal({ booking, onClose }: { booking: BookingState; onClose: () => void }) {
  const [startDate, setStartDate] = useState(booking.startDate);
  const [endDate, setEndDate]     = useState(booking.endDate);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  // New options
  const [pickupMethod, setPickupMethod] = useState<'meetup' | 'delivery'>('meetup');
  const [withDriver, setWithDriver]     = useState<'no' | 'yes'>('no');

  const days  = getDays(startDate, endDate);
  const total = days * booking.vehicle.pricePerDay;

  const handleConfirm = async () => {
    if (!startDate || !endDate) { setError('Please select both dates.'); return; }
    if (days < 1) { setError('End date must be after start date.'); return; }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setConfirmed(true);
  };

  const pickupLabel   = pickupMethod === 'meetup' ? 'Meet-up / Pick-up' : 'Provider Delivers';
  const driverLabel   = withDriver === 'yes' ? 'With Driver' : 'Self-Drive';

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {confirmed ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h3 className="font-serif font-bold text-foreground text-xl mb-2 tracking-wide">Booking Confirmed!</h3>
            <p className="text-foreground/50 text-sm">{booking.vehicle.brand} {booking.vehicle.model}</p>
            <p className="text-foreground/50 text-sm mt-1">{startDate} → {endDate} · {days} day{days !== 1 ? 's' : ''}</p>
            <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {pickupLabel}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {driverLabel}
              </span>
            </div>
            <p className="text-2xl font-bold text-primary mt-3 mb-4">₱{total.toLocaleString()}</p>
            <p className="text-xs text-foreground/40 mb-6 leading-relaxed">
              The provider will contact you shortly to confirm the details.
            </p>
            <button onClick={onClose} className="w-full h-11 bg-primary text-white text-xs font-bold rounded-xl tracking-widest uppercase hover:bg-primary/90 transition-all">
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
              <div>
                <h3 className="font-serif font-bold text-foreground text-lg tracking-wide">Book Vehicle</h3>
                <p className="text-xs text-foreground/50 mt-0.5">{booking.provider.name}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Vehicle summary */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <VehicleIcon name={booking.vehicle.icon} size={24} className="text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{booking.vehicle.brand} {booking.vehicle.model}</p>
                  <p className="text-xs text-foreground/40 uppercase tracking-widest mt-0.5">{booking.vehicle.year} · {booking.vehicle.type}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-primary">₱{booking.vehicle.pricePerDay.toLocaleString()}</p>
                  <p className="text-xs text-foreground/40">/ day</p>
                </div>
              </div>

              {/* Date pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/50 uppercase tracking-widest flex items-center gap-1.5">
                    <CalendarDays size={12} /> Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    min={todayStr()}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (endDate && e.target.value >= endDate) setEndDate(addDays(e.target.value, 1));
                    }}
                    className="w-full h-11 px-3 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/50 uppercase tracking-widest flex items-center gap-1.5">
                    <CalendarDays size={12} /> End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate ? addDays(startDate, 1) : todayStr()}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-11 px-3 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Pickup method */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">Pickup Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: 'meetup',   label: 'Meet-up / Pick-up', sub: 'You pick up the vehicle' },
                    { value: 'delivery', label: 'Provider Delivers',  sub: 'Provider brings it to you' },
                  ] as const).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPickupMethod(opt.value)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        pickupMethod === opt.value
                          ? 'border-primary bg-primary/8 ring-1 ring-primary/30'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <p className={`text-xs font-bold tracking-wide ${pickupMethod === opt.value ? 'text-primary' : 'text-foreground'}`}>
                        {opt.label}
                      </p>
                      <p className="text-xs text-foreground/40 mt-0.5 leading-snug">{opt.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Driver option */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">Driver</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: 'no',  label: 'Self-Drive',  sub: 'You drive the vehicle' },
                    { value: 'yes', label: 'With Driver',  sub: 'Provider supplies a driver' },
                  ] as const).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setWithDriver(opt.value)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        withDriver === opt.value
                          ? 'border-primary bg-primary/8 ring-1 ring-primary/30'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <p className={`text-xs font-bold tracking-wide ${withDriver === opt.value ? 'text-primary' : 'text-foreground'}`}>
                        {opt.label}
                      </p>
                      <p className="text-xs text-foreground/40 mt-0.5 leading-snug">{opt.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost breakdown */}
              {days > 0 && (
                <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/60">₱{booking.vehicle.pricePerDay.toLocaleString()} × {days} day{days !== 1 ? 's' : ''}</span>
                    <span className="font-semibold text-foreground">₱{total.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-primary/10" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">Total</span>
                    <span className="text-xl font-bold text-primary">₱{total.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {error && <p className="text-xs text-primary bg-primary/8 border border-primary/20 rounded-xl px-3 py-2">{error}</p>}

              <button
                onClick={handleConfirm}
                disabled={loading || days < 1}
                className="w-full h-12 bg-primary text-white text-sm font-bold rounded-xl tracking-widest uppercase hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Processing…</>
                  : <>Confirm Booking · ₱{days > 0 ? total.toLocaleString() : '—'}</>}
              </button>

              <p className="text-xs text-foreground/30 text-center">
                No payment charged now. Provider will confirm your booking.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main MapView component ────────────────────────────────
export default function MapView({ providers, center }: MapViewProps) {
  const mapRef      = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<import('leaflet').Map | null>(null);
  const userMarker  = useRef<import('leaflet').Marker | null>(null);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating,  setLocating]  = useState(false);
  const [locError,  setLocError]  = useState('');
  const [selected,  setSelected]  = useState<VehicleProvider | null>(null);
  const [view,      setView]      = useState<View>('map');
  const [booking,   setBooking]   = useState<BookingState | null>(null);

  const origin = userLocation ?? center;
  const sorted = [...providers].sort(
    (a, b) =>
      getDistance(origin.lat, origin.lng, a.location.lat, a.location.lng) -
      getDistance(origin.lat, origin.lng, b.location.lat, b.location.lng)
  );

  // ── Init map ────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;
    if (mapInstance.current) return;

    import('leaflet').then((L) => {
      const el = mapRef.current as HTMLElement & { _leaflet_id?: number };
      if (el._leaflet_id) el._leaflet_id = undefined as unknown as number;

      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [center.lat, center.lng],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        tap: false,
        inertia: true,
        inertiaDeceleration: 3000,
      });

      // Fix mobile drag — give all touch events to Leaflet
      const mapContainer = map.getContainer();
      mapContainer.style.touchAction = 'none';
      const onTouchMove = (e: TouchEvent) => { e.preventDefault(); };
      mapContainer.addEventListener('touchmove', onTouchMove, { passive: false });
      (mapRef.current as any)._touchMoveCleanup = () => {
        mapContainer.removeEventListener('touchmove', onTouchMove);
      };

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const redPin = L.divIcon({
        className: '',
        html: `<div style="filter:drop-shadow(0 2px 6px rgba(0,0,0,0.35))">
          <svg width="32" height="42" viewBox="0 0 32 42" fill="none">
            <path d="M16 1C9.1 1 3.5 6.6 3.5 13.5C3.5 23.3 16 41 16 41S28.5 23.3 28.5 13.5C28.5 6.6 22.9 1 16 1Z" fill="#dc2626" stroke="white" stroke-width="1.5"/>
            <circle cx="16" cy="13" r="5" fill="white"/>
          </svg>
        </div>`,
        iconSize: [32, 42],
        iconAnchor: [16, 42],
      });

      providers.forEach((p) => {
        const m = L.marker([p.location.lat, p.location.lng], { icon: redPin }).addTo(map);
        m.bindTooltip(`<b>${p.name}</b><br/><small>${p.location.address}</small>`, {
          direction: 'top', offset: [0, -44], className: 'ltt-rentara',
        });
        m.on('click', () => {
          setSelected(p);
          map.panTo([p.location.lat, p.location.lng], { animate: true, duration: 0.5 });
        });
      });

      mapInstance.current = map;
    });

    return () => {
      (mapRef.current as any)?._touchMoveCleanup?.();
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Geolocation ─────────────────────────────────────────
  const locateMe = useCallback(() => {
    if (!navigator.geolocation) { setLocError('Geolocation not supported.'); return; }
    setLocating(true); setLocError('');
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        setUserLocation({ lat, lng });
        setLocating(false);
        import('leaflet').then((L) => {
          const map = mapInstance.current; if (!map) return;
          userMarker.current?.remove(); userMarker.current = null;
          const youIcon = L.divIcon({
            className: '',
            html: `<div style="position:relative;width:22px;height:22px">
              <div style="position:absolute;inset:0;border-radius:50%;background:rgba(59,130,246,0.25);animation:pulse-you 1.8s ease-out infinite;"></div>
              <div style="position:absolute;inset:3px;border-radius:50%;background:#3b82f6;border:2.5px solid white;box-shadow:0 2px 8px rgba(59,130,246,0.5);"></div>
            </div>`,
            iconSize: [22, 22], iconAnchor: [11, 11],
          });
          const m = L.marker([lat, lng], { icon: youIcon, zIndexOffset: 1000 }).addTo(map);
          m.bindTooltip('📍 You are here', { permanent: true, direction: 'top', offset: [0, -14], className: 'ltt-you' });
          userMarker.current = m;
          map.flyTo([lat, lng], 14, { animate: true, duration: 1.2 });
        });
      },
      () => { setLocating(false); setLocError('Could not get location. Allow access and try again.'); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Pan when selected changes
  useEffect(() => {
    if (!selected || !mapInstance.current) return;
    mapInstance.current.panTo([selected.location.lat, selected.location.lng], { animate: true, duration: 0.5 });
  }, [selected]);

  // ── Profile view ─────────────────────────────────────────
  const ProfileView = ({ provider }: { provider: VehicleProvider }) => {
    const dist = userLocation
      ? getDistance(userLocation.lat, userLocation.lng, provider.location.lat, provider.location.lng)
      : null;

    return (
      <div className="space-y-5">
        <button onClick={() => setView('map')} className="flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground transition-colors">
          <ChevronRight size={15} className="rotate-180" /> Back to map
        </button>

        {/* Profile hero */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="h-28 relative" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d0a0a 50%, #1a1a1a 100%)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #dc2626, transparent)', transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #dc2626, transparent)', transform: 'translate(-20%, 40%)' }} />
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 40px)' }} />
            <div className="absolute top-4 left-5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <p className="text-white/50 text-xs tracking-widest uppercase font-semibold">Vehicle Provider</p>
            </div>
          </div>
          <div className="px-5 pt-5 pb-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-card shrink-0">
                  {provider.avatar}
                </div>
                <div>
                  <h2 className="font-serif font-bold text-foreground text-xl tracking-wide leading-tight">{provider.name}</h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={12} className={s <= Math.round(provider.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200 fill-gray-200'} />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-foreground">{provider.rating}</span>
                    <span className="text-sm text-foreground/40">· {provider.reviews} reviews</span>
                  </div>
                </div>
              </div>
              <span className="flex items-center gap-1 px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-xs font-semibold text-green-700 shrink-0 mt-1">
                <BadgeCheck size={12} className="text-green-600" /> Verified
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Vehicles', value: provider.vehicles.length, Icon: Car },
            { label: 'Reviews',  value: provider.reviews,         Icon: Users },
            { label: 'Rating',   value: provider.rating,          Icon: Star },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
              <s.Icon size={16} className="text-primary mx-auto mb-1" strokeWidth={1.5} />
              <p className="text-lg font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-foreground/40 tracking-widest uppercase">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest">Contact</p>
          {[
            { Icon: Phone,      text: provider.phone },
            { Icon: Mail,       text: provider.email },
            { Icon: MapPin,     text: provider.location.address },
          ].map((row) => (
            <div key={row.text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <row.Icon size={14} className="text-primary" strokeWidth={1.5} />
              </div>
              <span className="text-sm text-foreground">{row.text}</span>
            </div>
          ))}
          {dist !== null && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Navigation size={14} className="text-blue-500" strokeWidth={1.5} />
              </div>
              <span className="text-sm text-blue-600 font-semibold">{dist.toFixed(1)} km from your location</span>
            </div>
          )}
        </div>

        {/* Trust & Safety */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-3">Trust & Safety</p>
          <div className="space-y-2.5">
            {[
              { Icon: ShieldCheck, label: 'Identity Verified',  sub: 'Government ID confirmed' },
              { Icon: BadgeCheck,  label: 'Insured Provider',   sub: 'All vehicles are insured' },
              { Icon: Clock,       label: 'Active Since 2022',  sub: 'Established rental provider' },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <b.Icon size={14} className="text-green-600" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{b.label}</p>
                  <p className="text-xs text-foreground/40">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicles */}
        <div>
          <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-3">
            Available Vehicles ({provider.vehicles.length})
          </p>
          <div className="space-y-3">
            {provider.vehicles.map((v) => (
              <div key={v.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-colors">
                <div className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <VehicleIcon name={v.icon} size={24} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{v.brand} {v.model}</p>
                    <p className="text-xs text-foreground/40 uppercase tracking-widest mt-0.5">{v.year} · {v.type}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-primary">₱{v.pricePerDay.toLocaleString()}</p>
                    <p className="text-xs text-foreground/40">/ day</p>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <button
                    onClick={() => setBooking({ vehicle: v, provider, startDate: todayStr(), endDate: addDays(todayStr(), 1) })}
                    className="w-full h-9 bg-primary text-white text-xs font-bold rounded-xl tracking-widest uppercase hover:bg-primary/90 active:scale-[0.98] transition-all"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <style>{`
        @keyframes pulse-you { 0% { transform:scale(0.8); opacity:0.8; } 100% { transform:scale(2.6); opacity:0; } }
        .ltt-rentara { background:#1a1a1a !important; color:white !important; border:none !important; border-radius:8px !important; font-size:12px !important; font-weight:600 !important; padding:5px 10px !important; line-height:1.5 !important; box-shadow:0 2px 10px rgba(0,0,0,0.25) !important; pointer-events:none !important; }
        .ltt-rentara.leaflet-tooltip-top::before { border-top-color:#1a1a1a !important; }
        .ltt-you { background:#1d4ed8 !important; color:white !important; border:none !important; border-radius:8px !important; font-size:11px !important; font-weight:700 !important; padding:4px 9px !important; white-space:nowrap !important; box-shadow:0 2px 8px rgba(29,78,216,0.4) !important; pointer-events:none !important; }
        .ltt-you.leaflet-tooltip-top::before { border-top-color:#1d4ed8 !important; }
        .leaflet-container { cursor:grab !important; }
        .leaflet-container:active { cursor:grabbing !important; }
        .leaflet-control-attribution { font-size:10px !important; }
      `}</style>

      {/* Map — always mounted */}
      <div className={view === 'profile' ? 'hidden' : 'space-y-4'}>
        <div className="relative rounded-2xl border border-border shadow-sm" style={{ overflow: 'hidden' }}>
          <div ref={mapRef} style={{ height: '460px', width: '100%', borderRadius: '1rem' }} />

          {/* Locate me button */}
          <button
            onClick={locateMe}
            disabled={locating}
            className="absolute top-3 right-3 z-[999] flex items-center gap-1.5 bg-white border border-border shadow-md rounded-xl px-3 py-2 text-xs font-semibold hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-60"
          >
            {locating ? <Loader2 size={13} className="animate-spin text-primary" /> : <Navigation size={13} className="text-primary" />}
            {locating ? 'Locating…' : 'My Location'}
          </button>

          {locError && (
            <div className="absolute top-14 right-3 z-[999] bg-white border border-primary/20 rounded-xl px-3 py-2 text-xs text-primary shadow-md max-w-[200px] leading-relaxed">
              {locError}
            </div>
          )}

          {/* Provider popup */}
          {selected && (
            <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-[280px] z-[999] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {selected.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900 leading-tight">{selected.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={11} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs text-gray-500">{selected.rating} ({selected.reviews})</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-gray-500 transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin size={11} className="text-gray-300 shrink-0" />
                <p className="text-xs text-gray-400">{selected.location.address}</p>
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <Car size={11} className="text-gray-300 shrink-0" />
                <p className="text-xs text-gray-400">{selected.vehicles.length} vehicle{selected.vehicles.length !== 1 ? 's' : ''} available</p>
              </div>
              {userLocation && (
                <div className="flex items-center gap-1.5 mb-3">
                  <Navigation size={11} className="text-blue-400 shrink-0" />
                  <p className="text-xs text-blue-500 font-semibold">
                    {getDistance(userLocation.lat, userLocation.lng, selected.location.lat, selected.location.lng).toFixed(1)} km away
                  </p>
                </div>
              )}
              <button
                onClick={() => setView('profile')}
                className="w-full h-9 bg-primary text-white text-xs font-bold rounded-xl tracking-widest uppercase hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
              >
                View Provider <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Provider list */}
        <div>
          <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-3">
            {userLocation ? 'Nearest Providers' : 'Available Providers'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sorted.map((p) => {
              const dist = userLocation
                ? getDistance(userLocation.lat, userLocation.lng, p.location.lat, p.location.lng)
                : null;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelected(p);
                    mapInstance.current?.panTo([p.location.lat, p.location.lng], { animate: true, duration: 0.5 });
                    mapInstance.current?.setZoom(15);
                  }}
                  className={`text-left p-4 rounded-2xl border transition-all active:scale-[0.98] ${
                    selected?.id === p.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {p.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{p.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={11} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-foreground/60">{p.rating} ({p.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin size={11} className="text-foreground/30 shrink-0" />
                        <p className="text-xs text-foreground/50 truncate">{p.location.address}</p>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1">
                          <Car size={11} className="text-foreground/30 shrink-0" />
                          <p className="text-xs text-foreground/50">{p.vehicles.length} vehicles</p>
                        </div>
                        {dist !== null && <span className="text-xs text-blue-500 font-semibold">{dist.toFixed(1)} km</span>}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Profile view */}
      {view === 'profile' && selected && <ProfileView provider={selected} />}

      {/* Booking modal */}
      {booking && <BookingModal booking={booking} onClose={() => setBooking(null)} />}
    </div>
  );
}

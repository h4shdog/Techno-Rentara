'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { VEHICLE_PROVIDERS, VEHICLES, type Vehicle } from '@/lib/mockData';
import { useRouter } from 'next/navigation';
import VehicleIcon from '@/components/VehicleIcon';
import { Car, ClipboardList, Star, Banknote, User, Mail, X, Check, Pencil, Save } from 'lucide-react';

// ── Edit Vehicle Modal ────────────────────────────────────
function EditVehicleModal({ vehicle, onClose, onSave }: {
  vehicle: Vehicle;
  onClose: () => void;
  onSave: (updated: Vehicle) => void;
}) {
  const [brand, setBrand]   = useState(vehicle.brand);
  const [model, setModel]   = useState(vehicle.model);
  const [year, setYear]     = useState(String(vehicle.year));
  const [price, setPrice]   = useState(String(vehicle.pricePerDay));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onSave({ ...vehicle, brand, model, year: Number(year), pricePerDay: Number(price) });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <h3 className="font-serif font-bold text-foreground text-lg">Edit Vehicle</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground/50 hover:text-foreground">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: 'Brand', value: brand, set: setBrand },
            { label: 'Model', value: model, set: setModel },
            { label: 'Year',  value: year,  set: setYear,  type: 'number' },
            { label: 'Daily Rate (₱)', value: price, set: setPrice, type: 'number' },
          ].map((f) => (
            <div key={f.label} className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">{f.label}</label>
              <input
                type={f.type ?? 'text'}
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                className="w-full h-11 px-3 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          ))}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full h-11 bg-primary text-white text-xs font-bold rounded-xl tracking-widest uppercase hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</> : <><Save size={14} />Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add Vehicle Modal ─────────────────────────────────────
function AddVehicleModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (v: Vehicle) => void;
}) {
  const [brand, setBrand]   = useState('');
  const [model, setModel]   = useState('');
  const [year, setYear]     = useState(String(new Date().getFullYear()));
  const [price, setPrice]   = useState('');
  const [type, setType]     = useState<Vehicle['type']>('car');
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!brand || !model || !price) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onAdd({
      id: `custom-${Date.now()}`,
      type,
      brand,
      model,
      year: Number(year),
      pricePerDay: Number(price),
      image: type,
      icon: type,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <h3 className="font-serif font-bold text-foreground text-lg">Add Vehicle</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground/50 hover:text-foreground">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">Vehicle Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['car','van','truck','jeepney','tricycle'] as Vehicle['type'][]).map((t) => (
                <button key={t} type="button" onClick={() => setType(t)}
                  className={`h-9 rounded-xl text-xs font-semibold capitalize border transition-all ${type === t ? 'bg-primary text-white border-primary' : 'border-border text-foreground/60 hover:border-primary/40'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          {[
            { label: 'Brand', value: brand, set: setBrand },
            { label: 'Model', value: model, set: setModel },
            { label: 'Year',  value: year,  set: setYear,  type: 'number' },
            { label: 'Daily Rate (₱)', value: price, set: setPrice, type: 'number' },
          ].map((f) => (
            <div key={f.label} className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">{f.label}</label>
              <input
                type={f.type ?? 'text'}
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                placeholder={f.label}
                className="w-full h-11 px-3 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          ))}
          <button
            onClick={handleAdd}
            disabled={saving || !brand || !model || !price}
            className="w-full h-11 bg-primary text-white text-xs font-bold rounded-xl tracking-widest uppercase hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Adding…</> : '+ Add Vehicle'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Requests Modal ────────────────────────────────────────
function RequestsModal({ vehicle, onClose }: { vehicle: Vehicle; onClose: () => void }) {
  const [statuses, setStatuses] = useState<Record<number, 'pending' | 'accepted' | 'declined'>>({ 0: 'pending', 1: 'pending' });

  const requests = [
    { name: 'John Renter', email: 'john@email.com', dates: 'May 25–28', days: 3 },
    { name: 'Ana Santos',  email: 'ana@email.com',  dates: 'Jun 1–3',   days: 2 },
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <div>
            <h3 className="font-serif font-bold text-foreground text-lg">Booking Requests</h3>
            <p className="text-xs text-foreground/50 mt-0.5">{vehicle.brand} {vehicle.model}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground/50 hover:text-foreground">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          {requests.map((r, i) => {
            const s = statuses[i];
            return (
              <div key={i} className={`border rounded-2xl p-4 transition-all ${s === 'accepted' ? 'border-green-500/30 bg-green-500/5' : s === 'declined' ? 'border-border opacity-50' : 'border-border'}`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User size={15} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{r.name}</p>
                      <p className="text-xs text-foreground/40">{r.email}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-foreground">{r.dates}</p>
                    <p className="text-xs text-foreground/40">{r.days} days · ₱{(r.days * vehicle.pricePerDay).toLocaleString()}</p>
                  </div>
                </div>
                {s === 'pending' ? (
                  <div className="flex gap-2">
                    <button onClick={() => setStatuses((p) => ({ ...p, [i]: 'accepted' }))}
                      className="flex-1 h-9 bg-primary text-white text-xs font-bold rounded-xl tracking-widest uppercase hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-1.5">
                      <Check size={13} /> Accept
                    </button>
                    <button onClick={() => setStatuses((p) => ({ ...p, [i]: 'declined' }))}
                      className="flex-1 h-9 border border-border text-xs font-semibold rounded-xl tracking-widest uppercase text-foreground/60 hover:border-foreground/30 active:scale-95 transition-all">
                      Decline
                    </button>
                  </div>
                ) : (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase ${s === 'accepted' ? 'bg-green-500/15 text-green-700' : 'bg-gray-500/10 text-gray-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s === 'accepted' ? 'bg-green-500' : 'bg-gray-400'}`} />
                    {s === 'accepted' ? 'Accepted' : 'Declined'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────
export default function ProviderDashboard() {
  const { user } = useAuth();
  const router   = useRouter();

  const [vehicles, setVehicles]         = useState([...VEHICLES]);
  const [editingVehicle, setEditing]    = useState<Vehicle | null>(null);
  const [showAdd, setShowAdd]           = useState(false);
  const [requestsVehicle, setRequests]  = useState<Vehicle | null>(null);
  const [bookingStatuses, setBookingStatuses] = useState<Record<number, 'pending' | 'accepted' | 'declined'>>({ 0: 'pending', 1: 'pending', 2: 'pending' });

  useEffect(() => {
    if (user?.role === 'renter') router.replace('/dashboard');
  }, [user, router]);

  if (!user || user.role === 'renter') {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" /></div>;
  }

  const totalVehicles = vehicles.length;
  const stats = [
    { label: 'Vehicles',      value: totalVehicles, Icon: Car,         accent: 'text-blue-500',   bg: 'bg-blue-500/10' },
    { label: 'Active Rentals',value: 12,            Icon: ClipboardList,accent: 'text-primary',   bg: 'bg-primary/10' },
    { label: 'Avg Rating',    value: '4.8',         Icon: Star,         accent: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Earnings',      value: '₱45.2K',      Icon: Banknote,     accent: 'text-green-500',  bg: 'bg-green-500/10' },
  ];

  const tableBookings = [
    { name: 'John Renter', email: 'john@email.com', vehicle: 'Toyota Corolla', dates: 'May 20–25', days: '5 days' },
    { name: 'Ana Santos',  email: 'ana@email.com',  vehicle: 'Honda Civic',    dates: 'May 22–26', days: '4 days' },
    { name: 'Carlo Reyes', email: 'carlo@email.com',vehicle: 'Ford Transit',   dates: 'May 28–30', days: '2 days' },
  ];

  return (
    <main>
      {/* Hero */}
      <div className="bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
          <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Provider Dashboard</p>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-wide">
            Hello, <span className="text-primary">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-white/50 text-sm mt-1">Manage your fleet and bookings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-foreground/40 uppercase tracking-widest">{s.label}</p>
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.Icon size={15} className={s.accent} strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Vehicles */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest">Your Vehicles</p>
            <button
              onClick={() => setShowAdd(true)}
              className="h-8 px-4 bg-primary text-white text-xs font-semibold rounded-lg tracking-widest uppercase hover:bg-primary/90 active:scale-95 transition-all"
            >
              + Add
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-colors">
                <div className="p-5 flex items-center justify-between border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <VehicleIcon name={vehicle.icon} size={20} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{vehicle.brand} {vehicle.model}</p>
                      <p className="text-xs text-foreground/40 tracking-widest mt-0.5">{vehicle.year}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-700 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
                  </span>
                </div>
                <div className="px-5 py-3 bg-primary/5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-foreground/40 uppercase tracking-widest">Daily Rate</p>
                    <p className="text-lg font-bold text-primary">₱{vehicle.pricePerDay.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(vehicle)}
                      className="h-8 px-3 border border-border text-xs font-semibold rounded-lg text-foreground/60 hover:border-foreground/30 hover:text-foreground transition-all flex items-center gap-1"
                    >
                      <Pencil size={11} /> Edit
                    </button>
                    <button
                      onClick={() => setRequests(vehicle)}
                      className="h-8 px-3 border border-primary/30 text-xs font-semibold rounded-lg text-primary hover:bg-primary/10 transition-all"
                    >
                      Requests
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent bookings table */}
        <div>
          <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-4">Recent Booking Requests</p>

          {/* Desktop */}
          <div className="hidden sm:block bg-card border border-border rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {['Renter', 'Vehicle', 'Dates', 'Status', 'Action'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-foreground/40 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableBookings.map((b, i) => {
                  const s = bookingStatuses[i];
                  return (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <User size={13} className="text-primary" strokeWidth={1.5} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{b.name}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Mail size={10} className="text-foreground/30" />
                              <p className="text-xs text-foreground/40">{b.email}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Car size={14} className="text-foreground/30" strokeWidth={1.5} />
                          <p className="text-sm text-foreground">{b.vehicle}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-foreground">{b.dates}</p>
                        <p className="text-xs text-foreground/40 mt-0.5">{b.days}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-widest uppercase ${
                          s === 'accepted' ? 'bg-green-500/10 text-green-700' :
                          s === 'declined' ? 'bg-gray-500/10 text-gray-500' :
                          'bg-yellow-500/10 text-yellow-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s === 'accepted' ? 'bg-green-500' : s === 'declined' ? 'bg-gray-400' : 'bg-yellow-500'}`} />
                          {s === 'accepted' ? 'Accepted' : s === 'declined' ? 'Declined' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {s === 'pending' ? (
                          <div className="flex gap-2">
                            <button onClick={() => setBookingStatuses((p) => ({ ...p, [i]: 'accepted' }))}
                              className="h-8 px-3 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 active:scale-95 transition-all">Accept</button>
                            <button onClick={() => setBookingStatuses((p) => ({ ...p, [i]: 'declined' }))}
                              className="h-8 px-3 border border-border text-xs font-semibold rounded-lg text-foreground/60 hover:border-foreground/30 transition-all">Decline</button>
                          </div>
                        ) : (
                          <button onClick={() => setBookingStatuses((p) => ({ ...p, [i]: 'pending' }))}
                            className="h-8 px-3 border border-border text-xs font-semibold rounded-lg text-foreground/40 hover:border-foreground/20 transition-all">Undo</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="sm:hidden space-y-3">
            {tableBookings.map((b, i) => {
              const s = bookingStatuses[i];
              return (
                <div key={i} className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User size={14} className="text-primary" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{b.name}</p>
                        <p className="text-xs text-foreground/40">{b.email}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${s === 'accepted' ? 'bg-green-500/10 text-green-700' : s === 'declined' ? 'bg-gray-500/10 text-gray-500' : 'bg-yellow-500/10 text-yellow-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s === 'accepted' ? 'bg-green-500' : s === 'declined' ? 'bg-gray-400' : 'bg-yellow-500'}`} />
                      {s === 'accepted' ? 'Accepted' : s === 'declined' ? 'Declined' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/60 mb-3">
                    <Car size={13} strokeWidth={1.5} />
                    <span>{b.vehicle} · {b.dates}</span>
                  </div>
                  {s === 'pending' ? (
                    <div className="flex gap-2">
                      <button onClick={() => setBookingStatuses((p) => ({ ...p, [i]: 'accepted' }))}
                        className="flex-1 h-9 bg-primary text-white text-xs font-semibold rounded-xl tracking-widest uppercase hover:bg-primary/90 active:scale-95 transition-all">Accept</button>
                      <button onClick={() => setBookingStatuses((p) => ({ ...p, [i]: 'declined' }))}
                        className="flex-1 h-9 border border-border text-xs font-semibold rounded-xl tracking-widest uppercase text-foreground/60 hover:border-foreground/30 transition-all">Decline</button>
                    </div>
                  ) : (
                    <button onClick={() => setBookingStatuses((p) => ({ ...p, [i]: 'pending' }))}
                      className="w-full h-9 border border-border text-xs font-semibold rounded-xl text-foreground/40 hover:border-foreground/20 transition-all">Undo</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      {editingVehicle && (
        <EditVehicleModal
          vehicle={editingVehicle}
          onClose={() => setEditing(null)}
          onSave={(updated) => setVehicles((v) => v.map((x) => x.id === updated.id ? updated : x))}
        />
      )}
      {showAdd && (
        <AddVehicleModal
          onClose={() => setShowAdd(false)}
          onAdd={(v) => setVehicles((prev) => [...prev, v])}
        />
      )}
      {requestsVehicle && (
        <RequestsModal vehicle={requestsVehicle} onClose={() => setRequests(null)} />
      )}
    </main>
  );
}

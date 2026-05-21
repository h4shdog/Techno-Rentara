'use client';

import { useEffect, useRef, useState } from 'react';
import { LocateFixed, Car, Navigation, X, RefreshCw } from 'lucide-react';

interface TrackedVehicle {
  id: string;
  name: string;
  renter: string;
  lat: number;
  lng: number;
  speed: string;
  status: 'moving' | 'parked' | 'idle';
  lastUpdate: string;
}

const MOCK_VEHICLES: TrackedVehicle[] = [
  { id: 'v1', name: 'Toyota Corolla',  renter: 'Jane Doe',    lat: 14.5995, lng: 120.9842, speed: '42 km/h', status: 'moving', lastUpdate: 'Just now'    },
  { id: 'v2', name: 'Ford Transit',    renter: 'John Renter', lat: 14.6090, lng: 120.9780, speed: '0 km/h',  status: 'parked', lastUpdate: '2 mins ago'  },
  { id: 'v3', name: 'Isuzu Truck',     renter: 'Ana Santos',  lat: 14.5880, lng: 120.9950, speed: '18 km/h', status: 'moving', lastUpdate: 'Just now'    },
];

const statusCfg = {
  moving: { label: 'Moving',  dot: 'bg-green-500',  text: 'text-green-700',  bg: 'bg-green-500/10'  },
  parked: { label: 'Parked',  dot: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-500/10' },
  idle:   { label: 'Idle',    dot: 'bg-gray-400',   text: 'text-gray-500',   bg: 'bg-gray-500/10'   },
};

export default function TrackingPage() {
  const mapRef      = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef  = useRef<any[]>([]);

  const [selected,  setSelected]  = useState<TrackedVehicle | null>(null);
  const [refreshed, setRefreshed] = useState(false);

  const handleRefresh = () => {
    setRefreshed(true);
    setTimeout(() => setRefreshed(false), 1000);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || mapInstance.current) return;

    import('leaflet').then((L) => {
      const el = mapRef.current as any;
      if (!el || el._leaflet_id) return;

      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(el, { center: [14.5995, 120.9842], zoom: 13 });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

      MOCK_VEHICLES.forEach((v) => {
        const color = v.status === 'moving' ? '#16a34a' : v.status === 'parked' ? '#ca8a04' : '#9ca3af';
        const icon = L.divIcon({
          className: '',
          html: `<div style="position:relative">
            <div style="background:${color};width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>
            ${v.status === 'moving' ? `<div style="position:absolute;inset:-4px;border-radius:50%;border:2px solid ${color};opacity:0.4;animation:ping 1.5s ease-out infinite"></div>` : ''}
          </div>`,
          iconSize: [16, 16], iconAnchor: [8, 8],
        });
        const marker = L.marker([v.lat, v.lng], { icon }).addTo(map);
        marker.bindTooltip(`<b>${v.name}</b><br/><small>${v.renter}</small>`, { direction: 'top', offset: [0, -12] });
        marker.on('click', () => setSelected(v));
        markersRef.current.push(marker);
      });

      mapInstance.current = map;
    });

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <main>
      {/* Header */}
      <div className="bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 relative z-10 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Provider Dashboard</p>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">GPS Tracking</h1>
            <p className="text-white/50 text-sm mt-1">Monitor your fleet in real time</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 h-9 px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl tracking-widest uppercase transition-all"
          >
            <RefreshCw size={13} className={refreshed ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Summary pills */}
        <div className="flex gap-2 flex-wrap">
          {[
            { label: `${MOCK_VEHICLES.filter(v => v.status === 'moving').length} Moving`, ...statusCfg.moving },
            { label: `${MOCK_VEHICLES.filter(v => v.status === 'parked').length} Parked`,  ...statusCfg.parked },
            { label: `${MOCK_VEHICLES.length} Total Vehicles`, dot: 'bg-primary', text: 'text-primary', bg: 'bg-primary/10' },
          ].map((p, i) => (
            <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-transparent text-xs font-semibold tracking-widest uppercase ${p.bg} ${p.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
              {p.label}
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="relative rounded-2xl border border-border shadow-sm overflow-hidden">
          <style>{`@keyframes ping { 0% { transform:scale(1); opacity:0.6; } 100% { transform:scale(2.5); opacity:0; } }`}</style>
          <div ref={mapRef} style={{ height: '420px', width: '100%' }} />

          {/* Selected vehicle popup */}
          {selected && (
            <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-72 z-[999] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Car size={16} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{selected.name}</p>
                    <p className="text-xs text-gray-500">{selected.renter}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-gray-500 transition-colors">
                  <X size={15} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 rounded-xl p-2.5">
                  <p className="text-gray-400 uppercase tracking-widest mb-0.5">Speed</p>
                  <p className="font-bold text-gray-800">{selected.speed}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5">
                  <p className="text-gray-400 uppercase tracking-widest mb-0.5">Updated</p>
                  <p className="font-bold text-gray-800">{selected.lastUpdate}</p>
                </div>
              </div>
              <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg[selected.status].bg} ${statusCfg[selected.status].text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg[selected.status].dot}`} />
                {statusCfg[selected.status].label}
              </div>
            </div>
          )}
        </div>

        {/* Vehicle list */}
        <div>
          <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-3">Active Vehicles</p>
          <div className="space-y-3">
            {MOCK_VEHICLES.map((v) => {
              const sc = statusCfg[v.status];
              return (
                <div
                  key={v.id}
                  onClick={() => {
                    setSelected(v);
                    mapInstance.current?.panTo([v.lat, v.lng], { animate: true, duration: 0.5 });
                    mapInstance.current?.setZoom(15);
                  }}
                  className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-primary/40 transition-colors active:scale-[0.99]"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Car size={18} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">{v.name}</p>
                    <p className="text-xs text-foreground/40 mt-0.5">Rented by {v.renter}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {sc.label}
                    </span>
                    <p className="text-xs text-foreground/30 mt-1">{v.speed} · {v.lastUpdate}</p>
                  </div>
                  <Navigation size={14} className="text-foreground/20 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

'use client';

import Image from 'next/image';
import { useAuth } from '@/lib/authContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navLinks = user?.role === 'renter'
    ? [
        { href: '/dashboard', label: 'Find Rentals' },
        { href: '/dashboard/bookings', label: 'My Bookings' },
      ]
    : [
        { href: '/dashboard/provider', label: 'My Fleet' },
        { href: '/dashboard/provider/bookings', label: 'Bookings' },
      ];

  return (
    <>
      <header className="bg-secondary sticky top-0 z-[1001] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link
            href={user?.role === 'provider' ? '/dashboard/provider' : '/dashboard'}
            className="flex items-center gap-2.5 shrink-0"
          >
            <Image src="/logo-r.png" alt="RenTara" width={32} height={32} className="h-8 w-auto" />
            <span className="text-white font-serif font-bold text-lg tracking-widest hidden sm:inline">RenTara</span>
          </Link>

          {/* Desktop nav */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium tracking-widest uppercase transition-all ${
                    pathname === link.href
                      ? 'bg-primary text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold tracking-wide shrink-0">
                  {user.avatar}
                </div>
                <div className="hidden sm:block">
                  <p className="text-white text-xs font-semibold leading-none tracking-wide">{user.name}</p>
                  <p className="text-white/40 text-xs capitalize tracking-widest mt-0.5">{user.role}</p>
                </div>
              </div>
            )}

            {/* Desktop logout */}
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 text-white/40 hover:text-white text-xs tracking-widest uppercase transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white/60 hover:text-white p-1 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-secondary border-t border-white/10 px-4 py-3 space-y-1 relative z-[1001]">
            {user && navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center h-11 px-4 rounded-xl text-sm font-medium tracking-wide transition-all ${
                  pathname === link.href
                    ? 'bg-primary text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full h-11 px-4 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        )}
      </header>
    </>
  );
}

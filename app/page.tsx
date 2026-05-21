'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  AlertCircle, Eye, EyeOff, Car, User, Phone, Mail, Lock,
  ArrowRight, Upload, FileText, X, ShieldCheck,
} from 'lucide-react';

type Mode = 'login' | 'signup';

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login');

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const [signupName,     setSignupName]     = useState('');
  const [signupEmail,    setSignupEmail]    = useState('');
  const [signupPhone,    setSignupPhone]    = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole,     setSignupRole]     = useState<'renter' | 'provider'>('renter');
  const [permitFile,     setPermitFile]     = useState<File | null>(null);
  const permitInputRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState('');
  const [isLoading,    setIsLoading]    = useState(false);
  const { login } = useAuth();
  const router    = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally { setIsLoading(false); }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!signupPhone.match(/^(\+63|0)[0-9]{10}$/)) {
      setError('Enter a valid Philippine mobile number (e.g. 09XX XXX XXXX)');
      return;
    }
    if (signupRole === 'provider' && !permitFile) {
      setError('Please upload your Business Permit to register as a provider.');
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setEmail(signupEmail);
    setMode('login');
  };

  const fillRenter   = () => { setEmail('renter@rentara.com');   setPassword('password123'); };
  const fillProvider = () => { setEmail('provider@rentara.com'); setPassword('password123'); };
  const switchMode   = (m: Mode) => { setError(''); setMode(m); };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[400px]">

        {/* ── Logo ── */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/Rentara,immg.jpg"
            alt="RenTara"
            width={360}
            height={120}
            className="h-24 w-auto object-contain mb-0 mt-4"
            priority
          />
          <p className="text-foreground/40 text-xs tracking-[0.18em] uppercase -mt-3">
            Rent na! Ano, <span className="text-primary font-semibold">Tara?</span>
          </p>
        </div>

        {/* ── Card ── */}
        <div className="bg-card border border-border/60 rounded-2xl shadow-sm">

          {/* Tab switcher */}
          <div className="grid grid-cols-2 p-1.5 gap-1.5 border-b border-border/60">
            {(['login', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all ${
                  mode === m
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-foreground/40 hover:text-foreground/70 hover:bg-muted/60'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* ── LOGIN ── */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">

                {/* Welcome text */}
                <div className="mb-5">
                  <h2 className="text-lg font-serif font-bold text-foreground tracking-wide">Welcome back</h2>
                  <p className="text-xs text-foreground/40 mt-0.5 tracking-wide">Sign in to continue to your account</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 pl-10 border-border/70 bg-background rounded-xl text-sm focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 pl-10 pr-11 border-border/70 bg-background rounded-xl text-sm focus:border-primary transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2.5 p-3 bg-primary/8 border border-primary/20 rounded-xl">
                    <AlertCircle size={13} className="text-primary shrink-0" />
                    <p className="text-xs text-primary">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-primary text-white text-xs font-bold rounded-xl tracking-widest uppercase hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</>
                    : <><span>Sign In</span><ArrowRight size={13} /></>}
                </button>


              </form>
            )}

            {/* ── SIGN UP ── */}
            {mode === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4">

                <div className="mb-5">
                  <h2 className="text-lg font-serif font-bold text-foreground tracking-wide">Create account</h2>
                  <p className="text-xs text-foreground/40 mt-0.5 tracking-wide">Join RenTara and start renting today</p>
                </div>

                {/* Role selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">I want to</label>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { role: 'renter'   as const, label: 'Rent a Vehicle', sub: 'Find & book', Icon: User },
                      { role: 'provider' as const, label: 'List My Fleet',  sub: 'Earn money',  Icon: Car  },
                    ]).map(({ role, label, sub, Icon }) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSignupRole(role)}
                        className={`flex flex-col items-start gap-1 p-3 rounded-xl border transition-all ${
                          signupRole === role
                            ? 'border-primary bg-primary/8 shadow-sm'
                            : 'border-border/60 hover:border-border'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-0.5 ${signupRole === role ? 'bg-primary/15' : 'bg-muted'}`}>
                          <Icon size={14} className={signupRole === role ? 'text-primary' : 'text-foreground/40'} strokeWidth={1.5} />
                        </div>
                        <p className={`text-xs font-bold leading-none ${signupRole === role ? 'text-primary' : 'text-foreground'}`}>{label}</p>
                        <p className="text-xs text-foreground/35">{sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Full name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">Full Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                    <Input
                      type="text"
                      placeholder="Juan dela Cruz"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="h-11 pl-10 border-border/70 bg-background rounded-xl text-sm focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="h-11 pl-10 border-border/70 bg-background rounded-xl text-sm focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">Mobile Number</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                      <Phone size={14} className="text-foreground/30" />
                      <span className="text-xs text-foreground/40 font-semibold">+63</span>
                      <span className="w-px h-3.5 bg-border/80" />
                    </div>
                    <Input
                      type="tel"
                      placeholder="9XX XXX XXXX"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value.replace(/[^\d\s]/g, ''))}
                      className="h-11 pl-[4.5rem] border-border/70 bg-background rounded-xl text-sm focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <p className="text-xs text-foreground/30 pl-1">e.g. 09XX XXX XXXX</p>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="h-11 pl-10 pr-11 border-border/70 bg-background rounded-xl text-sm focus:border-primary transition-colors"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Business permit — providers only */}
                {signupRole === 'provider' && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground/50 uppercase tracking-widest flex items-center gap-1.5">
                      Business Permit <span className="text-primary font-bold">*</span>
                    </label>
                    <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/15 rounded-xl">
                      <ShieldCheck size={13} className="text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-foreground/55 leading-relaxed">
                        Upload your DTI/SEC registration or Mayor's Permit for verification.
                      </p>
                    </div>
                    <input
                      ref={permitInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        if (file && file.size > 5 * 1024 * 1024) { setError('File must be under 5MB.'); return; }
                        setPermitFile(file); setError('');
                      }}
                    />
                    {permitFile ? (
                      <div className="flex items-center gap-3 p-3 bg-green-500/8 border border-green-500/20 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center shrink-0">
                          <FileText size={14} className="text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{permitFile.name}</p>
                          <p className="text-xs text-foreground/40 mt-0.5">{(permitFile.size / 1024).toFixed(0)} KB · Ready</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setPermitFile(null); if (permitInputRef.current) permitInputRef.current.value = ''; }}
                          className="text-foreground/30 hover:text-foreground/60 transition-colors shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => permitInputRef.current?.click()}
                        className="w-full flex items-center gap-3 p-4 border border-dashed border-border rounded-xl hover:border-primary/40 hover:bg-muted/30 active:scale-[0.98] transition-all"
                      >
                        <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                          <Upload size={16} className="text-foreground/40" strokeWidth={1.5} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-semibold text-foreground">Upload business permit</p>
                          <p className="text-xs text-foreground/35 mt-0.5">JPG, PNG or PDF · Max 5MB</p>
                        </div>
                      </button>
                    )}
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2.5 p-3 bg-primary/8 border border-primary/20 rounded-xl">
                    <AlertCircle size={13} className="text-primary shrink-0" />
                    <p className="text-xs text-primary">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-primary text-white text-xs font-bold rounded-xl tracking-widest uppercase hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account…</>
                    : <><span>Create Account</span><ArrowRight size={13} /></>}
                </button>

                <p className="text-xs text-foreground/30 text-center leading-relaxed">
                  By signing up you agree to our{' '}
                  <span className="text-foreground/50 underline underline-offset-2 cursor-pointer">Terms</span>
                  {' '}and{' '}
                  <span className="text-foreground/50 underline underline-offset-2 cursor-pointer">Privacy Policy</span>.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-foreground/25 mt-5 tracking-widest uppercase">
          © 2024 RenTara · All vehicles insured &amp; verified
        </p>
      </div>
    </main>
  );
}

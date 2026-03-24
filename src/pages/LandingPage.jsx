import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Check, Eye, Globe, Heart, Lock, Menu, MessageCircle, Shield, UserCheck, X, Smartphone } from 'lucide-react';

const navItems = [
  { label: 'Home', id: 'home' },
  { label: 'Features', id: 'features' },
  { label: 'Safety', id: 'safety' },
  { label: 'Download', id: 'download' },
];

const featureCards = [
  {
    icon: Globe,
    title: 'Global Profiles',
    description: 'Connect with people around the world in one affordable dating platform.',
  },
  {
    icon: MessageCircle,
    title: 'Unlimited Messaging',
    description: 'Talk with your matches freely without getting blocked by premium walls.',
  },
  {
    icon: Shield,
    title: 'Fraud Detection',
    description: 'Designed to help reduce fake accounts and protect real conversations.',
  },
  {
    icon: Lock,
    title: 'Privacy Control',
    description: 'Clear controls for who can see you, contact you, and view your profile.',
  },
];

const safetyCards = [
  {
    icon: Check,
    title: 'Verified Profiles',
    description: 'Stronger identity and profile trust for safer dating interactions.',
  },
  {
    icon: Shield,
    title: '24/7 Moderation',
    description: 'Fast review workflows and clear moderation support when reports happen.',
  },
];

function PanelShell({ children, className = '' }) {
  return (
    <section className={`relative overflow-hidden rounded-[40px] border border-white/60 bg-white/20 shadow-[0_8px_48px_rgba(91,84,142,0.11),0_2px_8px_rgba(91,84,142,0.05)] backdrop-blur-2xl ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,170,170,0.32),_transparent_50%),radial-gradient(ellipse_at_top_right,_rgba(150,210,255,0.26),_transparent_50%),radial-gradient(ellipse_at_bottom,_rgba(244,176,255,0.16),_transparent_50%)]" />
      {children}
    </section>
  );
}

function StoreBadge({ type, onClick }) {
  const isApple = type === 'apple';

  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-2.5 rounded-2xl border border-slate-800/70 bg-slate-950 px-3 py-2 text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-900"
      aria-label={`${isApple ? 'App Store' : 'Google Play'} — coming soon`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
        {isApple ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <path d="M4 3.5 18.5 12 4 20.5V3.5Z" fill="#34D399" />
            <path d="M18.5 12 10.1 7.1l3.5-2 6.4 3.8-2 3.1Z" fill="#60A5FA" />
            <path d="M18.5 12 10.1 16.9l3.5 2 6.4-3.8-2-3.1Z" fill="#F472B6" />
            <path d="M4 3.5 13.6 9.1 10.1 12 4 3.5Z" fill="#FBBF24" />
            <path d="M4 20.5 13.6 14.9 10.1 12 4 20.5Z" fill="#A78BFA" />
          </svg>
        )}
      </span>
      <span className="text-left">
        <span className="block text-[11px] uppercase tracking-[0.18em] text-white/65">
          {isApple ? 'Download on the' : 'Get it on'}
        </span>
        <span className="block text-sm font-semibold leading-tight">
          {isApple ? 'App Store' : 'Google Play'}
        </span>
      </span>
    </button>
  );
}

function PhoneShowcase({ className = '' }) {
  return (
    <div className={`relative hidden items-center justify-center lg:flex ${className}`}>
      <div className="absolute h-80 w-80 rounded-full bg-amber-300/22 blur-3xl" />
      <div className="absolute h-72 w-72 rounded-full border border-amber-200/45" />
      <div className="absolute h-[24rem] w-[24rem] rounded-full border border-amber-100/22" />
      <div className="absolute -left-10 top-10 h-48 w-48 rounded-full bg-pink-300/15 blur-3xl" />
      <img
        src="/hero-connectivity-phone.svg"
        alt="99Cupid connectivity phone illustration"
        className="relative z-10 w-[340px] max-w-full drop-shadow-[0_32px_60px_rgba(79,55,120,0.22)]"
      />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, tint = 'rose' }) {
  const tintMap = {
    rose: 'bg-rose-100 text-rose-600',
    violet: 'bg-violet-100 text-violet-600',
    amber: 'bg-amber-100 text-amber-600',
    sky: 'bg-sky-100 text-sky-600',
    emerald: 'bg-emerald-100 text-emerald-600',
  };

  return (
    <article className="rounded-[24px] border border-white/70 bg-white/50 p-6 shadow-[0_4px_24px_rgba(91,84,142,0.08),0_1px_4px_rgba(91,84,142,0.04)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/65 hover:shadow-[0_12px_36px_rgba(91,84,142,0.13)]">
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${tintMap[tint]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-[17px] font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-[1.65] text-slate-600">{description}</p>
    </article>
  );
}

/* ─── Glowing Connection Ribbon ─── */
function GlowRibbon({ size = 'large' }) {
  const isSmall = size === 'small';
  return (
    <svg
      viewBox="0 0 700 420"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none select-none"
      style={{
        mixBlendMode: 'screen',
        opacity: isSmall ? 0.55 : 0.65,
        filter: 'blur(0.8px)',
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Main ribbon gradient — gold shimmer */}
        <linearGradient id={`ribbonGrad${size}`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#b45309" stopOpacity="0" />
          <stop offset="15%" stopColor="#d97706" stopOpacity="0.85" />
          <stop offset="35%" stopColor="#f59e0b" stopOpacity="1" />
          <stop offset="55%" stopColor="#fcd34d" stopOpacity="1" />
          <stop offset="75%" stopColor="#fde68a" stopOpacity="0.9" />
          <stop offset="90%" stopColor="#f59e0b" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
        </linearGradient>
        {/* Outer glow gradient — warm gold haze */}
        <linearGradient id={`glowGrad${size}`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#92400e" stopOpacity="0" />
          <stop offset="20%" stopColor="#d97706" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.65" />
          <stop offset="80%" stopColor="#fde68a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
        </linearGradient>
        {/* Blur filters */}
        <filter id={`blur${size}Outer`} x="-30%" y="-300%" width="160%" height="700%">
          <feGaussianBlur stdDeviation={isSmall ? '6' : '9'} />
        </filter>
        <filter id={`blur${size}Mid`} x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation={isSmall ? '3' : '4.5'} />
        </filter>
        <filter id={`glow${size}Spark`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>

      {/* Outermost wide glow */}
      <path
        d="M 20 340 C 100 280, 180 180, 280 160 C 380 140, 440 200, 520 170 C 590 145, 640 120, 680 90"
        fill="none"
        stroke={`url(#glowGrad${size})`}
        strokeWidth={isSmall ? '28' : '44'}
        strokeLinecap="round"
        filter={`url(#blur${size}Outer)`}
      />
      {/* Mid glow */}
      <path
        d="M 20 340 C 100 280, 180 180, 280 160 C 380 140, 440 200, 520 170 C 590 145, 640 120, 680 90"
        fill="none"
        stroke={`url(#ribbonGrad${size})`}
        strokeWidth={isSmall ? '10' : '16'}
        strokeLinecap="round"
        filter={`url(#blur${size}Mid)`}
      />
      {/* Core ribbon line */}
      <path
        d="M 20 340 C 100 280, 180 180, 280 160 C 380 140, 440 200, 520 170 C 590 145, 640 120, 680 90"
        fill="none"
        stroke={`url(#ribbonGrad${size})`}
        strokeWidth={isSmall ? '2' : '2.5'}
        strokeLinecap="round"
        opacity="0.95"
      />

      {/* Sparkle particles along the path */}
      {[
        { cx: 130, cy: 272, r: 2.2, o: 0.9 },
        { cx: 210, cy: 200, r: 1.5, o: 0.7 },
        { cx: 285, cy: 158, r: 2.8, o: 1 },
        { cx: 360, cy: 148, r: 1.8, o: 0.8 },
        { cx: 430, cy: 182, r: 2.4, o: 0.95 },
        { cx: 510, cy: 172, r: 1.6, o: 0.75 },
        { cx: 580, cy: 148, r: 2.2, o: 0.85 },
        { cx: 640, cy: 118, r: 1.4, o: 0.65 },
      ].map(({ cx, cy, r, o }, i) => (
        <g key={i} filter={`url(#glow${size}Spark)`}>
          <circle cx={cx} cy={cy} r={r * 1.8} fill="white" opacity={o * 0.25} />
          <circle cx={cx} cy={cy} r={r} fill="white" opacity={o} />
        </g>
      ))}

      {/* Cross sparkle shapes at key nodes — gold tinted */}
      {[
        { cx: 285, cy: 158, size: 7, color: '#fde68a' },
        { cx: 430, cy: 182, size: 5.5, color: '#fcd34d' },
        { cx: 580, cy: 148, size: 4.5, color: '#fbbf24' },
      ].map(({ cx, cy, size: s, color }, i) => (
        <g key={i} filter={`url(#glow${size}Spark)`} opacity="0.9">
          <line x1={cx - s} y1={cy} x2={cx + s} y2={cy} stroke={color} strokeWidth="1" strokeLinecap="round" />
          <line x1={cx} y1={cy - s} x2={cx} y2={cy + s} stroke={color} strokeWidth="1" strokeLinecap="round" />
          <line x1={cx - s * 0.7} y1={cy - s * 0.7} x2={cx + s * 0.7} y2={cy + s * 0.7} stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.5" />
          <line x1={cx + s * 0.7} y1={cy - s * 0.7} x2={cx - s * 0.7} y2={cy + s * 0.7} stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.5" />
        </g>
      ))}

      {/* Floating micro-dots */}
      {[
        { cx: 170, cy: 230, r: 1 },
        { cx: 248, cy: 172, r: 0.8 },
        { cx: 400, cy: 140, r: 1.2 },
        { cx: 470, cy: 165, r: 0.9 },
        { cx: 555, cy: 155, r: 1 },
        { cx: 618, cy: 130, r: 0.8 },
      ].map(({ cx, cy, r }, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="white" opacity="0.55" />
      ))}
    </svg>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(null); // 'apple' | 'google' | null

  const scrollTo = (id) => {
    setMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f6eaf2] text-slate-900">
      <div className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_rgba(255,186,186,0.90),_transparent_30%),radial-gradient(ellipse_at_top_right,_rgba(153,219,255,0.80),_transparent_35%),radial-gradient(ellipse_at_bottom_left,_rgba(247,194,255,0.65),_transparent_28%),linear-gradient(150deg,#f9d6dd_0%,#eedcf9_46%,#d7efff_100%)]">
        <img
          src="/websitesample.jpeg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover opacity-[0.12] blur-3xl"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.18),_transparent_42%)]" />
        <div className="absolute -left-20 top-24 h-96 w-96 rounded-full bg-pink-300/18 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-sky-300/16 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-300/14 blur-3xl" />

        <header className="relative z-20">
          <div className="mx-auto max-w-7xl px-5 pt-6 lg:px-8">
            <div className="rounded-[28px] border border-white/60 bg-white/55 px-5 py-3.5 shadow-[0_4px_24px_rgba(91,84,142,0.07)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                {/* Logo */}
                <button
                  type="button"
                  onClick={() => scrollTo('home')}
                  className="inline-flex items-center"
                  aria-label="Go to top"
                >
                  <img src="/icon_logo4.png" alt="99Cupid logo" className="h-9 w-auto" />
                </button>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-7 md:flex">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollTo(item.id)}
                      className="text-sm font-medium text-slate-600 transition hover:text-rose-600"
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                {/* Desktop CTAs */}
                <div className="hidden items-center gap-2.5 md:flex">
                  <Link
                    to="/login"
                    className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white/70 hover:text-slate-900"
                  >
                    Login
                  </Link>
                  <Link
                    to="/login"
                    className="rounded-xl bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(225,60,80,0.28)] transition duration-200 hover:bg-rose-600 hover:-translate-y-px"
                  >
                    Create Account
                  </Link>
                </div>

                {/* Mobile menu toggle */}
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-white/60 md:hidden"
                  aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                >
                  {menuOpen ? <X className="h-4 w-4 text-slate-700" /> : <Menu className="h-4 w-4 text-slate-700" />}
                </button>
              </div>

              {/* Mobile menu */}
              {menuOpen && (
                <div className="mt-3 border-t border-white/50 pt-3 md:hidden">
                  <div className="flex flex-col gap-0.5">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollTo(item.id)}
                        className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-white/55"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2 border-t border-white/50 pt-3">
                    <Link
                      to="/login"
                      className="flex-1 rounded-xl border border-slate-200/80 bg-white/70 px-4 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-white/85"
                    >
                      Login
                    </Link>
                    <Link
                      to="/login"
                      className="flex-1 rounded-xl bg-rose-500 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-[0_4px_14px_rgba(225,60,80,0.28)] transition hover:bg-rose-600"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-5 pb-16 lg:px-8 lg:pb-24">
          {/* ─── HERO ─── */}
          <PanelShell className="min-h-[640px]">
            <div id="home" className="relative z-10 grid min-h-[640px] items-center gap-8 px-8 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:px-14">
              <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
                <div className="absolute left-1/2 top-16 -z-10 h-56 w-56 -translate-x-1/2 rounded-full bg-white/20 blur-3xl lg:left-1/4" />
                {/* Badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-600 shadow-sm backdrop-blur-sm">
                  <Heart className="h-3.5 w-3.5" />
                  Built for accessibility. Only 99c per month.
                </div>

                {/* H1 */}
                <h1 className="max-w-[560px] text-[42px] font-bold leading-[1.15] tracking-[-0.02em] text-slate-900 sm:text-5xl lg:text-[58px]">
                  Love Without Borders
                </h1>

                {/* Subtext */}
                <p className="mt-5 max-w-[480px] text-base leading-[1.75] text-slate-600 sm:text-lg">
                  Connect with people around the world through a modern dating experience focused on trust,
                  affordability, and real conversations.
                </p>

                {/* Primary CTAs */}
                <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  <Link
                    to="/login"
                    className="rounded-2xl bg-rose-500 px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_28px_rgba(225,60,80,0.35)] transition duration-200 hover:-translate-y-0.5 hover:bg-rose-600 hover:shadow-[0_12px_36px_rgba(225,60,80,0.42)]"
                  >
                    Create Account
                  </Link>
                  <Link
                    to="/login"
                    className="rounded-2xl border border-white/70 bg-white/60 px-7 py-3.5 text-[15px] font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:bg-white/80"
                  >
                    Sign In
                  </Link>
                </div>

                {/* Store badges */}
                <div className="mt-7 flex flex-col items-center gap-2.5 lg:items-start">
                  <p className="text-[10px] font-medium uppercase tracking-[0.20em] text-slate-500">Also available on</p>
                  <div className="flex flex-wrap gap-3">
                    <StoreBadge type="apple" onClick={() => setShowComingSoon('apple')} />
                    <StoreBadge type="google" onClick={() => setShowComingSoon('google')} />
                  </div>
                </div>
              </div>

              {/* Hero glow ribbon — behind woman image */}
              <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
                <div className="absolute bottom-0 right-0 h-full w-[65%]">
                  <GlowRibbon size="large" />
                </div>
              </div>

              {/* Hero couple image */}
              <div className="relative hidden items-end justify-center lg:flex">
                {/* Soft radial glow behind figure */}
                <div className="absolute bottom-0 left-1/2 h-[500px] w-[380px] -translate-x-1/2 rounded-full bg-gradient-to-t from-rose-200/40 via-pink-100/20 to-transparent blur-3xl" />
                <img
                  src="/hero_image.jpeg"
                  alt="Happy couple reuniting at airport"
                  className="relative z-10 h-[520px] max-h-[90%] w-auto max-w-full rounded-[32px] object-cover pb-0 shadow-[0_24px_60px_rgba(0,0,0,0.15)]"
                />
              </div>
            </div>
          </PanelShell>

          {/* ─── FEATURES ─── */}
          <PanelShell>
            <div id="features" className="relative z-10 grid gap-12 px-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-14">
              {/* Features glow ribbon — subtle connector behind cards */}
              <div className="pointer-events-none absolute inset-x-0 bottom-8 z-0 hidden opacity-80 lg:block">
                <GlowRibbon size="small" />
              </div>
              <div>
                <div className="max-w-xl">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-500">Features</p>
                  <h2 className="text-[32px] font-bold leading-tight tracking-[-0.02em] text-slate-900 sm:text-[38px]">
                    Everything You Need to Connect
                  </h2>
                  <p className="mt-4 text-base leading-[1.7] text-slate-600">
                    All the premium features you need, in one clean and affordable experience.
                  </p>
                </div>

                <div className="mt-9 grid gap-4 sm:grid-cols-2">
                  <FeatureCard {...featureCards[0]} tint="sky" />
                  <FeatureCard {...featureCards[1]} tint="violet" />
                  <FeatureCard {...featureCards[2]} tint="amber" />
                  <FeatureCard {...featureCards[3]} tint="emerald" />
                </div>
              </div>

              {/* Features illustration */}
              <div className="relative hidden items-center justify-center lg:flex">
                <div className="absolute h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />
                <div className="relative z-10 grid grid-cols-2 gap-4 p-4">
                  {[
                    { Icon: MessageCircle, label: 'Real Chats', tint: 'bg-sky-100 text-sky-600' },
                    { Icon: Globe, label: 'Global', tint: 'bg-violet-100 text-violet-600' },
                    { Icon: Lock, label: 'Private', tint: 'bg-amber-100 text-amber-600' },
                    { Icon: Check, label: 'Verified', tint: 'bg-emerald-100 text-emerald-600' },
                  ].map(({ Icon, label, tint }) => (
                    <div key={label} className="flex flex-col items-center gap-3 rounded-[20px] border border-white/70 bg-white/60 px-8 py-6 shadow-[0_4px_20px_rgba(91,84,142,0.09)] backdrop-blur-sm">
                      <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tint}`}>
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="text-sm font-semibold text-slate-700">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PanelShell>

          {/* ─── SAFETY ─── */}
          <PanelShell>
            <div id="safety" className="relative z-10 grid gap-12 px-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-14">
              <div>
                <div className="max-w-xl">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-500">Safety</p>
                  <h2 className="text-[32px] font-bold leading-tight tracking-[-0.02em] text-slate-900 sm:text-[38px]">
                    Your Safety, Our Promise
                  </h2>
                  <p className="mt-4 text-base leading-[1.7] text-slate-600">
                    Safe online dating is central to the experience, with protection tools designed to support real
                    people.
                  </p>
                </div>

                <div className="mt-9 grid gap-4 sm:grid-cols-2">
                  {safetyCards.map((card, index) => (
                    <FeatureCard
                      key={card.title}
                      icon={card.icon}
                      title={card.title}
                      description={card.description}
                      tint={['sky', 'violet', 'amber', 'emerald'][index]}
                    />
                  ))}
                </div>
              </div>

              {/* Safety illustration */}
              <div className="relative hidden items-center justify-center lg:flex">
                <div className="absolute h-72 w-72 rounded-full bg-rose-200/25 blur-3xl" />
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 shadow-[0_16px_48px_rgba(225,60,80,0.35)]">
                    <Shield className="h-16 w-16 text-white" />
                  </div>
                  <div className="flex flex-col gap-3 w-64">
                    {[
                      { Icon: UserCheck, text: 'Identity Verified Profiles', tint: 'bg-rose-100 text-rose-600' },
                      { Icon: AlertTriangle, text: 'One-tap Report & Block', tint: 'bg-amber-100 text-amber-600' },
                      { Icon: Eye, text: '24/7 Moderation Team', tint: 'bg-sky-100 text-sky-600' },
                    ].map(({ Icon, text, tint }) => (
                      <div key={text} className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/60 px-4 py-3 shadow-sm backdrop-blur-sm">
                        <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${tint}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-medium text-slate-700">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </PanelShell>

          {/* ─── DOWNLOAD ─── */}
          <PanelShell>
            <div id="download" className="relative z-10 grid gap-12 px-8 py-12 lg:grid-cols-[1.08fr_0.92fr] lg:px-14 lg:py-14">
              <div className="flex flex-col justify-center">
                <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-500 lg:text-left">Download</p>
                <h2 className="text-center text-[32px] font-bold leading-tight tracking-[-0.02em] text-slate-900 sm:text-[38px] lg:text-left">
                  Get 99Cupid — Free During Launch
                </h2>
                <p className="mt-4 text-center text-base leading-[1.7] text-slate-600 lg:text-left">
                  Start connecting globally, affordably. Until the store listings are live, every download action opens
                  the web app so people can sign in immediately.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  <StoreBadge type="apple" onClick={() => setShowComingSoon('apple')} />
                  <StoreBadge type="google" onClick={() => setShowComingSoon('google')} />
                </div>

                <div className="mt-8 rounded-[28px] border border-white/70 bg-white/40 p-7 shadow-[0_4px_24px_rgba(91,84,142,0.07)] backdrop-blur-md">
                  <h3 className="text-center text-[22px] font-bold leading-tight tracking-[-0.01em] text-slate-900 lg:text-left">
                    Become Part of a Global Love Community Today
                  </h3>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                    <Link
                      to="/login"
                      className="rounded-2xl bg-rose-500 px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(225,60,80,0.32)] transition duration-200 hover:-translate-y-0.5 hover:bg-rose-600"
                    >
                      Create Account
                    </Link>
                    <Link
                      to="/login"
                      className="rounded-2xl border border-slate-200/80 bg-white/65 px-7 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-white/85"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>

              {/* Download illustration */}
              <div className="relative hidden items-center justify-center lg:flex">
                <div className="absolute h-80 w-80 rounded-full bg-amber-200/25 blur-3xl" />
                <div className="relative z-10 flex flex-col items-center gap-5">
                  <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-rose-400 to-pink-600 shadow-[0_16px_40px_rgba(225,60,80,0.32)]">
                    <Heart className="h-12 w-12 text-white fill-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">Join the Community</p>
                    <p className="mt-1 text-sm text-slate-500">Free until app store launch</p>
                  </div>
                  <div className="flex flex-col gap-3 w-64">
                    {['Sign up in under 2 minutes', 'Build your profile & photos', 'Start matching globally'].map((step, i) => (
                      <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/60 px-4 py-3 shadow-sm backdrop-blur-sm">
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">{i + 1}</span>
                        <span className="text-sm font-medium text-slate-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </PanelShell>
        </main>
      </div>

      {/* Coming Soon modal */}
      {showComingSoon && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowComingSoon(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowComingSoon(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            {/* Icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg">
              <Smartphone className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">Coming Soon!</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              The{' '}
              <span className="font-semibold">
                {showComingSoon === 'apple' ? 'iOS App Store' : 'Google Play'}
              </span>{' '}
              version of 99Cupid is on its way. In the meantime, you can use our web app instantly — no download needed.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setShowComingSoon(null)}
                className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all"
              >
                Use the Web App Now
              </Link>
              <button
                onClick={() => setShowComingSoon(null)}
                className="w-full rounded-2xl bg-gray-100 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

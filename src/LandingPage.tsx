import React, { useRef, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useInView,
} from 'motion/react';
import { Scissors, ArrowRight, Zap, TrendingUp, Share2, Clock, Play, Check } from 'lucide-react';

// ─── Isolated perpetual components ──────────────────────────────────────────

const LiveDot = React.memo(() => (
  <motion.span
    className="inline-block h-[7px] w-[7px] rounded-full bg-emerald-400"
    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
  />
));

const FloatingCard = React.memo(() => (
  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    className="absolute -right-6 top-12 z-20 rounded-[1.25rem] bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-4 shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
  >
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
        <TrendingUp className="h-4 w-4 text-emerald-400" />
      </div>
      <div>
        <p className="text-[11px] font-medium text-zinc-100">Clip scored 94/100</p>
        <p className="text-[10px] text-zinc-500">Peak virality window detected</p>
      </div>
    </div>
  </motion.div>
));

const ProcessingCard = React.memo(() => (
  <motion.div
    animate={{ y: [0, 8, 0] }}
    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
    className="absolute -left-8 bottom-16 z-20 rounded-[1.25rem] bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-4 shadow-[0_24px_48px_rgba(0,0,0,0.4)]"
  >
    <div className="flex items-center gap-3">
      <LiveDot />
      <div>
        <p className="text-[11px] font-medium text-zinc-100">3 clips extracted</p>
        <p className="text-[10px] text-zinc-500">47.2% avg engagement lift</p>
      </div>
    </div>
  </motion.div>
));

// ─── Magnetic CTA ────────────────────────────────────────────────────────────

const MagneticButton = ({
  children,
  onClick,
  variant = 'primary',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15 });
  const sy = useSpring(y, { stiffness: 150, damping: 15 });

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
      y.set((e.clientY - (r.top + r.height / 2)) * 0.22);
    },
    [x, y],
  );
  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={
        variant === 'primary'
          ? 'group flex items-center gap-3 rounded-full bg-zinc-50 px-6 py-3.5 text-sm font-semibold text-zinc-950 transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white'
          : 'flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-zinc-400 transition-all duration-300 hover:text-zinc-100'
      }
    >
      {children}
    </motion.button>
  );
};

// ─── Scroll-reveal wrapper ───────────────────────────────────────────────────

const Reveal = ({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Bento card wrapper (double-bezel) ───────────────────────────────────────

const BentoCard = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-[2rem] bg-zinc-900/40 p-[1.5px] ring-1 ring-white/[0.07] ${className}`}
  >
    <div className="h-full rounded-[calc(2rem-1.5px)] bg-zinc-950/80 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      {children}
    </div>
  </div>
);

// ─── Marquee ─────────────────────────────────────────────────────────────────

const platforms = [
  'TikTok', 'Instagram Reels', 'YouTube Shorts', 'Twitter / X',
  'LinkedIn', 'Facebook', 'Snapchat Spotlight', 'Pinterest',
];

const Marquee = React.memo(() => (
  <div className="overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
    <motion.div
      className="flex gap-6 whitespace-nowrap"
      animate={{ x: ['0%', '-50%'] }}
      transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
    >
      {[...platforms, ...platforms].map((p, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-zinc-400"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
          {p}
        </span>
      ))}
    </motion.div>
  </div>
));

// ─── Feature data ─────────────────────────────────────────────────────────────

const features = [
  {
    icon: Zap,
    title: 'Gemini-powered scoring',
    body: 'Every second of your video is scored for hook strength, retention, and emotional resonance — not just highlights.',
    accent: 'blue',
    wide: true,
  },
  {
    icon: TrendingUp,
    title: 'Virality prediction',
    body: 'Ranked clips with concrete reasoning so you ship the right segment, not just the first one.',
    accent: 'emerald',
    wide: false,
  },
  {
    icon: Clock,
    title: 'Scheduled publishing',
    body: 'Post at peak windows across platforms without touching each app.',
    accent: 'violet',
    wide: false,
  },
  {
    icon: Share2,
    title: 'Multi-platform distribution',
    body: 'One clip → TikTok, Reels, Shorts, and X in the right aspect ratio for each.',
    accent: 'amber',
    wide: true,
  },
];

const accentMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
  violet: 'bg-violet-500/10 text-violet-400 ring-violet-500/20',
  amber: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
};

// ─── Pricing ─────────────────────────────────────────────────────────────────

const plans = [
  {
    name: 'Starter',
    price: '0',
    description: 'For creators building their first audience.',
    features: ['3 video analyses / month', '10 clips / month', 'TikTok + Reels export', 'Basic scheduling'],
    cta: 'Get started free',
    featured: false,
  },
  {
    name: 'Pro',
    price: '29',
    description: 'For operators who publish daily and track everything.',
    features: ['Unlimited analyses', 'Unlimited clips', 'All platforms', 'Advanced scheduling', 'Analytics dashboard', 'Priority support'],
    cta: 'Start 14-day trial',
    featured: true,
  },
];

// ─── Main landing page ────────────────────────────────────────────────────────

export default function LandingPage({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 font-sans selection:bg-blue-500/30">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[-20%] top-[-10%] h-[50%] w-[50%] rounded-full bg-blue-600/[0.07] blur-[120px]" />
        <div className="absolute right-[-15%] bottom-[-10%] h-[45%] w-[45%] rounded-full bg-zinc-700/[0.12] blur-[100px]" />
      </div>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-50 flex items-center justify-between px-6 py-5 md:px-12"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100">
            <Scissors className="h-4 w-4 text-zinc-950" />
          </div>
          <span className="font-display text-base font-semibold tracking-tight text-zinc-100">
            ClipSweep
          </span>
        </div>

        <div className="hidden items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-1.5 backdrop-blur-xl md:flex">
          {['Features', 'Pricing', 'Changelog'].map((item) => (
            <button
              key={item}
              className="rounded-full px-4 py-1.5 text-sm text-zinc-400 transition-colors duration-200 hover:bg-white/[0.06] hover:text-zinc-100"
            >
              {item}
            </button>
          ))}
        </div>

        <MagneticButton onClick={onLogin} variant="primary">
          Sign in
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-950/10 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </MagneticButton>
      </motion.nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-[1400px] px-6 pb-24 pt-20 md:px-12 md:pt-28">
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2 lg:gap-24">
          {/* Left: copy */}
          <div className="flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1"
            >
              <LiveDot />
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                Powered by Gemini
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-zinc-50 md:text-6xl lg:text-7xl"
            >
              Cut the parts
              <br />
              <span className="text-zinc-500">people actually</span>
              <br />
              watch.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-[42ch] text-base leading-relaxed text-zinc-400"
            >
              Paste a YouTube link. ClipSweep scans every second, scores each
              segment for virality, and hands you the clips worth posting —
              ready for every platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <MagneticButton onClick={onLogin} variant="primary">
                Start for free
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-950/10 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </MagneticButton>
              <MagneticButton variant="ghost">
                <Play className="h-3.5 w-3.5" />
                Watch demo
              </MagneticButton>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 text-[11px] text-zinc-600"
            >
              No credit card required. 3 free analyses included.
            </motion.p>
          </div>

          {/* Right: product preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden md:block"
          >
            <FloatingCard />
            <ProcessingCard />

            {/* Main preview shell */}
            <div className="rounded-[2rem] bg-zinc-900/60 p-[1.5px] ring-1 ring-white/[0.08] shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
              <div className="overflow-hidden rounded-[calc(2rem-1.5px)] bg-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <div className="mx-auto flex w-48 items-center gap-2 rounded-md bg-white/[0.04] px-3 py-1">
                    <span className="text-[10px] text-zinc-600">app.clipsweep.io</span>
                  </div>
                </div>

                {/* Mock app content */}
                <div className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-300">Analysis results</span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                      4 clips found
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { score: 94, label: '0:14 – 1:03', reason: 'High hook retention', color: 'emerald' },
                      { score: 87, label: '3:47 – 4:22', reason: 'Emotional peak moment', color: 'blue' },
                      { score: 81, label: '7:12 – 8:01', reason: 'Strong call-to-action', color: 'blue' },
                      { score: 74, label: '11:33 – 12:15', reason: 'Curiosity loop closure', color: 'zinc' },
                    ].map((clip, i) => (
                      <motion.div
                        key={clip.label}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 hover:bg-white/[0.05] transition-colors duration-200"
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${
                            clip.color === 'emerald'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : clip.color === 'blue'
                              ? 'bg-blue-500/10 text-blue-400'
                              : 'bg-zinc-700/50 text-zinc-400'
                          }`}
                        >
                          {clip.score}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-zinc-200">{clip.label}</p>
                          <p className="truncate text-[10px] text-zinc-600">{clip.reason}</p>
                        </div>
                        <div className="ml-auto shrink-0 h-7 w-7 flex items-center justify-center rounded-full bg-white/[0.04] ring-1 ring-white/[0.06]">
                          <ArrowRight className="h-3 w-3 text-zinc-500" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Platform marquee ──────────────────────────────────────────────── */}
      <div className="relative z-10 border-t border-b border-white/[0.05] bg-white/[0.02]">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <p className="pb-2 pt-5 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
            Distribute to every platform
          </p>
          <Marquee />
        </div>
      </div>

      {/* ── Features bento ───────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-[1400px] px-6 py-28 md:px-12">
        <Reveal>
          <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-zinc-600">
            How it works
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-zinc-50 md:text-5xl">
            Built for operators, not editors.
          </h2>
          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-zinc-500">
            Every tool in ClipSweep is wired to reduce the time between raw footage and
            published clip — without sacrificing the judgment call.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Wide card 1 */}
          <Reveal delay={0.05} className="md:col-span-2">
            <BentoCard className="h-full">
              <div className={`mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${accentMap['blue']}`}>
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-display text-xl font-semibold tracking-tight text-zinc-100">
                Gemini-powered scoring
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500">
                Every second of your video is scored for hook strength, retention curve, and
                emotional resonance — not just highlights. You get a ranked list with concrete
                reasoning, not a generic summary.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: 'Hook score', value: '94' },
                  { label: 'Retention', value: '81%' },
                  { label: 'Avg lift', value: '+47.2%' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                    <p className="font-mono text-lg font-semibold tabular-nums text-zinc-100">{stat.value}</p>
                    <p className="mt-0.5 text-[10px] text-zinc-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </BentoCard>
          </Reveal>

          {/* Narrow card */}
          <Reveal delay={0.1}>
            <BentoCard className="h-full">
              <div className={`mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${accentMap['emerald']}`}>
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-display text-xl font-semibold tracking-tight text-zinc-100">
                Virality prediction
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500">
                Ranked clips with concrete reasoning so you ship the right segment — not just the
                first one the timeline finds.
              </p>
            </BentoCard>
          </Reveal>

          {/* Narrow card */}
          <Reveal delay={0.15}>
            <BentoCard className="h-full">
              <div className={`mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${accentMap['violet']}`}>
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-display text-xl font-semibold tracking-tight text-zinc-100">
                Scheduled publishing
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500">
                Post at peak engagement windows across every platform without opening each app.
              </p>
            </BentoCard>
          </Reveal>

          {/* Wide card 2 */}
          <Reveal delay={0.2} className="md:col-span-2">
            <BentoCard className="h-full">
              <div className={`mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${accentMap['amber']}`}>
                <Share2 className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-display text-xl font-semibold tracking-tight text-zinc-100">
                Multi-platform distribution
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500">
                One clip lands on TikTok, Reels, Shorts, and X in the correct aspect ratio and caption
                format for each. No reformatting, no re-uploading.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['TikTok 9:16', 'Reels 9:16', 'Shorts 9:16', 'X / Twitter', 'LinkedIn'].map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-white/[0.07] bg-white/[0.04] px-3 py-1 text-[11px] text-zinc-400"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </BentoCard>
          </Reveal>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-[1400px] px-6 py-24 md:px-12">
        <Reveal>
          <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-zinc-600">Pricing</p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-zinc-50 md:text-5xl">
            Pay when you scale.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 md:max-w-[820px]">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.08}>
              <div
                className={`h-full rounded-[2rem] p-[1.5px] ${
                  plan.featured
                    ? 'bg-gradient-to-b from-zinc-400/20 to-zinc-700/10 shadow-[0_0_40px_rgba(59,130,246,0.06)]'
                    : 'bg-zinc-900/40 ring-1 ring-white/[0.07]'
                }`}
              >
                <div className="flex h-full flex-col rounded-[calc(2rem-1.5px)] bg-zinc-950/90 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  {plan.featured && (
                    <span className="mb-4 inline-flex w-fit rounded-full bg-blue-500/10 px-3 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-blue-400 ring-1 ring-blue-500/20">
                      Most popular
                    </span>
                  )}
                  <h3 className="font-display text-xl font-semibold text-zinc-100">{plan.name}</h3>
                  <p className="mt-1 text-sm text-zinc-500">{plan.description}</p>
                  <div className="mt-6 flex items-end gap-1">
                    <span className="font-display text-4xl font-bold tracking-tight text-zinc-50">
                      ${plan.price}
                    </span>
                    <span className="mb-1 text-sm text-zinc-600">/ month</span>
                  </div>

                  <ul className="mt-8 space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-zinc-400">
                        <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={onLogin}
                    className={`mt-8 w-full rounded-full py-3 text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      plan.featured
                        ? 'bg-zinc-50 text-zinc-950 hover:bg-white'
                        : 'border border-white/[0.1] bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-zinc-100'
                    }`}
                  >
                    {plan.cta}
                  </motion.button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.05] px-6 py-10 md:px-12">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100">
              <Scissors className="h-3.5 w-3.5 text-zinc-950" />
            </div>
            <span className="text-sm font-medium text-zinc-400">ClipSweep</span>
          </div>
          <p className="text-[11px] text-zinc-700">
            Built on Gemini. &copy; {new Date().getFullYear()} ClipSweep.
          </p>
        </div>
      </footer>
    </div>
  );
}

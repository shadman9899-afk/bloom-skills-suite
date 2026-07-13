import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Star,
  Users,
  Briefcase,
  Award,
  Check,
  PlayCircle,
  FileCheck,
  GraduationCap,
} from "lucide-react";
import heroVisual from "@/assets/hero-slate-futuristic.jpg";

const trustIndicators = [
  { icon: Star, label: "4.9 Google Rating", accent: "text-yellow-400" },
  { icon: Users, label: "1,200+ Students", accent: "text-[hsl(220,100%,75%)]" },
  { icon: Briefcase, label: "2,500+ Projects", accent: "text-[hsl(280,90%,75%)]" },
  { icon: Award, label: "96 Hiring Partners", accent: "text-[hsl(28,91%,65%)]" },
];

const quickBenefits = [
  "Live Classes",
  "Industry Projects",
  "Portfolio Ready",
  "Placement Support",
];

const floatingCards = [
  {
    icon: Briefcase,
    label: "Portfolio",
    sub: "12 real projects",
    className: "top-6 -left-4 sm:left-2",
    delay: "0s",
  },
  {
    icon: PlayCircle,
    label: "Live Projects",
    sub: "Weekly cohorts",
    className: "top-1/3 -right-4 sm:right-2",
    delay: "1.2s",
  },
  {
    icon: GraduationCap,
    label: "Placement",
    sub: "96 partners",
    className: "bottom-28 -left-4 sm:left-2",
    delay: "0.6s",
  },
  {
    icon: FileCheck,
    label: "Certificate",
    sub: "Industry recognised",
    className: "bottom-8 -right-4 sm:right-2",
    delay: "1.8s",
  },
];

const HeroSection = () => {
  const visualRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = visualRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      setParallax({ x: dx * 12, y: dy * 12 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-[hsl(228,40%,7%)] text-white"
      aria-labelledby="hero-heading"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[hsl(226,100%,50%)] opacity-30 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-[hsl(270,80%,55%)] opacity-25 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-[hsl(200,90%,55%)] opacity-20 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
          }}
        />
      </div>

      <div className="container relative z-10 grid min-h-[92vh] items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        {/* LEFT — content */}
        <div className="animate-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-white/80 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[hsl(220,100%,70%)]" aria-hidden="true" />
            New Cohort • Live Mentorship
          </div>

          <h1
            id="hero-heading"
            className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Become Job Ready in
            <br />
            <span className="bg-gradient-to-r from-[hsl(220,100%,78%)] via-[hsl(250,100%,78%)] to-[hsl(285,100%,78%)] bg-clip-text text-transparent">
              Design & Marketing
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Learn UI/UX, Graphic Design, Motion, Digital Marketing, Data Analytics
            and 3D Design through live projects, mentorship and placement support.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="group relative h-12 rounded-2xl bg-[#0037FF] px-7 text-white shadow-[0_10px_30px_-8px_rgba(0,55,255,0.7)] transition-all hover:bg-[#0037FF] hover:shadow-[0_14px_40px_-8px_rgba(0,55,255,0.9)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(228,40%,7%)]"
            >
              <Link to="/courses" aria-label="Explore all Slate Academy courses">
                Explore Courses
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 rounded-2xl border-2 border-[#FF8A00] bg-transparent px-7 text-[#FF8A00] transition-all hover:bg-[#FF8A00] hover:text-white hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#FF8A00] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(228,40%,7%)]"
            >
              <Link to="/support" aria-label="Book a free career counselling session">
                Book Free Counselling
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <ul
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/75"
            aria-label="Slate Academy trust indicators"
          >
            {trustIndicators.map(({ icon: Icon, label, accent }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${accent}`} aria-hidden="true" fill={label.includes("Rating") ? "currentColor" : "none"} />
                <span className="font-medium text-white/85">{label}</span>
              </li>
            ))}
          </ul>

          {/* Quick benefit chips */}
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Program benefits">
            {quickBenefits.map((b) => (
              <li
                key={b}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/30 hover:bg-white/[0.08]"
              >
                <Check className="h-3.5 w-3.5 text-[hsl(140,80%,65%)]" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT — visual */}
        <div
          ref={visualRef}
          className="relative animate-scale-in"
          style={{
            transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
            transition: "transform 200ms ease-out",
          }}
        >
          <div className="relative mx-auto aspect-square w-full max-w-[600px]">
            {/* Glow ring */}
            <div className="absolute inset-6 rounded-[2rem] bg-gradient-to-tr from-[#0037FF] via-[hsl(260,80%,55%)] to-[hsl(290,90%,60%)] opacity-40 blur-2xl animate-[pulse_6s_ease-in-out_infinite]" aria-hidden="true" />

            {/* Image card */}
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_20px_80px_-20px_rgba(0,55,255,0.6)] backdrop-blur-sm">
              <img
                src={heroVisual}
                alt="Students collaborating on UI/UX, 3D design and analytics projects at Slate Academy"
                width={1024}
                height={1024}
                className="h-full w-full object-cover"
                loading="eager"
                decoding="sync"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(228,40%,7%)]/60 via-transparent to-transparent" aria-hidden="true" />
            </div>

            {/* Floating UI cards */}
            {floatingCards.map(({ icon: Icon, label, sub, className, delay }) => (
              <div
                key={label}
                className={`absolute flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2.5 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.4)] backdrop-blur-xl ${className}`}
                style={{
                  animation: `floatY 6s ease-in-out ${delay} infinite`,
                }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0037FF] to-[hsl(280,90%,60%)]">
                  <Icon className="h-4.5 w-4.5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white leading-tight">{label}</p>
                  <p className="text-[10px] text-white/70 leading-tight">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#trust"
        aria-label="Scroll to explore Slate Academy"
        className="pointer-events-auto absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-full"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1">
          <div className="h-2 w-1 animate-[floatY_1.6s_ease-in-out_infinite] rounded-full bg-white/70" />
        </div>
      </a>

      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;

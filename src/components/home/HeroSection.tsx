import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import heroVisual from "@/assets/hero-slate-futuristic.jpg";

const floatingTags = [
  { label: "UI/UX Design", className: "top-8 left-6 animate-[float_6s_ease-in-out_infinite]" },
  { label: "Data Science", className: "top-20 right-8 animate-[float_7s_ease-in-out_infinite_reverse]" },
  { label: "3D Design", className: "bottom-24 left-10 animate-[float_8s_ease-in-out_infinite]" },
  { label: "Marketing", className: "bottom-10 right-12 animate-[float_5s_ease-in-out_infinite_reverse]" },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-[hsl(228,40%,7%)] text-white">
      {/* Ambient gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[hsl(237,90%,55%)] opacity-30 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-[hsl(270,80%,55%)] opacity-25 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-[hsl(200,90%,55%)] opacity-20 blur-[120px]" />
        {/* Subtle grid */}
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
            <Sparkles className="h-3.5 w-3.5 text-[hsl(220,100%,70%)]" />
            New Cohort • Live Mentorship
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            OWN YOUR SLATE.
            <br />
            <span className="bg-gradient-to-r from-[hsl(220,100%,75%)] via-[hsl(250,100%,75%)] to-[hsl(285,100%,75%)] bg-clip-text text-transparent">
              WRITE YOUR FUTURE.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Welcome to a place where ambition meets action. At Slate Academy, we help you write
            your story, while you hold the chalk. Real curiosity meets real skills — through
            industry-ready courses in graphic design, UI/UX, data science, digital marketing and
            3D design. No fluff. No filler. Just real growth.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="group relative h-12 rounded-xl bg-white px-7 text-[hsl(228,40%,10%)] shadow-[0_0_30px_hsl(220,100%,60%/0.35)] hover:bg-white hover:shadow-[0_0_50px_hsl(220,100%,60%/0.55)] transition-all"
            >
              <Link to="/courses">
                Explore Courses
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="lg"
              className="group h-12 rounded-xl border border-white/15 bg-white/5 px-7 text-white backdrop-blur-md hover:bg-white/10 hover:text-white"
            >
              <Link to="/signup" className="story-link">
                Start Your Career
              </Link>
            </Button>
          </div>

          {/* Mini trust strip */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/60">
            <div>
              <span className="block text-xl font-bold text-white">5,200+</span>
              Students placed
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="block text-xl font-bold text-white">320+</span>
              Hiring partners
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="block text-xl font-bold text-white">4.9★</span>
              Learner rating
            </div>
          </div>
        </div>

        {/* RIGHT — visual */}
        <div className="relative animate-scale-in">
          <div className="relative mx-auto aspect-square w-full max-w-[600px]">
            {/* Glow ring */}
            <div className="absolute inset-6 rounded-[2rem] bg-gradient-to-tr from-[hsl(237,90%,55%)] via-[hsl(260,80%,55%)] to-[hsl(290,90%,60%)] opacity-40 blur-2xl" />

            {/* Image card */}
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_20px_80px_-20px_hsl(237,90%,40%/0.6)] backdrop-blur-sm">
              <img
                src={heroVisual}
                alt="Slate Academy creative learning environment with UI/UX, 3D design and analytics"
                width={1024}
                height={1024}
                className="h-full w-full object-cover"
                loading="eager"
                decoding="sync"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(228,40%,7%)]/60 via-transparent to-transparent" />

              {/* Floating glass tags */}
              {floatingTags.map((t) => (
                <div
                  key={t.label}
                  className={`absolute rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-md ${t.className}`}
                >
                  {t.label}
                </div>
              ))}

              {/* Floating stat card */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(220,100%,60%)] to-[hsl(280,90%,60%)]">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Live Project Studio</p>
                  <p className="text-xs text-white/70">Build a real portfolio while you learn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block">
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1">
          <div className="h-2 w-1 animate-[float_1.6s_ease-in-out_infinite] rounded-full bg-white/70" />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;

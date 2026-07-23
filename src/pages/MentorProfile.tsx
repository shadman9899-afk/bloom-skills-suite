import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Star,
  Linkedin,
  Award,
  Briefcase,
  GraduationCap,
  Trophy,
  Users,
  Layers,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

// ── Mentor Data ─────────────────────────────────────────────
const mentorsData: Record<string, any> = {
  "sunny-singh": {
    name: "Sunny Singh",
    role: "Senior 3D Artist & Blender Expert",
    company: "Slate Academy",
    initials: "SS",
    tagline:
      "Helping aspiring artists build industry-ready 3D skills through practical projects, production workflows, and real mentorship.",
    experience: "8+ Years",
    students: "1,200+",
    projects: "150+",
    rating: 5.0,
    languages: "English • Hindi",
    availability: "Available for Mentorship",
    linkedinUrl: "https://linkedin.com/in/sunnysir",
    about: [
      "Sunny began his journey in 3D over eight years ago, driven by a fascination with turning imagination into cinematic, photoreal worlds. What started as late-night Blender experiments quickly grew into a full-time craft across studios, brands, and independent productions.",
      "He has led production pipelines on commercial product visualisation, character work, environment design, and animation — collaborating with teams across India and abroad. His philosophy is rooted in real workflows: shipping polished work under real deadlines, not just tutorials.",
      "At Slate Academy, Sunny mentors students with the same standards he holds in production. Every session is designed to move learners toward a portfolio that actually gets them hired.",
    ],
    expertise: [
      "Blender",
      "3D Modeling",
      "Texturing",
      "Animation",
      "Lighting",
      "Rendering",
      "Environment Design",
      "Product Visualization",
      "Character Modeling",
      "Sculpting",
      "UV Mapping",
      "Geometry Nodes",
    ],
    timeline: [
      { role: "Senior 3D Artist", company: "Slate Academy", years: "2023 – Present" },
      { role: "Lead Blender Artist", company: "XYZ Studio", years: "2021 – 2023" },
      { role: "Freelance 3D Artist", company: "Independent", years: "2018 – 2021" },
    ],
    projects_list: [
      {
        title: "Photoreal Product Renders",
        software: "Blender · Substance",
        desc: "Studio-grade product visuals for D2C brands, shipped end-to-end.",
      },
      {
        title: "Stylised Character Series",
        software: "Blender · ZBrush",
        desc: "A five-part character exploration with full sculpt-to-render pipeline.",
      },
      {
        title: "Cinematic Environment",
        software: "Blender · Unreal",
        desc: "Interactive real-time environment built for a game asset showcase.",
      },
      {
        title: "Motion Design Reel",
        software: "Blender · After Effects",
        desc: "Abstract motion sequences combining geometry nodes and simulation.",
      },
    ],
    tools: [
      "Blender",
      "Substance Painter",
      "Unreal Engine",
      "Photoshop",
      "After Effects",
      "Cinema 4D",
      "Figma",
    ],
    testimonials: [
      {
        name: "Ishaan Verma",
        company: "3D Artist · Freelance",
        text: "Sunny Sir completely changed how I approach 3D. Every class felt like working in a real studio.",
      },
      {
        name: "Riya Malhotra",
        company: "Product Visualizer · Nykaa",
        text: "The mentorship gave me a portfolio strong enough to land my first paid gig within weeks.",
      },
      {
        name: "Kabir Joshi",
        company: "Junior Artist · Studio X",
        text: "Practical, honest, and industry-focused. Exactly the mentor I needed to level up.",
      },
    ],
    courses: [
      { title: "Professional Blender", duration: "12 weeks", level: "Beginner → Advanced", projects: 6 },
      { title: "Advanced Product Visualization", duration: "8 weeks", level: "Intermediate", projects: 4 },
      { title: "3D Animation", duration: "10 weeks", level: "Intermediate", projects: 5 },
      { title: "Game Asset Design", duration: "10 weeks", level: "Advanced", projects: 5 },
    ],
    achievements: [
      { icon: Users, label: "1,200+ Students Trained" },
      { icon: Layers, label: "150+ Production Projects" },
      { icon: Award, label: "Industry Mentor" },
      { icon: Trophy, label: "Blender Specialist" },
      { icon: GraduationCap, label: "Portfolio Coach" },
    ],
  },
};

const faqs = [
  { q: "Who is this mentorship for?", a: "Anyone serious about building a career in 3D — beginners with drive, and intermediate artists looking to reach production-level quality." },
  { q: "Do I need prior experience?", a: "No prior experience is required. The curriculum starts from the fundamentals and scales up to advanced production workflows." },
  { q: "Will I build portfolio projects?", a: "Yes. Every module ends with a portfolio-worthy project reviewed personally by your mentor." },
  { q: "Is placement assistance included?", a: "Yes. You get portfolio reviews, interview prep, and access to Slate Academy's hiring network." },
];

const MentorProfile = () => {
  const { slug } = useParams();
  const mentor = mentorsData[slug || "sunny-singh"] || mentorsData["sunny-singh"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="border-b border-border">
        <div className="container py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Portrait */}
            <div className="relative animate-fade-in">
              <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0 rounded-[24px] overflow-hidden gradient-primary shadow-xl">
                <div className="absolute inset-0 flex items-center justify-center text-primary-foreground text-8xl font-bold tracking-tight">
                  {mentor.initials}
                </div>
              </div>
              <div className="absolute -top-3 -right-3 md:top-4 md:right-4 rounded-full bg-card border border-border shadow-lg px-4 py-2 flex items-center gap-2 text-sm font-semibold">
                <Trophy className="h-4 w-4 text-orange-500" />
                Top Mentor
              </div>
            </div>

            {/* Content */}
            <div className="animate-fade-in">
              <Badge variant="secondary" className="mb-4">⭐ Industry Expert</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                {mentor.name}
              </h1>
              <p className="mt-3 text-xl text-muted-foreground">{mentor.role}</p>
              <p className="mt-1 text-sm font-medium text-primary">{mentor.company}</p>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground max-w-xl">
                {mentor.tagline}
              </p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Experience", value: mentor.experience },
                  { label: "Students Mentored", value: mentor.students },
                  { label: "Projects Completed", value: mentor.projects },
                  { label: "Rating", value: `⭐ ${mentor.rating.toFixed(1)}` },
                  { label: "Languages", value: mentor.languages },
                  { label: "Availability", value: mentor.availability },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border border-border bg-card px-4 py-3">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" className="transition-transform hover:-translate-y-0.5">
                  Book Free Career Call
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="transition-transform hover:-translate-y-0.5"
                >
                  <a href={mentor.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4" /> Follow on LinkedIn
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="max-w-[700px]">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">About {mentor.name.split(" ")[0]}</h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
              {mentor.about.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERTISE */}
      <section className="py-20 lg:py-28 bg-muted/30 border-y border-border">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Areas of Expertise</h2>
          <p className="mt-3 text-muted-foreground">The craft, tools, and disciplines shaping every mentorship session.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {mentor.expertise.map((skill: string) => (
              <span
                key={skill}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CAREER TIMELINE */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Career Timeline</h2>
          <div className="mt-10 max-w-3xl">
            <ol className="relative border-l border-border pl-8 space-y-8">
              {mentor.timeline.map((t: any, i: number) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[41px] flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-md">
                    <Briefcase className="h-4 w-4" />
                  </span>
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                    <p className="text-xs font-medium text-primary">{t.years}</p>
                    <h3 className="mt-1 font-semibold text-foreground">{t.role}</h3>
                    <p className="text-sm text-muted-foreground">{t.company}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="py-20 lg:py-28 bg-muted/30 border-y border-border">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Projects</h2>
          <p className="mt-3 text-muted-foreground">Selected work from studio productions and personal explorations.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {mentor.projects_list.map((p: any) => (
              <Card key={p.title} className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-[16/10] overflow-hidden gradient-primary">
                  <div className="absolute inset-0 flex items-center justify-center text-primary-foreground/80 text-5xl font-bold">
                    {p.title.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button size="sm" variant="secondary">View Project</Button>
                  </div>
                </div>
                <CardContent className="p-5">
                  <p className="text-xs font-medium text-primary">{p.software}</p>
                  <h3 className="mt-1 font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Tools & Software</h2>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {mentor.tools.map((t: string) => (
              <div
                key={t}
                className="rounded-2xl border border-border bg-card p-4 text-center text-sm font-medium text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENT SUCCESS */}
      <section className="py-20 lg:py-28 bg-muted/30 border-y border-border">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Student Success</h2>
          <p className="mt-3 text-muted-foreground">Real words from learners who trained with {mentor.name.split(" ")[0]}.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {mentor.testimonials.map((t: any) => (
              <Card key={t.name} className="transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                      {t.name.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES TAUGHT */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Courses Taught</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mentor.courses.map((c: any) => (
              <Card key={c.title} className="group transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground">{c.title}</h3>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {c.duration}</p>
                    <p className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" /> {c.level}</p>
                    <p className="flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /> {c.projects} projects</p>
                  </div>
                  <Button asChild size="sm" className="mt-5 w-full">
                    <Link to="/courses">Enroll</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="py-20 lg:py-28 bg-muted/30 border-y border-border">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Achievements</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {mentor.achievements.map((a: any) => {
              const Icon = a.icon;
              return (
                <div
                  key={a.label}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <p className="mt-3 text-sm font-semibold text-foreground">{a.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="mt-8 space-y-3">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="rounded-2xl border border-border bg-card px-5 shadow-sm"
                >
                  <AccordionTrigger className="text-base font-medium hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="gradient-hero border-t border-border py-20 lg:py-28">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Ready to Learn from {mentor.name.split(" ")[0]}?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Start building production-ready 3D skills with personal mentorship from an industry expert.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" className="transition-transform hover:-translate-y-0.5">
              Book Free Career Call
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/courses">
                Explore Courses <CheckCircle2 className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MentorProfile;

import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Clock, BarChart2, CheckCircle, Award, Users, FileText, Briefcase, Star,
  Download, MessageCircle, Play, IndianRupee, Globe, Video, Trophy,
  Sparkles, Target, Rocket, Heart, Instagram, Linkedin, ChevronDown,
  GraduationCap, Calendar, Infinity as InfinityIcon, BookOpen, ShieldCheck,
  TrendingUp, MonitorPlay, MessagesSquare, BadgeCheck,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { coursesCatalog, type CatalogCourse } from "@/data/coursesCatalog";

/* ---------------- Static content per page (rich, generic-friendly) ---------------- */

const outcomes = [
  { icon: Rocket, title: "Build Real Projects", desc: "Ship 6–8 portfolio-grade projects from brief to delivery." },
  { icon: Briefcase, title: "Professional Portfolio", desc: "Curated case studies tailored for top recruiters." },
  { icon: Sparkles, title: "Industry Tools", desc: "Hands-on with the exact tools used by hiring teams." },
  { icon: FileText, title: "Live Case Studies", desc: "Solve briefs from real brands and startups." },
  { icon: Heart, title: "Career Mentorship", desc: "1:1 reviews, weekly office hours, and feedback loops." },
  { icon: Trophy, title: "Become Job Ready", desc: "Mock interviews and a placement roadmap." },
];

const highlights = [
  { icon: MonitorPlay, label: "Live Classes" },
  { icon: InfinityIcon, label: "Lifetime Access" },
  { icon: FileText, label: "Assignments" },
  { icon: Target, label: "Placement Support" },
  { icon: MessagesSquare, label: "Mock Interviews" },
  { icon: Users, label: "Industry Mentorship" },
  { icon: Globe, label: "Community Access" },
  { icon: BadgeCheck, label: "Certificate" },
];

const skillsByCategory: Record<string, string[]> = {
  "Design": ["UX Research", "Wireframing", "User Flows", "Figma", "Design Systems", "Prototyping", "Usability Testing", "Portfolio Design"],
  "3D Design": ["Blender", "Modeling", "Texturing", "Lighting", "Rendering", "Animation", "Sculpting", "Composition"],
  "Marketing": ["SEO", "Meta Ads", "Google Ads", "Funnels", "Analytics", "Copywriting", "Email Marketing", "Branding"],
  "Data": ["Excel", "SQL", "Python", "Power BI", "Tableau", "Statistics", "Dashboards", "Storytelling"],
};

const curriculumByCategory: Record<string, { title: string; lessons: string[] }[]> = {
  "Design": [
    { title: "Design Foundations", lessons: ["Color & Typography", "Layout Principles", "Visual Hierarchy", "Gestalt Laws"] },
    { title: "UX Research", lessons: ["User Interviews", "Personas", "Journey Maps", "Competitive Audits"] },
    { title: "Wireframing", lessons: ["Low-fi Sketches", "Information Architecture", "User Flows", "Flow Reviews"] },
    { title: "UI Design", lessons: ["Components", "Patterns", "Mobile First", "Accessibility"] },
    { title: "Design Systems", lessons: ["Tokens", "Auto-layout", "Variants", "Documentation"] },
    { title: "Prototyping", lessons: ["Micro-interactions", "Smart Animate", "Handoff", "Testing"] },
    { title: "Portfolio", lessons: ["Case Study Writing", "Behance/Dribbble", "Personal Site", "Storytelling"] },
    { title: "Placement Preparation", lessons: ["Resume", "LinkedIn", "Mock Interviews", "Salary Negotiation"] },
  ],
  "3D Design": [
    { title: "Blender Foundations", lessons: ["Interface", "Navigation", "Primitives", "Shortcuts"] },
    { title: "Modeling", lessons: ["Hard Surface", "Topology", "Booleans", "Modifiers"] },
    { title: "Texturing & Materials", lessons: ["PBR", "UV Unwrap", "Substance", "Procedurals"] },
    { title: "Lighting & Rendering", lessons: ["HDRI", "Cycles vs Eevee", "Compositing", "Optimization"] },
    { title: "Animation", lessons: ["Keyframes", "Rigging", "Walk Cycles", "Camera Moves"] },
    { title: "Sculpting", lessons: ["Dynamic Topology", "Brushes", "Detail Pass", "Retopology"] },
    { title: "Portfolio Reels", lessons: ["Shot List", "Editing", "Color", "Showreel"] },
    { title: "Placement Preparation", lessons: ["Resume", "ArtStation", "Studio Pitch", "Mock Interviews"] },
  ],
  "Marketing": [
    { title: "Marketing Foundations", lessons: ["STP", "Funnels", "Channels", "Metrics"] },
    { title: "SEO", lessons: ["Keyword Research", "On-page", "Technical", "Link Building"] },
    { title: "Performance Ads", lessons: ["Meta Ads", "Google Ads", "Creative Testing", "Scaling"] },
    { title: "Social Media", lessons: ["Instagram", "YouTube", "Content Calendars", "Community"] },
    { title: "Analytics", lessons: ["GA4", "Attribution", "Dashboards", "Reporting"] },
    { title: "Email & CRM", lessons: ["Lifecycle", "Automations", "Segmentation", "Deliverability"] },
    { title: "Portfolio", lessons: ["Case Studies", "Audits", "Decks", "Personal Brand"] },
    { title: "Placement Preparation", lessons: ["Resume", "LinkedIn", "Mock Interviews", "Negotiation"] },
  ],
  "Data": [
    { title: "Data Foundations", lessons: ["Excel", "Statistics", "Spreadsheets", "Data Cleaning"] },
    { title: "SQL", lessons: ["Joins", "Window Functions", "CTEs", "Performance"] },
    { title: "Python for Data", lessons: ["Pandas", "NumPy", "Matplotlib", "Notebooks"] },
    { title: "Visualization", lessons: ["Power BI", "Tableau", "Storytelling", "Dashboards"] },
    { title: "Business Analytics", lessons: ["KPIs", "Cohorts", "Forecasting", "AB Tests"] },
    { title: "Case Studies", lessons: ["E-commerce", "SaaS", "Fintech", "Marketing"] },
    { title: "Portfolio", lessons: ["Kaggle", "GitHub", "Notion Case Studies", "Personal Site"] },
    { title: "Placement Preparation", lessons: ["Resume", "LinkedIn", "Mock Interviews", "Negotiation"] },
  ],
};

const journey = [
  { label: "Enrollment", icon: GraduationCap },
  { label: "Foundation", icon: BookOpen },
  { label: "Projects", icon: Briefcase },
  { label: "Portfolio", icon: Sparkles },
  { label: "Mock Interviews", icon: MessagesSquare },
  { label: "Placement Support", icon: Target },
  { label: "Certification", icon: Award },
];

const projects = [
  { name: "Food Delivery App", difficulty: "Intermediate", tools: "Figma, Protopie" },
  { name: "Banking Dashboard", difficulty: "Advanced", tools: "Figma, Data Viz" },
  { name: "Travel Booking Platform", difficulty: "Intermediate", tools: "Figma, Auto-layout" },
  { name: "E-commerce App", difficulty: "Intermediate", tools: "Figma, Design Systems" },
  { name: "Healthcare Dashboard", difficulty: "Advanced", tools: "Figma, Accessibility" },
  { name: "Social Media Redesign", difficulty: "Beginner", tools: "Figma, Prototyping" },
];

const successStories = [
  { name: "Aarav Singh", before: "BBA Graduate", after: "UI Designer", company: "Razorpay", initials: "AS" },
  { name: "Ishita Mehta", before: "Self-taught Hobbyist", after: "Product Designer", company: "Swiggy", initials: "IM" },
  { name: "Rohan Patel", before: "Mechanical Engineer", after: "UX Designer", company: "Flipkart", initials: "RP" },
  { name: "Sneha Iyer", before: "Career Switcher", after: "Visual Designer", company: "Zomato", initials: "SI" },
];

const placementPerks = [
  "Resume Building", "Portfolio Reviews", "LinkedIn Optimization",
  "Mock Interviews", "Job Referrals", "Hiring Partner Access", "Career Roadmap",
];

const hiringPartners = ["Google", "Amazon", "Microsoft", "Adobe", "Flipkart", "Swiggy", "Razorpay", "TCS", "Infosys", "Accenture"];

const faqs = [
  { q: "Who is this course for?", a: "Students, working professionals, freelancers, and career-switchers who want a job-ready skill backed by mentorship and placement support." },
  { q: "Do I need prior experience?", a: "No prior experience required. We start from the fundamentals and progressively move to advanced, industry-grade work." },
  { q: "Will I get a certificate?", a: "Yes. You receive a Slate Academy verified certificate on successful completion of projects and assessments." },
  { q: "Is placement guaranteed?", a: "We provide structured placement support: mock interviews, hiring partner access, and referrals. Outcomes depend on individual performance." },
  { q: "How are classes conducted?", a: "Live, online classes with our mentors, complemented by recordings, assignments, and 1:1 reviews." },
  { q: "Will recordings be available?", a: "Yes, every session is recorded and accessible inside your dashboard for lifetime revisits." },
];

const priceByLevel: Record<string, number> = { Beginner: 24999, Intermediate: 34999, Advanced: 44999 };

/* ---------------- Component ---------------- */

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const course: CatalogCourse | undefined = useMemo(
    () => coursesCatalog.find((c) => c.id === id),
    [id]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
          <p className="text-slate-600 mb-8">The course you're looking for doesn't exist.</p>
          <Link to="/courses"><Button>Back to Courses</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const price = priceByLevel[course.level] ?? 29999;
  const original = Math.round(price * 1.5);
  const discount = Math.round(((original - price) / original) * 100);
  const skills = skillsByCategory[course.category] ?? [];
  const curriculum = curriculumByCategory[course.category] ?? curriculumByCategory["Design"];
  const related = coursesCatalog.filter((c) => c.id !== course.id).slice(0, 4);

  const enrollHref = `/checkout/${course.id}`;
  const goEnroll = () => navigate(enrollHref);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ============== HERO ============== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1020] via-[#1E2BE6]/90 to-[#3A1C71] text-white">
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #F58220 0, transparent 40%), radial-gradient(circle at 80% 30%, #1E2BE6 0, transparent 45%)" }} />
        <div className="container mx-auto px-4 py-12 lg:py-20 relative">
          <div className="flex items-center gap-2 text-xs text-white/70 mb-6">
            <Link to="/" className="hover:text-white">Home</Link><span>/</span>
            <Link to="/courses" className="hover:text-white">Courses</Link><span>/</span>
            <span className="text-white truncate">{course.title}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="bg-[#F58220] hover:bg-[#F58220] text-white mb-5 px-3 py-1">{course.category}</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
                {course.title}
              </h1>
              <p className="text-lg text-white/80 mb-8 max-w-xl">{course.subtitle}</p>

              <div className="flex flex-wrap gap-x-6 gap-y-3 mb-8 text-sm">
                <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-[#F58220] text-[#F58220]" /> 4.9 Rating</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> 1,200+ Students</span>
                <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> 50+ Hiring Partners</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Placement Support</span>
                <span className="flex items-center gap-1.5"><Award className="h-4 w-4" /> Certificate</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" onClick={goEnroll} className="bg-[#F58220] hover:bg-[#d96f15] text-white h-14 px-8 text-base font-semibold shadow-lg shadow-orange-500/30">
                  <Play className="h-5 w-5 mr-2" /> Enroll Now
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white hover:text-[#1E2BE6] h-14 px-8 text-base bg-white/5">
                  <Download className="h-5 w-5 mr-2" /> Download Syllabus
                </Button>
              </div>
            </motion.div>

            {/* Right – preview card */}
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <Card className="overflow-hidden border-0 shadow-2xl bg-white text-slate-900 rounded-3xl">
                <div className="relative aspect-video">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-white/95 flex items-center justify-center shadow-xl">
                      <Play className="h-7 w-7 text-[#1E2BE6] ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { icon: Clock, label: "Duration", val: course.duration },
                    { icon: BarChart2, label: "Level", val: course.level },
                    { icon: Globe, label: "Language", val: "English + Hindi" },
                    { icon: Video, label: "Mode", val: "Online Live" },
                    { icon: Award, label: "Certificate", val: "Yes, Verified" },
                    { icon: Briefcase, label: "Job Assistance", val: "Included" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-slate-600"><row.icon className="h-4 w-4 text-[#1E2BE6]" /> {row.label}</span>
                      <span className="font-semibold">{row.val}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t flex items-baseline gap-2">
                    <IndianRupee className="h-5 w-5 text-[#1E2BE6]" />
                    <span className="text-3xl font-bold text-[#1E2BE6]">{price.toLocaleString("en-IN")}</span>
                    <span className="text-slate-400 line-through text-sm">₹{original.toLocaleString("en-IN")}</span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{discount}% OFF</Badge>
                  </div>
                  <Button onClick={goEnroll} className="w-full h-12 bg-[#1E2BE6] hover:bg-[#1923b8]">Enroll Now</Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============== OUTCOMES ============== */}
      <Section title="What You'll Achieve" subtitle="Tangible outcomes by the end of the program">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {outcomes.map((o) => (
            <Card key={o.title} className="p-6 border border-slate-100 hover:border-[#1E2BE6]/40 hover:shadow-xl transition-all rounded-2xl">
              <div className="h-12 w-12 rounded-xl bg-[#1E2BE6]/10 text-[#1E2BE6] flex items-center justify-center mb-4">
                <o.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-1">{o.title}</h3>
              <p className="text-sm text-slate-600">{o.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ============== HIGHLIGHTS ============== */}
      <Section bg="muted" title="Course Highlights" subtitle="Everything packed into one career program">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map((h) => (
            <Card key={h.label} className="p-5 text-center border border-slate-100 rounded-2xl hover:-translate-y-1 transition-transform">
              <div className="h-12 w-12 mx-auto rounded-xl bg-gradient-to-br from-[#1E2BE6] to-[#F58220] text-white flex items-center justify-center mb-3">
                <h.icon className="h-6 w-6" />
              </div>
              <p className="font-medium text-sm">{h.label}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ============== SKILLS ============== */}
      <Section title="Skills You'll Learn" subtitle="Industry-relevant skills, mapped to job descriptions">
        <div className="flex flex-wrap gap-3">
          {skills.map((s) => (
            <span key={s} className="px-4 py-2 rounded-full bg-[#1E2BE6]/5 text-[#1E2BE6] font-medium text-sm border border-[#1E2BE6]/20 hover:bg-[#1E2BE6] hover:text-white transition-colors">
              {s}
            </span>
          ))}
        </div>
      </Section>

      {/* ============== CURRICULUM ============== */}
      <Section bg="muted" title="Curriculum" subtitle={`${curriculum.length} modules • ${curriculum.reduce((a, m) => a + m.lessons.length, 0)} lessons • ${course.duration}`}>
        <Accordion type="single" collapsible defaultValue="m-0" className="space-y-3">
          {curriculum.map((m, i) => (
            <AccordionItem key={m.title} value={`m-${i}`} className="bg-white rounded-2xl border border-slate-100 px-5 shadow-sm">
              <AccordionTrigger className="hover:no-underline py-5">
                <div className="flex items-center gap-4 text-left">
                  <div className="h-10 w-10 rounded-xl bg-[#1E2BE6]/10 text-[#1E2BE6] font-bold flex items-center justify-center">{i + 1}</div>
                  <div>
                    <p className="font-semibold text-base">{m.title}</p>
                    <p className="text-xs text-slate-500">{m.lessons.length} lessons • ~{2 + i} hrs</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 pl-14 pb-4">
                  {m.lessons.map((l) => (
                    <li key={l} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle className="h-4 w-4 text-green-600" /> {l}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      {/* ============== JOURNEY TIMELINE ============== */}
      <Section title="Your Learning Journey" subtitle="A clear path from day one to placement">
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-7 lg:gap-3 lg:overflow-visible">
            {journey.map((step, i) => (
              <div key={step.label} className="flex-shrink-0 w-44 lg:w-auto text-center">
                <div className="relative">
                  <div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-br from-[#1E2BE6] to-[#F58220] text-white flex items-center justify-center shadow-lg">
                    <step.icon className="h-6 w-6" />
                  </div>
                  {i < journey.length - 1 && (
                    <div className="hidden lg:block absolute top-7 left-[calc(50%+28px)] w-[calc(100%-56px)] h-0.5 bg-gradient-to-r from-[#1E2BE6] to-[#F58220]" />
                  )}
                </div>
                <p className="mt-3 text-sm font-medium">{step.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============== PROJECTS ============== */}
      <Section bg="muted" title="Projects You'll Build" subtitle="Real briefs. Real deliverables. Real portfolio.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <Card key={p.name} className="overflow-hidden border border-slate-100 rounded-2xl group hover:shadow-xl transition-all">
              <div className="aspect-video bg-gradient-to-br from-[#1E2BE6]/10 via-purple-100 to-[#F58220]/10 flex items-center justify-center text-[#1E2BE6]">
                <Briefcase className="h-12 w-12 opacity-50 group-hover:scale-110 transition-transform" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold mb-2">{p.name}</h3>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="px-2 py-1 rounded-full bg-slate-100">{p.difficulty}</span>
                  <span>{p.tools}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ============== MENTOR ============== */}
      <Section title="Meet Your Mentor" subtitle="Learn directly from industry leaders">
        <Card className="p-6 md:p-10 rounded-3xl border border-slate-100 shadow-lg">
          <div className="grid md:grid-cols-[auto,1fr] gap-8 items-center">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-3xl bg-gradient-to-br from-[#1E2BE6] to-[#F58220] text-white flex items-center justify-center text-5xl font-bold mx-auto">
              SA
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1">Sunny Arora</h3>
              <p className="text-[#1E2BE6] font-medium mb-3">Senior Design Lead • 10+ years experience</p>
              <p className="text-slate-600 mb-5">
                A multidisciplinary practitioner who has led design and creative teams across consumer and B2B products. Passionate about mentoring the next generation of Indian creators.
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {["Google", "Adobe", "Razorpay", "Swiggy"].map((c) => (
                  <Badge key={c} variant="secondary" className="bg-slate-100">{c}</Badge>
                ))}
              </div>
              <div className="flex gap-3">
                <Button asChild className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 hover:opacity-90">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><Instagram className="h-4 w-4 mr-2" /> Instagram</a>
                </Button>
                <Button asChild className="bg-[#0A66C2] hover:bg-[#084e96]">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4 mr-2" /> LinkedIn</a>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* ============== SUCCESS STORIES ============== */}
      <Section bg="muted" title="Student Success Stories" subtitle="Careers transformed at Slate Academy">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {successStories.map((s) => (
            <Card key={s.name} className="p-6 rounded-2xl border border-slate-100 text-center hover:shadow-xl transition-all">
              <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-[#1E2BE6] to-[#F58220] text-white font-bold text-xl flex items-center justify-center mb-3">
                {s.initials}
              </div>
              <h4 className="font-semibold">{s.name}</h4>
              <p className="text-xs text-slate-500 mt-1">{s.before} → <span className="text-[#1E2BE6] font-medium">{s.after}</span></p>
              <p className="text-xs text-slate-700 mt-2 font-medium">@ {s.company}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ============== PORTFOLIO SHOWCASE ============== */}
      <Section title="Portfolio Showcase" subtitle="A glimpse of recent student work">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-gradient-to-br from-[#1E2BE6]/10 via-purple-100 to-[#F58220]/10 hover:scale-[1.02] transition-transform cursor-pointer flex items-center justify-center text-[#1E2BE6]/50">
              <Sparkles className="h-8 w-8" />
            </div>
          ))}
        </div>
      </Section>

      {/* ============== PLACEMENT SUPPORT ============== */}
      <Section bg="dark" title="Placement Support" subtitle="A complete career partnership, not just a course">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {placementPerks.map((p) => (
            <div key={p} className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-white">
              <CheckCircle className="h-6 w-6 text-[#F58220] mb-2" />
              <p className="font-medium">{p}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ============== HIRING PARTNERS ============== */}
      <Section title="Hiring Partners" subtitle="Our students work at the companies you love">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {hiringPartners.map((p) => (
            <div key={p} className="h-20 rounded-2xl border border-slate-100 flex items-center justify-center font-bold text-slate-700 hover:border-[#1E2BE6] hover:text-[#1E2BE6] transition-colors">
              {p}
            </div>
          ))}
        </div>
      </Section>

      {/* ============== CERTIFICATE ============== */}
      <Section bg="muted" title="Earn Your Certificate" subtitle="A verified credential to share with recruiters">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <Card className="aspect-[4/3] rounded-3xl border-4 border-double border-[#1E2BE6]/30 bg-gradient-to-br from-white to-slate-50 p-8 flex flex-col items-center justify-center text-center shadow-2xl">
            <Award className="h-16 w-16 text-[#F58220] mb-4" />
            <p className="text-xs uppercase tracking-widest text-slate-500">Certificate of Completion</p>
            <h3 className="text-2xl font-bold mt-3 mb-1">{course.title}</h3>
            <p className="text-sm text-slate-600 mt-4">Awarded to <span className="font-semibold">[Student Name]</span></p>
            <p className="mt-6 text-xs text-slate-500">Slate Academy • Verified Credential</p>
          </Card>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Industry-Recognized Certification</h3>
            <p className="text-slate-600">Complete the assessments and final project to unlock your verifiable certificate. Share on LinkedIn, in your resume, and with recruiters.</p>
            <ul className="space-y-2">
              {["Unique verification ID", "Shareable on LinkedIn", "Recognized by hiring partners", "Lifetime validity"].map((l) => (
                <li key={l} className="flex items-center gap-2 text-slate-700"><CheckCircle className="h-5 w-5 text-green-600" /> {l}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ============== PRICING ============== */}
      <Section title="Investment in Your Future" subtitle="Flexible plans, transparent pricing" id="pricing">
        <Card className="max-w-2xl mx-auto rounded-3xl border-2 border-[#1E2BE6] shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#1E2BE6] to-[#F58220] text-white text-center py-3 text-sm font-semibold">
            🔥 Limited Time Offer • Save {discount}%
          </div>
          <div className="p-8 md:p-10">
            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-slate-400 line-through text-xl">₹{original.toLocaleString("en-IN")}</span>
                <span className="text-5xl font-bold text-[#1E2BE6] flex items-center"><IndianRupee className="h-8 w-8" />{price.toLocaleString("en-IN")}</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">or 3 EMIs of ₹{Math.round(price / 3).toLocaleString("en-IN")} • Registration fee ₹999</p>
            </div>
            <ul className="space-y-3 mb-8">
              {["Full course access (lifetime)", "Live mentorship sessions", "All projects & assignments", "Verified certificate", "Placement support", "Community access"].map((l) => (
                <li key={l} className="flex items-center gap-3 text-slate-700"><CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" /> {l}</li>
              ))}
            </ul>
            <Button onClick={goEnroll} size="lg" className="w-full h-14 bg-[#F58220] hover:bg-[#d96f15] text-base font-semibold">
              Enroll Now <Play className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="ghost" className="w-full mt-2 text-[#1E2BE6]">
              <MessageCircle className="h-4 w-4 mr-2" /> Talk to Counsellor
            </Button>
          </div>
        </Card>
      </Section>

      {/* ============== FAQ ============== */}
      <Section bg="muted" title="Frequently Asked Questions" subtitle="Everything you need to know">
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`} className="bg-white rounded-2xl border border-slate-100 px-5">
                <AccordionTrigger className="text-left hover:no-underline py-5 font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-slate-600 pb-5">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* ============== RELATED ============== */}
      <Section title="Related Courses" subtitle="Continue your learning journey">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {related.map((r) => (
            <Link key={r.id} to={`/courses/${r.id}`} className="group">
              <Card className="overflow-hidden rounded-2xl border border-slate-100 hover:shadow-xl transition-all h-full">
                <div className="aspect-video overflow-hidden">
                  <img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="mb-2 text-xs">{r.category}</Badge>
                  <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-[#1E2BE6] transition-colors">{r.title}</h3>
                  <p className="text-xs text-slate-500 mt-2">{r.duration} • {r.level}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* ============== FINAL CTA ============== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1020] via-[#1E2BE6] to-[#3A1C71] text-white py-20">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #F58220 0, transparent 40%)" }} />
        <div className="container mx-auto px-4 text-center relative">
          <TrendingUp className="h-12 w-12 mx-auto text-[#F58220] mb-5" />
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Start Your Career Journey?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of students building successful careers through Slate Academy.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={goEnroll} size="lg" className="bg-[#F58220] hover:bg-[#d96f15] h-14 px-8 text-base font-semibold">
              Enroll Now <Play className="h-4 w-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white hover:text-[#1E2BE6] h-14 px-8 text-base bg-white/5">
              <MessageCircle className="h-4 w-4 mr-2" /> Talk to Counsellor
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* ============== STICKY MOBILE / DESKTOP ENROLL BAR ============== */}
      {scrolled && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 shadow-2xl"
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{course.title}</p>
              <p className="text-xs text-slate-500">
                <span className="text-[#1E2BE6] font-bold">₹{price.toLocaleString("en-IN")}</span>
                <span className="line-through ml-1">₹{original.toLocaleString("en-IN")}</span>
              </p>
            </div>
            <Button onClick={goEnroll} className="bg-[#F58220] hover:bg-[#d96f15] h-11 px-6 flex-shrink-0">
              Enroll Now
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

/* ---------------- Section helper ---------------- */
const Section = ({
  title, subtitle, children, bg = "white", id,
}: { title: string; subtitle?: string; children: React.ReactNode; bg?: "white" | "muted" | "dark"; id?: string }) => {
  const bgClass =
    bg === "muted" ? "bg-slate-50" : bg === "dark" ? "bg-gradient-to-br from-[#0B1020] to-[#1E2BE6] text-white" : "bg-white";
  return (
    <section id={id} className={`${bgClass} py-16 md:py-24`}>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{title}</h2>
          {subtitle && <p className={bg === "dark" ? "text-white/70" : "text-slate-600"}>{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
};

export default CourseDetail;

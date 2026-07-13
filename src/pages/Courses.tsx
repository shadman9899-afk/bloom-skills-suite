import { useState, useMemo, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import {
  Clock,
  Search,
  Star,
  Users,
  Briefcase,
  Award,
  ChevronRight,
  SlidersHorizontal,
  X,
  Home,
  Sparkles,
  GraduationCap,
  Zap,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { coursesCatalog, type CatalogCourse, type CourseTag } from "@/data/coursesCatalog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// ─── Metadata enrichment (per course) ────────────────────────────────────────
type CourseMeta = {
  rating: number;
  students: number;
  projects: number;
  software: string[];
  careers: string[];
  mode: "Online" | "Offline" | "Hybrid";
  schedule: "Weekday" | "Weekend" | "Flexible";
  certificate: boolean;
  placement: boolean;
  popularity: number; // for sorting
  newness: number; // for sorting
};

const softwareByCategory: Record<string, string[]> = {
  Design: ["Figma", "Photoshop", "Illustrator", "After Effects"],
  "3D Design": ["Blender", "Substance", "Unreal"],
  Marketing: ["Google Ads", "Meta Ads", "GA4", "Semrush"],
  Data: ["Excel", "SQL", "Python", "Tableau"],
};

const careersByCategory: Record<string, string[]> = {
  Design: ["UI Designer", "UX Designer", "Product Designer", "Brand Designer"],
  "3D Design": ["3D Artist", "Product Visualizer", "Motion Designer"],
  Marketing: ["Performance Marketer", "SEO Specialist", "Growth Manager"],
  Data: ["Data Analyst", "BI Analyst", "Insights Manager"],
};

// Deterministic pseudo-random so numbers stay stable per course id
const seeded = (str: string, min: number, max: number) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return min + (h % (max - min + 1));
};

const getMeta = (c: CatalogCourse): CourseMeta => ({
  rating: 4.6 + (seeded(c.id, 0, 3) / 10),
  students: seeded(c.id + "s", 480, 3200),
  projects: seeded(c.id + "p", 4, 12),
  software: softwareByCategory[c.category] ?? [],
  careers: careersByCategory[c.category] ?? [],
  mode: (["Online", "Hybrid", "Offline"] as const)[seeded(c.id + "m", 0, 2)],
  schedule: (["Weekday", "Weekend", "Flexible"] as const)[seeded(c.id + "w", 0, 2)],
  certificate: true,
  placement: true,
  popularity: seeded(c.id + "pop", 60, 100),
  newness: seeded(c.id + "n", 1, 100),
});

// ─── Filter chips ────────────────────────────────────────────────────────────
const categoryChips = ["All", "Design", "3D Design", "Marketing", "Data"] as const;
const durationBuckets = ["Any", "0-4 weeks", "5-8 weeks", "9+ weeks"] as const;
const levels = ["All", "Beginner", "Intermediate", "Advanced"] as const;
const modes = ["Any", "Online", "Offline", "Hybrid"] as const;
const schedules = ["Any", "Weekday", "Weekend", "Flexible"] as const;

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
  { value: "duration-asc", label: "Shortest Duration" },
  { value: "duration-desc", label: "Longest Duration" },
  { value: "alpha", label: "Alphabetical" },
];

const tagStyles: Record<CourseTag, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20",
  Advanced: "bg-violet-500/10 text-violet-700 ring-1 ring-violet-500/20",
  "Quick Skill": "bg-amber-500/15 text-amber-700 ring-1 ring-amber-500/30",
};

// ─── Course Card ─────────────────────────────────────────────────────────────
const CourseCard = memo(({ course, index }: { course: CatalogCourse; index: number }) => {
  const meta = useMemo(() => getMeta(course), [course]);
  const isFirstRow = index < 4;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus-within:ring-2 focus-within:ring-primary">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={course.image}
          alt={course.title}
          width={1024}
          height={640}
          loading={isFirstRow ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm bg-background/85 ${tagStyles[course.tag]}`}>
            <GraduationCap className="h-3 w-3" />
            {course.tag}
          </span>
        </div>
        <div className="absolute top-3 right-3 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur-sm">
          {course.category}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold text-foreground leading-snug line-clamp-2 min-h-[2.75rem]">
          {course.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {course.subtitle}
        </p>

        {/* Stats row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 font-medium text-foreground">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {meta.rating.toFixed(1)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {meta.students.toLocaleString()}+
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {course.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />
            {meta.projects} projects
          </span>
        </div>

        {/* Software */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {meta.software.slice(0, 3).map((s) => (
            <span key={s} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {s}
            </span>
          ))}
        </div>

        {/* Careers */}
        <div className="mt-3">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground/80 font-semibold">Career outcomes</p>
          <p className="mt-1 text-xs text-foreground/80 line-clamp-1">
            {meta.careers.join(" · ")}
          </p>
        </div>

        {/* Trust badges */}
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-2 py-0.5 text-primary font-medium">
            <Award className="h-3 w-3" /> Certificate
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-secondary font-medium">
            <Briefcase className="h-3 w-3" /> Placement
          </span>
        </div>

        {/* CTAs */}
        <div className="mt-auto pt-5 flex flex-col gap-2">
          <Button asChild className="w-full font-semibold">
            <Link to={`/courses/${course.id}`} aria-label={`Explore ${course.title}`}>
              Explore Course
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs">
              <Link to={`/courses/${course.id}#curriculum`}>View Curriculum</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-xs text-secondary hover:text-secondary">
              <Link to="/support">Free Counselling</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
});
CourseCard.displayName = "CourseCard";

// ─── Filters Panel (reused in sidebar sheet + inline) ────────────────────────
const FiltersPanel = ({
  level, setLevel,
  duration, setDuration,
  mode, setMode,
  schedule, setSchedule,
  certificate, setCertificate,
  placement, setPlacement,
  onReset,
}: any) => (
  <div className="space-y-6">
    <FilterGroup title="Difficulty">
      <ChipRow options={levels as readonly string[]} value={level} onChange={setLevel} />
    </FilterGroup>
    <FilterGroup title="Duration">
      <ChipRow options={durationBuckets as readonly string[]} value={duration} onChange={setDuration} />
    </FilterGroup>
    <FilterGroup title="Mode">
      <ChipRow options={modes as readonly string[]} value={mode} onChange={setMode} />
    </FilterGroup>
    <FilterGroup title="Schedule">
      <ChipRow options={schedules as readonly string[]} value={schedule} onChange={setSchedule} />
    </FilterGroup>
    <FilterGroup title="Included">
      <div className="flex flex-col gap-2 text-sm">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={certificate} onChange={(e) => setCertificate(e.target.checked)} className="rounded border-border" />
          <Award className="h-4 w-4 text-primary" /> Certificate
        </label>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={placement} onChange={(e) => setPlacement(e.target.checked)} className="rounded border-border" />
          <Briefcase className="h-4 w-4 text-secondary" /> Placement Support
        </label>
      </div>
    </FilterGroup>
    <Button variant="outline" className="w-full" onClick={onReset}>
      <X className="mr-1 h-4 w-4" /> Reset filters
    </Button>
  </div>
);

const FilterGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h4>
    {children}
  </div>
);

const ChipRow = ({ options, value, onChange }: { options: readonly string[]; value: string; onChange: (v: string) => void }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((o) => (
      <button
        key={o}
        onClick={() => onChange(o)}
        aria-pressed={value === o}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          value === o
            ? "bg-primary text-primary-foreground shadow-sm"
            : "bg-secondary/10 text-foreground hover:bg-secondary/20"
        }`}
      >
        {o}
      </button>
    ))}
  </div>
);

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const faqs = [
  { q: "Do I get a certificate after completing the course?", a: "Yes, every Slate Academy course includes an industry-recognized certificate on completion, verifiable via a unique link." },
  { q: "Is placement support really guaranteed?", a: "We offer dedicated placement support: portfolio reviews, mock interviews, and direct referrals to 96+ hiring partners across India." },
  { q: "Are the classes live or recorded?", a: "Most cohorts are live with recordings available. Weekend and weekday batches are offered." },
  { q: "Can I pay in EMI?", a: "Yes, we support no-cost EMI on all major cards and Bajaj Finserv." },
  { q: "Is there a free counselling session?", a: "Absolutely. Book a free 1-on-1 session with our admissions team to pick the right course for your career." },
];

// ─── Main Page ───────────────────────────────────────────────────────────────
const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "All";
  const normalized = categoryChips.find((c) => c.toLowerCase() === initialCat.toLowerCase()) ?? "All";

  const [category, setCategory] = useState<string>(normalized);
  const [level, setLevel] = useState<string>("All");
  const [duration, setDuration] = useState<string>("Any");
  const [mode, setMode] = useState<string>("Any");
  const [schedule, setSchedule] = useState<string>("Any");
  const [certificate, setCertificate] = useState(false);
  const [placement, setPlacement] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recommended");

  const handleCategoryChange = useCallback((cat: string) => {
    setCategory(cat);
    if (cat === "All") setSearchParams({});
    else setSearchParams({ category: cat.toLowerCase() });
  }, [setSearchParams]);

  const enriched = useMemo(
    () => coursesCatalog.map((c) => ({ course: c, meta: getMeta(c) })),
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = enriched.filter(({ course, meta }) => {
      if (category !== "All" && course.category !== category) return false;
      if (level !== "All" && course.level !== level) return false;
      if (mode !== "Any" && meta.mode !== mode) return false;
      if (schedule !== "Any" && meta.schedule !== schedule) return false;
      if (certificate && !meta.certificate) return false;
      if (placement && !meta.placement) return false;
      if (duration !== "Any") {
        const weeks = parseInt(course.duration, 10) || 0;
        if (duration === "0-4 weeks" && weeks > 4) return false;
        if (duration === "5-8 weeks" && (weeks < 5 || weeks > 8)) return false;
        if (duration === "9+ weeks" && weeks < 9) return false;
      }
      if (q) {
        const hay = [
          course.title,
          course.subtitle,
          course.category,
          course.level,
          ...meta.software,
          ...meta.careers,
        ].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const getWeeks = (d: string) => parseInt(d, 10) || 0;
    switch (sort) {
      case "popular":
        list = [...list].sort((a, b) => b.meta.popularity - a.meta.popularity); break;
      case "newest":
        list = [...list].sort((a, b) => b.meta.newness - a.meta.newness); break;
      case "rating":
        list = [...list].sort((a, b) => b.meta.rating - a.meta.rating); break;
      case "duration-asc":
        list = [...list].sort((a, b) => getWeeks(a.course.duration) - getWeeks(b.course.duration)); break;
      case "duration-desc":
        list = [...list].sort((a, b) => getWeeks(b.course.duration) - getWeeks(a.course.duration)); break;
      case "alpha":
        list = [...list].sort((a, b) => a.course.title.localeCompare(b.course.title)); break;
    }
    return list;
  }, [enriched, category, level, duration, mode, schedule, certificate, placement, search, sort]);

  const activeFilterCount =
    (level !== "All" ? 1 : 0) +
    (duration !== "Any" ? 1 : 0) +
    (mode !== "Any" ? 1 : 0) +
    (schedule !== "Any" ? 1 : 0) +
    (certificate ? 1 : 0) +
    (placement ? 1 : 0);

  const resetAll = () => {
    handleCategoryChange("All");
    setLevel("All");
    setDuration("Any");
    setMode("Any");
    setSchedule("Any");
    setCertificate(false);
    setPlacement(false);
    setSearch("");
    setSort("recommended");
  };

  const trending = enriched
    .slice()
    .sort((a, b) => b.meta.popularity - a.meta.popularity)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="border-b border-border bg-background">
        <div className="container flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">Courses</span>
        </div>
      </nav>

      {/* Compact Hero */}
      <section className="border-b border-border bg-gradient-to-b from-accent/40 to-background">
        <div className="container py-8 lg:py-10">
          <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                <Sparkles className="h-3 w-3" /> {coursesCatalog.length} career-ready courses
              </span>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground lg:text-4xl">
                Build your portfolio. Master industry tools. Launch your career.
              </h1>
              <p className="mt-2 text-sm text-muted-foreground lg:text-base">
                Live cohorts, real projects, and placement support in Design, 3D, Marketing & Data.
              </p>
            </div>

            {/* Trust bar */}
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <li className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-foreground">4.9</span> rating
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">1,200+</span> students
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-secondary" />
                <span className="font-semibold text-foreground">2,500+</span> projects
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Award className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">96</span> hiring partners
              </li>
            </ul>
          </div>

          {/* Search */}
          <div className="relative mt-6 max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search courses, software or careers…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-xl border border-input bg-card pl-11 pr-4 text-sm shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-primary focus:shadow-md"
              aria-label="Search courses"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container flex flex-wrap items-center gap-3 py-3">
          {/* Category chips */}
          <div className="flex flex-1 flex-wrap gap-2" role="group" aria-label="Category filters">
            {categoryChips.map((c) => (
              <button
                key={c}
                onClick={() => handleCategoryChange(c)}
                aria-pressed={category === c}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  category === c
                    ? "bg-foreground text-background shadow-sm"
                    : "border border-border bg-card text-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="hidden text-xs text-muted-foreground sm:inline">Sort</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-9 rounded-lg border border-input bg-card px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Mobile filters trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="mr-1 h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-sm overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersPanel
                    level={level} setLevel={setLevel}
                    duration={duration} setDuration={setDuration}
                    mode={mode} setMode={setMode}
                    schedule={schedule} setSchedule={setSchedule}
                    certificate={certificate} setCertificate={setCertificate}
                    placement={placement} setPlacement={setPlacement}
                    onReset={resetAll}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Content grid: sidebar + courses */}
      <div className="container py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-36 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                Refine results
              </h3>
              <FiltersPanel
                level={level} setLevel={setLevel}
                duration={duration} setDuration={setDuration}
                mode={mode} setMode={setMode}
                schedule={schedule} setSchedule={setSchedule}
                certificate={certificate} setCertificate={setCertificate}
                placement={placement} setPlacement={setPlacement}
                onReset={resetAll}
              />
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {coursesCatalog.length} courses
              </p>
              {(category !== "All" || search || activeFilterCount > 0) && (
                <Button variant="ghost" size="sm" onClick={resetAll} className="h-7 text-xs">
                  <X className="mr-1 h-3.5 w-3.5" /> Clear all
                </Button>
              )}
            </div>

            {filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map(({ course }, i) => (
                  <CourseCard key={course.id} course={course} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-20 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No courses match your filters</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Try widening your search, removing a filter, or browsing our most popular courses below.
                </p>
                <Button onClick={resetAll} className="mt-5">
                  <X className="mr-1 h-4 w-4" /> Reset filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trending / Recommended */}
      <section className="border-t border-border bg-gradient-to-b from-background to-accent/30 py-14">
        <div className="container">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-2.5 py-1 text-[11px] font-semibold text-secondary">
                <Zap className="h-3 w-3" /> Trending now
              </span>
              <h2 className="mt-2 text-2xl font-bold text-foreground lg:text-3xl">Popular this month</h2>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trending.map(({ course }, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border py-14">
        <div className="container max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-foreground lg:text-3xl">Frequently asked</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">Everything you need to know before enrolling.</p>
          <Accordion type="single" collapsible className="mt-8">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-8 text-center shadow-sm sm:flex-row sm:text-left">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">Not sure which course fits you?</h3>
              <p className="mt-1 text-sm text-muted-foreground">Book a free 1-on-1 counselling session with our admissions team.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild>
                <Link to="/support">Book Free Counselling</Link>
              </Button>
              <Button asChild variant="outline" className="border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary">
                <Link to="/support">Download Brochure</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default memo(Courses);

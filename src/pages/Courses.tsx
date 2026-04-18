import { useState, useMemo, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { Clock, Search, Palette, Code, Megaphone, BarChart3, Zap, Sparkles, GraduationCap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { coursesCatalog, type CatalogCourse, type CourseTag } from "@/data/coursesCatalog";

const levels = ["All", "Beginner", "Intermediate", "Advanced"];

const categoryCards = [
  { title: "Design", icon: Palette, color: "from-pink-500 to-red-500", items: ["UI/UX", "Figma", "Motion", "Video", "Branding"] },
  { title: "Coding", icon: Code, color: "from-blue-500 to-indigo-500", items: ["MERN Stack", "Frontend", "Node.js", "Python"] },
  { title: "Marketing", icon: Megaphone, color: "from-orange-500 to-orange-600", items: ["Social Media", "Performance", "SEO", "Digital"] },
  { title: "Data", icon: BarChart3, color: "from-green-500 to-teal-500", items: ["Analytics", "Excel", "SQL"] },
];

const tagStyles: Record<CourseTag, { className: string; Icon: typeof Zap }> = {
  Beginner: { className: "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20", Icon: GraduationCap },
  Advanced: { className: "bg-violet-500/10 text-violet-600 ring-1 ring-violet-500/20", Icon: Sparkles },
  "Quick Skill": { className: "bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/30", Icon: Zap },
};

// ─── Course Card ─────────────────────────────────────────────────────────────
const CourseCard = memo(({ course, index }: { course: CatalogCourse; index: number }) => {
  const isFirstRow = index < 4;
  const tagStyle = tagStyles[course.tag];
  const TagIcon = tagStyle.Icon;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={course.image}
          alt={course.title}
          width={1024}
          height={640}
          loading={isFirstRow ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tagStyle.className} backdrop-blur-sm bg-background/80`}>
            <TagIcon className="h-3 w-3" />
            {course.tag}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur-sm">
          {course.category}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold text-foreground leading-snug line-clamp-2 min-h-[2.75rem]">
          {course.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-1">{course.subtitle}</p>

        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {course.duration}
          </span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <span>{course.level}</span>
        </div>

        <Button variant="link" className="mt-4 h-auto justify-start px-0 font-semibold" asChild>
          <Link to={`/courses/${course.id}`} aria-label={`View details for ${course.title}`}>
            View Course →
          </Link>
        </Button>
      </div>
    </article>
  );
});
CourseCard.displayName = "CourseCard";

// ─── Category Card ───────────────────────────────────────────────────────────
const CategoryCard = memo(
  ({ cat, Icon, color, items, count, isActive, onClick }: {
    cat: string; Icon: any; color: string; items: string[]; count: number; isActive: boolean; onClick: () => void;
  }) => (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-pressed={isActive}
      className={`cursor-pointer relative p-6 rounded-2xl text-white shadow-lg transition-all duration-300 bg-gradient-to-br ${color}
        ${isActive ? "ring-2 ring-white/70 scale-[1.02]" : "opacity-90 hover:opacity-100 hover:scale-[1.01]"}
        h-64 flex flex-col justify-between overflow-hidden`}
    >
      <div>
        <Icon size={26} />
        <h2 className="text-2xl font-bold mt-3">{cat}</h2>
        <p className="text-sm opacity-80 mt-1">{count} {count === 1 ? "Course" : "Courses"}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.slice(0, 4).map((item, i) => (
          <span key={i} className="bg-white/20 text-xs px-2.5 py-1 rounded-full backdrop-blur">{item}</span>
        ))}
      </div>
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />
    </div>
  )
);
CategoryCard.displayName = "CategoryCard";

// ─── Main Page ───────────────────────────────────────────────────────────────
const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = searchParams.get("category") || "All";
  const [category, setCategory] = useState(initialCat.charAt(0).toUpperCase() + initialCat.slice(1));
  const [level, setLevel] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return coursesCatalog.filter((c) => {
      if (category !== "All" && c.category !== category) return false;
      if (level !== "All" && c.level !== level) return false;
      if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.subtitle.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [category, level, search]);

  const getCategoryCount = useCallback(
    (catName: string) => coursesCatalog.filter((c) => c.category === catName).length,
    []
  );

  const handleCategoryChange = useCallback(
    (cat: string) => {
      setCategory(cat);
      if (cat === "All") setSearchParams({});
      else setSearchParams({ category: cat.toLowerCase() });
    },
    [setSearchParams]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-card to-background py-14">
        <div className="container max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> 20 Career-Ready Courses
          </span>
          <h1 className="mt-4 text-3xl font-bold text-foreground lg:text-5xl">
            Explore Slate Academy Courses
          </h1>
          <p className="mt-3 text-muted-foreground lg:text-lg">
            Premium courses in Design, Coding, Marketing, and Data — built to make you job-ready.
          </p>
        </div>
      </section>

      {/* Category Cards */}
      <div className="border-b border-border bg-background">
        <div className="container py-10">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categoryCards.map((cat) => (
              <CategoryCard
                key={cat.title}
                cat={cat.title}
                Icon={cat.icon}
                color={cat.color}
                items={cat.items}
                count={getCategoryCount(cat.title)}
                isActive={category === cat.title}
                onClick={() => handleCategoryChange(cat.title)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container flex flex-wrap items-center gap-4 py-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Search courses"
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Course level filters">
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                aria-pressed={level === l}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                  level === l ? "bg-foreground text-background" : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="container py-12">
        {(category !== "All" || level !== "All" || search) && (
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Showing</span>
            <span className="font-semibold text-foreground">{filtered.length}</span>
            <span>of {coursesCatalog.length} courses</span>
            {(category !== "All" || level !== "All" || search) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { handleCategoryChange("All"); setLevel("All"); setSearch(""); }}
                className="h-6 px-2 text-xs"
              >
                Clear all
              </Button>
            )}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No courses match your filters. Try adjusting them.
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default memo(Courses);

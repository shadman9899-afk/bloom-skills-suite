import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { Clock, BarChart2, Search, Palette, Code, Megaphone, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";

interface CourseRow {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  image_url: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
}

const levels = ["All", "Beginner", "Intermediate", "Advanced"];

const categoryMap: Record<string, string[]> = {
  Design: ["Design"],
  Coding: ["Coding", "Development"],
  Marketing: ["Marketing", "Digital Marketing"],
  Data: ["Data"],
};

const categoryCards = [
  {
    title: "Design",
    icon: Palette,
    color: "from-pink-500 to-red-500",
    items: ["Graphics", "UI/UX", "Motion", "Video Editing", "3D"],
  },
  {
    title: "Coding",
    icon: Code,
    color: "from-blue-500 to-indigo-500",
    items: ["MEAN Stack", "MERN Stack", "Full Stack", "Back End", "NodeJS", "Front End"],
  },
  {
    title: "Marketing",
    icon: Megaphone,
    color: "from-orange-500 to-orange-600",
    items: [
      "Social Media Marketing",
      "Performance Marketing",
      "Content Marketing",
      "Email Marketing",
      "SEO",
      "Marketing Basics",
    ],
  },
  {
    title: "Data",
    icon: BarChart3,
    color: "from-green-500 to-teal-500",
    items: ["Data Analytics", "Excel", "SQL", "Python"],
  },
];

// Helper function to get the best available image URL
const getCourseImageUrl = (course: CourseRow): string => {
  if (course.thumbnail_url) return course.thumbnail_url;
  if (course.image_url) return course.image_url;
  return `https://placehold.co/400x240/1e293b/ffffff?text=${course.category}+Course`;
};

// ─── Optimized Course Card with lazy loading and skeleton ───────────────────
const CourseCard = memo(({ course, index }: { course: CourseRow; index: number }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const isFirstRow = index < 4;

  return (
    <div className="group rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      <div className="relative h-40 rounded-t-xl overflow-hidden bg-muted">
        {/* Skeleton loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-muted to-muted/50 animate-pulse" />
        )}
        <img
          src={getCourseImageUrl(course)}
          alt={course.title}
          width="400"
          height="240"
          className={`h-full w-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          loading={isFirstRow ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute top-3 left-3 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          {course.category}
        </div>
      </div>

      <div className="p-5">
        <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
          {course.level}
        </span>
        <h3 className="mt-3 font-semibold text-foreground line-clamp-1">{course.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <BarChart2 className="h-3.5 w-3.5" />
            {course.level}
          </span>
        </div>
        <Button variant="link" className="mt-3 px-0" asChild>
          <Link to={`/courses/${course.id}`} aria-label={`View details for ${course.title}`}>
            View Course →
          </Link>
        </Button>
      </div>
    </div>
  );
});

CourseCard.displayName = "CourseCard";

// ─── Category Card ────────────────────────────────────────────────────────────
const CategoryCard = memo(
  ({
    cat,
    Icon,
    color,
    items,
    count,
    isActive,
    onClick,
  }: {
    cat: string;
    Icon: any;
    color: string;
    items: string[];
    count: number;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <div
      onClick={onClick}
      className={`cursor-pointer relative p-6 rounded-2xl text-white shadow-lg transition-all duration-300
        bg-gradient-to-br ${color}
        ${isActive ? "ring-2 ring-white/70 scale-[1.03]" : "opacity-90 hover:opacity-100"}
        h-72 flex flex-col justify-between`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`Filter by ${cat} category, ${count} courses available`}
      aria-pressed={isActive}
    >
      <div>
        <div className="mb-4">
          <Icon size={28} />
        </div>
        <h2 className="text-2xl font-bold">{cat}</h2>
        <p className="text-sm opacity-80 mt-1">
          {count} {count === 1 ? "Course" : "Courses"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.slice(0, 5).map((item, i) => (
          <span
            key={i}
            className="bg-white/20 text-xs px-3 py-1 rounded-full backdrop-blur"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full pointer-events-none" />
    </div>
  )
);

CategoryCard.displayName = "CategoryCard";

// ─── Optimized Loading Skeleton ─────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container py-12">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="h-40 rounded-t-xl bg-muted animate-pulse mb-4" />
            <div className="h-4 bg-muted rounded mb-2" />
            <div className="h-3 bg-muted rounded mb-1 w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
    <Footer />
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const Courses = () => {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = searchParams.get("category") || "All";
  const [category, setCategory] = useState(
    initialCat.charAt(0).toUpperCase() + initialCat.slice(1)
  );
  const [level, setLevel] = useState("All");
  const [search, setSearch] = useState("");

  // ── Optimized Fetch with pagination ────────────────────────────────────────
  const fetchCourseData = useCallback(async () => {
    setLoading(true);

    const cacheKey = "courses_all";
    const cached = sessionStorage.getItem(cacheKey);
    const cacheTime = sessionStorage.getItem(`${cacheKey}_time`);

    // Use cache if less than 5 minutes old
    if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 300000) {
      setCourses(JSON.parse(cached));
      setLoading(false);
      return;
    }

    // Fetch only published courses with limit for faster initial load
    const { data, error } = await supabase
      .from("courses")
      .select("id, title, description, duration, level, category, image_url, thumbnail_url, is_published")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(20); // Limit to 20 courses for faster load

    if (error) {
      console.error("Failed to fetch courses", error);
      setCourses([]);
    } else {
      const courseData = (data as CourseRow[]) || [];
      setCourses(courseData);
      sessionStorage.setItem(cacheKey, JSON.stringify(courseData));
      sessionStorage.setItem(`${cacheKey}_time`, Date.now().toString());
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (category !== "All") {
        const aliases = categoryMap[category] || [category];
        if (!aliases.includes(c.category)) return false;
      }
      if (level !== "All" && c.level !== level) return false;
      if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [courses, category, level, search]);

  const getCategoryCount = useCallback(
    (catName: string) => {
      const aliases = categoryMap[catName] || [catName];
      return courses.filter((c) => aliases.includes(c.category)).length;
    },
    [courses]
  );

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleCategoryChange = useCallback(
    (cat: string) => {
      setCategory(cat);
      if (cat === "All") {
        setSearchParams({});
      } else {
        setSearchParams({ category: cat.toLowerCase() });
      }
    },
    [setSearchParams]
  );

  const handleLevelChange = useCallback((l: string) => setLevel(l), []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
    []
  );

  const handleClearFilter = useCallback(
    () => handleCategoryChange("All"),
    [handleCategoryChange]
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - No animations for faster paint */}
      <section className="border-b border-border bg-card py-12">
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground lg:text-4xl">Explore Courses</h1>
          <p className="mt-2 text-muted-foreground">
            Find the perfect course to start or advance your career
          </p>
        </div>
      </section>

      {/* Category Cards - No animations */}
      <div className="border-b border-border bg-background">
        <div className="container py-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={handleSearchChange}
              className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Search courses"
            />
          </div>

          {/* Level Filter */}
          <div className="flex gap-2" role="group" aria-label="Course level filters">
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => handleLevelChange(l)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${level === l
                    ? "bg-foreground text-background"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                aria-pressed={level === l}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="container py-12">
        {category !== "All" && (
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Showing</span>
            <span className="font-semibold text-foreground">{category}</span>
            <span>courses</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilter}
              className="h-6 px-2 text-xs"
            >
              Clear filter
            </Button>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            {courses.length === 0
              ? "No courses available. Check back later!"
              : "No courses found. Try different filters."}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default memo(Courses);
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { Clock, BarChart2, Search, Palette, Code, Megaphone, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";

import uiuxImg from "@/assets/courses/uiux-design.jpg";
import fullstackImg from "@/assets/courses/fullstack-dev.jpg";
import marketingImg from "@/assets/courses/digital-marketing.jpg";
import dataImg from "@/assets/courses/data-analytics.jpg";
import productImg from "@/assets/courses/product-design.jpg";
import reactImg from "@/assets/courses/react-typescript.jpg";

const categoryImageMap: Record<string, string> = {
  Design: uiuxImg,
  Coding: fullstackImg,
  Marketing: marketingImg,
  Data: dataImg,
};

interface CourseRow {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  level: string | null;
  category: string;
  image_url: string | null;
  total_modules: number;
}

const levels = ["All", "Beginner", "Intermediate"];

// Category cards data
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

// Optimized Course Card Component
const CourseCard = memo(({ course, index }: { course: CourseRow; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.01, 0.2) }}
      className="group rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
    >
      <div className="relative h-40 rounded-t-xl overflow-hidden bg-muted">
        <img
          src={course.image_url || `https://placehold.co/400x240/1e293b/ffffff?text=${course.category}+Course`}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="eager"
          decoding="async"
          fetchPriority={index < 4 ? "high" : "low"}
        />
        <div className="absolute top-3 left-3 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          {course.category}
        </div>
      </div>
      <div className="p-5">
        <div className="flex gap-2">
          <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
            {course.level}
          </span>
        </div>
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
    </motion.div>
  );
});

CourseCard.displayName = 'CourseCard';

// Optimized Category Card Component
const CategoryCard = memo(({
  cat,
  Icon,
  color,
  items,
  count,
  isActive,
  onClick
}: {
  cat: string;
  Icon: any;
  color: string;
  items: string[];
  count: number;
  isActive: boolean;
  onClick: () => void;
}) => (
  <motion.div
    whileHover={{ y: -6 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`cursor-pointer relative p-6 rounded-2xl text-white shadow-lg transition-all duration-300 
      bg-gradient-to-br ${color}
      ${isActive ? "ring-2 ring-white/70 scale-[1.03]" : "opacity-90 hover:opacity-100"}
      h-72 flex flex-col justify-between`}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onClick()}
    aria-label={`Filter by ${cat} category, ${count} courses available`}
    aria-pressed={isActive}
  >
    <div>
      <div className="mb-4">
        <Icon size={28} />
      </div>
      <h2 className="text-2xl font-bold">{cat}</h2>
      <p className="text-sm opacity-80 mt-1">{count} Courses</p>
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
  </motion.div>
));

CategoryCard.displayName = 'CategoryCard';

const Courses = () => {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "All";
  const [category, setCategory] = useState(initialCat.charAt(0).toUpperCase() + initialCat.slice(1));
  const [level, setLevel] = useState("All");
  const [search, setSearch] = useState("");

  // FIXED: Added cacheKey definition
  const cacheKey = 'courses_cache';

  // FIXED: Memoized fetch function
  const fetchCourseData = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, description, category, duration, level, price, image_url, is_published")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch courses", error);
        setCourses([]);
      } else {
        const courseData = (data as CourseRow[]) || [];
        setCourses(courseData);
        // FIXED: cacheKey is now defined
        sessionStorage.setItem(cacheKey, JSON.stringify(courseData));
        sessionStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [cacheKey]); // Added dependency

  // FIXED: Added fetchCourseData as dependency
  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  // Memoized filtered courses
  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (category !== "All" && c.category !== category) return false;
      if (level !== "All" && c.level !== level) return false;
      if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [courses, category, level, search]);

  // Memoized category counts
  const getCategoryCount = useCallback((catName: string) => {
    return courses.filter(c => c.category === catName).length;
  }, [courses]);

  const handleCategoryChange = useCallback((cat: string) => {
    setCategory(cat);
    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat.toLowerCase() });
    }
  }, [setSearchParams]);

  const handleLevelChange = useCallback((l: string) => {
    setLevel(l);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleClearFilter = useCallback(() => {
    handleCategoryChange("All");
    setLevel("All");
    setSearch("");
  }, [handleCategoryChange]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <div className="h-40 rounded-t-xl bg-muted animate-pulse mb-4" />
                <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse mb-1" />
                <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b border-border bg-card py-12">
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground lg:text-4xl">Explore Courses</h1>
          <p className="mt-2 text-muted-foreground">Find the perfect course to start or advance your career</p>
        </div>
      </section>

      {/* Category Cards Grid */}
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
          
          {/* FIXED: Added clear all filters button */}
          {(category !== "All" || level !== "All" || search) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilter}
              className="h-10 px-3 text-sm"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      </div>

      {/* Course Grid - FIXED: Using CourseCard component consistently */}
      <div className="container py-12">
        {category !== "All" && (
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Showing</span>
            <span className="font-semibold text-foreground">{category}</span>
            <span>courses</span>
          </div>
        )}
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
        
        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            {courses.length === 0 ? "No courses available. Check back later!" : "No courses found. Try different filters."}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default memo(Courses);
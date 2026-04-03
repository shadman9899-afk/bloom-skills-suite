import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { Clock, BarChart2, Search, Palette, Code, Megaphone, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";

interface CourseRow {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  price: number;
  image_url: string | null;
  is_published: boolean;
}

// Category configuration with icons and colors
const categoryConfig = {
  Design: { icon: Palette, color: "from-purple-500 to-pink-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
  Coding: { icon: Code, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
  Marketing: { icon: Megaphone, color: "from-orange-500 to-red-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
  Data: { icon: BarChart3, color: "from-green-500 to-emerald-500", bg: "bg-green-50 dark:bg-green-950/30" },
};

const categories = ["All", "Design", "Coding", "Marketing", "Data"];
const levels = ["All", "Beginner", "Intermediate"];

const Courses = () => {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "All";
  const [category, setCategory] = useState(initialCat.charAt(0).toUpperCase() + initialCat.slice(1));
  const [level, setLevel] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, description, category, duration, level, price, image_url, is_published")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch courses", error);
        setCourses([]);
      } else {
        setCourses((data as CourseRow[]) || []);
      }
      setLoading(false);
    };

    void fetchCourseData();
  }, []);

  // Update URL when category changes
  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat.toLowerCase() });
    }
  };

  const filtered = courses.filter((c) => {
    if (category !== "All" && c.category !== category) return false;
    if (level !== "All" && c.level !== level) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Get courses count for each category
  const getCategoryCount = (catName: string) => {
    if (catName === "All") return courses.length;
    return courses.filter(c => c.category === catName).length;
  };

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

      {/* Category Banner - New Large Container */}
      <div className="border-b border-border bg-gradient-to-b from-background to-muted/20">
        <div className="container py-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Object.entries(categoryConfig).map(([cat, { icon: Icon, color, bg }]) => {
              const count = getCategoryCount(cat);
              const isActive = category === cat;
              return (
                <motion.button
                  key={cat}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategoryChange(cat)}
                  className={`
                    relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300
                    ${bg} border-2 ${isActive ? `border-foreground/30 shadow-lg` : 'border-transparent hover:border-border'}
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className={`rounded-xl bg-gradient-to-br ${color} p-2.5 shadow-md`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground">{count}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-foreground">{cat}</h3>
                  <p className="text-xs text-muted-foreground">
                    {count} {count === 1 ? 'Course' : 'Courses'}
                  </p>
                  <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${color} transition-all duration-300 ${isActive ? 'w-full' : 'w-0'}`} />
                </motion.button>
              );
            })}
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
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex gap-2">
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${level === l
                    ? "bg-foreground text-background"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
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
        {loading ? (
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
        ) : (
          <>
            {/* Active category indicator */}
            {category !== "All" && (
              <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                <span>Showing</span>
                <span className="font-semibold text-foreground">{category}</span>
                <span>courses</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCategoryChange("All")}
                  className="h-6 px-2 text-xs"
                >
                  Clear filter
                </Button>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((course, i) => {
                const CatIcon = categoryConfig[course.category as keyof typeof categoryConfig]?.icon || Palette;
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
                  >
                    <div className="relative h-40 rounded-t-xl overflow-hidden">
                      <img
                        src={course.image_url || `https://placehold.co/400x240/1e293b/ffffff?text=${course.category}+Course`}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Category badge on image */}
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
                        <Link to={`/courses/${course.id}`}>View Course →</Link>
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {filtered.length === 0 && (
              <div className="py-20 text-center text-muted-foreground">
                {courses.length === 0
                  ? "No courses available. Check back later!"
                  : "No courses found. Try different filters."}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Courses;
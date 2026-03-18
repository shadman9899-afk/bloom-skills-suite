import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { Clock, BarChart2, Search, Palette, Code, Megaphone, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const categoryCards = [
  {
    icon: Palette,
    title: "Design",
    color: "from-pink-500 to-rose-500",
    subcategories: ["Graphics", "UI/UX", "Motion", "Video Editing", "3D"],
  },
  {
    icon: Code,
    title: "Coding",
    color: "from-blue-500 to-indigo-500",
    subcategories: ["MEAN Stack", "MERN Stack", "Full Stack"],
  },
  {
    icon: Megaphone,
    title: "Marketing",
    color: "from-amber-500 to-orange-500",
    subcategories: ["Social Media Marketing", "Performance Marketing", "Content Marketing", "Email Marketing", "SEO", "Marketing Basics"],
  },
  {
    icon: BarChart3,
    title: "Data",
    color: "from-emerald-500 to-teal-500",
    subcategories: ["Data Analytics", "Excel", "SQL", "Python"],
  },
];

const allCourses = [
  { id: "1", title: "UI/UX Design Fundamentals", desc: "Master user-centered design principles and create beautiful interfaces.", duration: "8 weeks", level: "Beginner", category: "Design" },
  { id: "2", title: "Full-Stack Web Development", desc: "Build modern web applications with React, Node.js, and databases.", duration: "12 weeks", level: "Intermediate", category: "Coding" },
  { id: "3", title: "Digital Marketing Mastery", desc: "Learn SEO, social media, content strategy, and paid advertising.", duration: "6 weeks", level: "Beginner", category: "Marketing" },
  { id: "4", title: "Data Analytics with Python", desc: "Analyze data, build dashboards, and make data-driven decisions.", duration: "10 weeks", level: "Intermediate", category: "Data" },
  { id: "5", title: "Product Design Sprint", desc: "Run design sprints and rapidly prototype product ideas.", duration: "4 weeks", level: "Beginner", category: "Design" },
  { id: "6", title: "React & TypeScript Pro", desc: "Advanced React patterns, TypeScript, and production-ready code.", duration: "8 weeks", level: "Intermediate", category: "Coding" },
  { id: "7", title: "Growth Hacking", desc: "Rapid experimentation across marketing channels and product dev.", duration: "5 weeks", level: "Beginner", category: "Marketing" },
  { id: "8", title: "SQL & Database Design", desc: "Design schemas, write complex queries, and optimize databases.", duration: "6 weeks", level: "Beginner", category: "Data" },
];

const categories = ["All", "Design", "Coding", "Marketing", "Data"];
const levels = ["All", "Beginner", "Intermediate"];

const Courses = () => {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "All";
  const [category, setCategory] = useState(initialCat.charAt(0).toUpperCase() + initialCat.slice(1));
  const [level, setLevel] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = allCourses.filter((c) => {
    if (category !== "All" && c.category !== category) return false;
    if (level !== "All" && c.level !== level) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="border-b border-border bg-card py-12">
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground lg:text-4xl">Explore Courses</h1>
          <p className="mt-2 text-muted-foreground">Find the perfect course to start or advance your career</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryCards.map((cat, i) => (
              <motion.button
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setCategory(cat.title)}
                className={`group relative overflow-hidden rounded-2xl p-6 text-left text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-gradient-to-br ${cat.color} ${category === cat.title ? "ring-2 ring-offset-2 ring-foreground" : ""}`}
              >
                <cat.icon className="h-8 w-8 opacity-90" />
                <h3 className="mt-3 text-lg font-bold">{cat.title}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {cat.subcategories.map((sub) => (
                    <span key={sub} className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
                      {sub}
                    </span>
                  ))}
                </div>
                <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

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
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  category === c ? "gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  level === l ? "bg-foreground text-background" : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
            >
              <div className="h-36 rounded-t-xl bg-accent flex items-center justify-center">
                <span className="text-sm font-medium text-accent-foreground">{course.category}</span>
              </div>
              <div className="p-5">
                <div className="flex gap-2">
                  <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">{course.level}</span>
                </div>
                <h3 className="mt-3 font-semibold text-foreground">{course.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{course.desc}</p>
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}</span>
                  <span className="flex items-center gap-1"><BarChart2 className="h-3.5 w-3.5" />{course.level}</span>
                </div>
                <Button variant="link" className="mt-3 px-0" asChild>
                  <Link to={`/courses/${course.id}`}>View Course →</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">No courses found. Try different filters.</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Courses;

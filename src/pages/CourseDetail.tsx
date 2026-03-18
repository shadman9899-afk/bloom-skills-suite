import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, BarChart2, CheckCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const courseData: Record<string, {
  title: string; desc: string; duration: string; level: string; category: string;
  price: number; instructor: string; instructorRole: string;
  outcomes: string[]; curriculum: { title: string; topics: string[] }[];
}> = {
  "1": {
    title: "UI/UX Design Fundamentals", desc: "Master user-centered design principles and create beautiful, functional interfaces that users love.", duration: "8 weeks", level: "Beginner", category: "Design", price: 149,
    instructor: "Alex Chen", instructorRole: "Senior Designer at Meta",
    outcomes: ["Create wireframes and prototypes in Figma", "Conduct user research and usability testing", "Build a professional design portfolio", "Understand accessibility and design systems"],
    curriculum: [
      { title: "Introduction to Design Thinking", topics: ["What is UX?", "Design thinking framework", "User empathy maps"] },
      { title: "User Research Methods", topics: ["Interviews & surveys", "Persona creation", "Journey mapping"] },
      { title: "Wireframing & Prototyping", topics: ["Low-fidelity wireframes", "Figma basics", "Interactive prototypes"] },
      { title: "Visual Design & UI", topics: ["Color theory", "Typography", "Component design", "Design systems"] },
    ],
  },
  "2": {
    title: "Full-Stack Web Development", desc: "Build modern web applications from scratch using React, Node.js, and PostgreSQL.", duration: "12 weeks", level: "Intermediate", category: "Coding", price: 249,
    instructor: "Jordan Lee", instructorRole: "Staff Engineer at Stripe",
    outcomes: ["Build full-stack apps with React & Node.js", "Design and query databases with SQL", "Deploy to production with CI/CD", "Write clean, testable code"],
    curriculum: [
      { title: "HTML, CSS & JavaScript", topics: ["Semantic HTML", "CSS Grid & Flexbox", "ES6+ JavaScript"] },
      { title: "React & TypeScript", topics: ["Components & hooks", "State management", "TypeScript fundamentals"] },
      { title: "Backend with Node.js", topics: ["REST APIs", "Authentication", "Database design"] },
      { title: "DevOps & Deployment", topics: ["Git workflows", "CI/CD pipelines", "Cloud hosting"] },
    ],
  },
};

const defaultCourse = {
  title: "Course", desc: "Detailed course information.", duration: "8 weeks", level: "Beginner", category: "General", price: 149,
  instructor: "Expert Instructor", instructorRole: "Industry Professional",
  outcomes: ["Build real-world projects", "Gain practical skills", "Get career support", "Earn a certificate"],
  curriculum: [
    { title: "Module 1: Foundations", topics: ["Core concepts", "Tools & setup", "First project"] },
    { title: "Module 2: Deep Dive", topics: ["Advanced techniques", "Best practices", "Case studies"] },
    { title: "Module 3: Projects", topics: ["Capstone project", "Peer review", "Portfolio building"] },
  ],
};

const CourseDetail = () => {
  const { id } = useParams();
  const course = courseData[id || ""] || defaultCourse;
  const [openModule, setOpenModule] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border bg-card py-12">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/courses" className="hover:text-foreground">Courses</Link>
            <span>/</span>
            <span className="text-foreground">{course.title}</span>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <span className="rounded-md bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">{course.category}</span>
              <h1 className="mt-4 text-3xl font-bold text-foreground lg:text-4xl">{course.title}</h1>
              <p className="mt-4 text-lg text-muted-foreground">{course.desc}</p>
              <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><Clock className="h-4 w-4" />{course.duration}</span>
                <span className="flex items-center gap-2"><BarChart2 className="h-4 w-4" />{course.level}</span>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-background p-6 shadow-card">
              <div className="text-3xl font-bold text-foreground">${course.price}</div>
              <p className="mt-1 text-sm text-muted-foreground">One-time payment</p>
              <Button variant="hero" size="lg" className="mt-6 w-full" asChild>
                <Link to={`/payment/${id}`}>Enroll Now</Link>
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">30-day money-back guarantee</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-foreground">What You'll Achieve</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {course.outcomes.map((o) => (
                  <div key={o} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm text-muted-foreground">{o}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground">Curriculum</h2>
              <div className="mt-6 space-y-3">
                {course.curriculum.map((mod, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                    <button
                      onClick={() => setOpenModule(openModule === i ? null : i)}
                      className="flex w-full items-center justify-between p-5 text-left"
                    >
                      <span className="font-semibold text-foreground">{mod.title}</span>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${openModule === i ? "rotate-180" : ""}`} />
                    </button>
                    {openModule === i && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-t border-border px-5 pb-5 pt-3"
                      >
                        <ul className="space-y-2">
                          {mod.topics.map((t) => (
                            <li key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-semibold text-foreground">Your Instructor</h3>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary text-primary-foreground font-bold">
                  {course.instructor.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-foreground">{course.instructor}</div>
                  <div className="text-sm text-muted-foreground">{course.instructorRole}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CourseDetail;

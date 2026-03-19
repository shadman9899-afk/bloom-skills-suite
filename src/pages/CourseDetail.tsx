import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, BarChart2, CheckCircle, ChevronDown, BookOpen, Award, Users, Headphones, FileText, Video, Briefcase, Star, Zap, Download, MessageCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const courseData: Record<string, {
  title: string; desc: string; duration: string; level: string; category: string;
  price: number; originalPrice: number; instructor: string; instructorRole: string; instructorBio: string;
  outcomes: string[]; curriculum: { title: string; lessons: number; duration: string; topics: string[] }[];
  includes: { icon: string; text: string }[];
  afterCourse: { title: string; desc: string }[];
  tools: string[];
  stats: { students: number; rating: number; reviews: number; projects: number };
}> = {
  "1": {
    title: "UI/UX Design Fundamentals",
    desc: "Master user-centered design principles and create beautiful, functional interfaces that users love. From research to prototyping, learn the complete design workflow used by top designers at companies like Google, Apple, and Meta.",
    duration: "8 weeks", level: "Beginner", category: "Design", price: 149, originalPrice: 299,
    instructor: "Alex Chen", instructorRole: "Senior Designer at Meta",
    instructorBio: "10+ years designing products used by millions. Previously at Google and Airbnb. Passionate about making design accessible to everyone.",
    stats: { students: 3240, rating: 4.9, reviews: 856, projects: 12 },
    outcomes: [
      "Create wireframes and prototypes in Figma from scratch",
      "Conduct user research and usability testing",
      "Build a professional design portfolio with 5+ projects",
      "Understand accessibility standards (WCAG 2.1)",
      "Design complete design systems and component libraries",
      "Master responsive design for web and mobile",
      "Create user flows, journey maps, and personas",
      "Present and defend design decisions to stakeholders",
    ],
    curriculum: [
      { title: "Introduction to Design Thinking", lessons: 8, duration: "3h 20m", topics: ["What is UX and why it matters", "Design thinking framework (5 stages)", "User empathy maps & stakeholder interviews", "Setting up your design workspace"] },
      { title: "User Research Methods", lessons: 10, duration: "4h 15m", topics: ["Qualitative vs quantitative research", "User interviews & survey design", "Persona creation with templates", "Journey mapping & pain points", "Competitive analysis frameworks"] },
      { title: "Information Architecture & Wireframing", lessons: 9, duration: "3h 45m", topics: ["Site maps & content strategy", "Card sorting exercises", "Low-fidelity wireframes", "Figma basics — frames, components, auto-layout", "Wireframe critiques & iteration"] },
      { title: "Visual Design & UI Principles", lessons: 12, duration: "5h 30m", topics: ["Color theory & psychology", "Typography hierarchy & pairing", "Grid systems & spacing scales", "Iconography & illustration", "Component design patterns", "Design tokens & theming"] },
      { title: "Prototyping & Interaction Design", lessons: 8, duration: "3h 50m", topics: ["Interactive prototypes in Figma", "Micro-interactions & animations", "Prototype testing with users", "Handoff to developers"] },
      { title: "Design Systems & Portfolio", lessons: 10, duration: "4h 40m", topics: ["Building a component library", "Documentation best practices", "Portfolio project — end-to-end case study", "Presenting your work", "Career guidance & interview prep"] },
    ],
    includes: [
      { icon: "video", text: "25+ hours of HD video content" },
      { icon: "file", text: "50+ downloadable resources & templates" },
      { icon: "book", text: "Figma starter kit with 200+ components" },
      { icon: "users", text: "Private community of 3,000+ designers" },
      { icon: "headphones", text: "1-on-1 mentor sessions (2 included)" },
      { icon: "award", text: "Industry-recognized certificate" },
      { icon: "download", text: "Lifetime access & free updates" },
      { icon: "message", text: "Direct Q&A with the instructor" },
    ],
    afterCourse: [
      { title: "Professional Portfolio", desc: "Graduate with a polished portfolio containing 5+ real-world case studies ready to show employers." },
      { title: "Career Support", desc: "Get resume reviews, LinkedIn optimization tips, and mock interview practice with industry professionals." },
      { title: "Alumni Network", desc: "Join our exclusive alumni Slack community with 3,000+ designers from companies like Google, Meta, and Spotify." },
      { title: "Certificate of Completion", desc: "Earn an industry-recognized certificate to showcase on LinkedIn and your resume." },
      { title: "Freelance Launchpad", desc: "Access our freelance starter kit with contract templates, pricing guides, and client outreach strategies." },
      { title: "Lifetime Updates", desc: "Course content is updated quarterly. Get access to all future modules and bonus content at no extra cost." },
    ],
    tools: ["Figma", "FigJam", "Maze", "Notion", "Miro", "Adobe XD", "Principle", "Lottie"],
  },
  "2": {
    title: "Full-Stack Web Development",
    desc: "Build modern web applications from scratch using React, Node.js, and PostgreSQL.",
    duration: "12 weeks", level: "Intermediate", category: "Coding", price: 249, originalPrice: 499,
    instructor: "Jordan Lee", instructorRole: "Staff Engineer at Stripe",
    instructorBio: "12+ years building scalable web applications. Open-source contributor and tech conference speaker.",
    stats: { students: 5120, rating: 4.8, reviews: 1234, projects: 18 },
    outcomes: ["Build full-stack apps with React & Node.js", "Design and query databases with SQL", "Deploy to production with CI/CD", "Write clean, testable code", "Implement authentication & authorization", "Build RESTful and GraphQL APIs", "Master Git workflows and collaboration", "Optimize performance and security"],
    curriculum: [
      { title: "HTML, CSS & JavaScript", lessons: 12, duration: "5h", topics: ["Semantic HTML", "CSS Grid & Flexbox", "ES6+ JavaScript", "DOM manipulation"] },
      { title: "React & TypeScript", lessons: 14, duration: "6h 30m", topics: ["Components & hooks", "State management", "TypeScript fundamentals", "Routing & forms"] },
      { title: "Backend with Node.js", lessons: 10, duration: "4h 45m", topics: ["REST APIs", "Authentication", "Database design", "Error handling"] },
      { title: "DevOps & Deployment", lessons: 8, duration: "3h 20m", topics: ["Git workflows", "CI/CD pipelines", "Cloud hosting", "Monitoring"] },
    ],
    includes: [
      { icon: "video", text: "40+ hours of HD video content" },
      { icon: "file", text: "80+ code exercises & starter files" },
      { icon: "users", text: "Private Discord community" },
      { icon: "headphones", text: "Weekly live Q&A sessions" },
      { icon: "award", text: "Industry-recognized certificate" },
      { icon: "download", text: "Lifetime access & free updates" },
      { icon: "message", text: "Code review from mentors" },
      { icon: "book", text: "Interview prep guide" },
    ],
    afterCourse: [
      { title: "Job-Ready Portfolio", desc: "Graduate with 6+ deployed projects showcasing full-stack skills." },
      { title: "Career Support", desc: "Resume reviews, mock interviews, and job referral network." },
      { title: "Alumni Network", desc: "5,000+ developers from top tech companies." },
      { title: "Certificate", desc: "Industry-recognized certificate for LinkedIn." },
      { title: "Open Source Contributions", desc: "Guided open-source contribution to boost your GitHub profile." },
      { title: "Lifetime Updates", desc: "All future content updates included at no extra cost." },
    ],
    tools: ["React", "Node.js", "TypeScript", "PostgreSQL", "Git", "Docker", "AWS", "Vercel"],
  },
};

const defaultCourse = {
  title: "Course", desc: "Detailed course information.", duration: "8 weeks", level: "Beginner", category: "General", price: 149, originalPrice: 299,
  instructor: "Expert Instructor", instructorRole: "Industry Professional", instructorBio: "Seasoned professional with years of industry experience.",
  stats: { students: 1000, rating: 4.7, reviews: 200, projects: 8 },
  outcomes: ["Build real-world projects", "Gain practical skills", "Get career support", "Earn a certificate"],
  curriculum: [
    { title: "Module 1: Foundations", lessons: 8, duration: "3h", topics: ["Core concepts", "Tools & setup", "First project"] },
    { title: "Module 2: Deep Dive", lessons: 10, duration: "4h", topics: ["Advanced techniques", "Best practices", "Case studies"] },
    { title: "Module 3: Projects", lessons: 6, duration: "2h 30m", topics: ["Capstone project", "Peer review", "Portfolio building"] },
  ],
  includes: [
    { icon: "video", text: "20+ hours of video content" },
    { icon: "file", text: "Downloadable resources" },
    { icon: "award", text: "Certificate of completion" },
    { icon: "download", text: "Lifetime access" },
  ],
  afterCourse: [
    { title: "Portfolio", desc: "A professional portfolio with completed projects." },
    { title: "Certificate", desc: "Industry-recognized certificate." },
    { title: "Community", desc: "Access to alumni network." },
  ],
  tools: ["Industry Standard Tools"],
};

const iconMap: Record<string, React.ElementType> = {
  video: Video, file: FileText, book: BookOpen, users: Users,
  headphones: Headphones, award: Award, download: Download, message: MessageCircle,
};

const CourseDetail = () => {
  const { id } = useParams();
  const course = courseData[id || ""] || defaultCourse;
  const [openModule, setOpenModule] = useState<number | null>(0);
  const totalLessons = course.curriculum.reduce((sum, m) => sum + m.lessons, 0);
  const totalDuration = course.curriculum.reduce((sum, m) => {
    const match = m.duration.match(/(\d+)h\s*(\d+)?/);
    return sum + (match ? parseInt(match[1]) * 60 + (parseInt(match[2] || "0")) : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-border bg-card py-12 lg:py-16">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/courses" className="hover:text-foreground transition-colors">Courses</Link>
            <span>/</span>
            <span className="text-foreground">{course.title}</span>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <span className="rounded-md bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">{course.category}</span>
              <h1 className="mt-4 text-3xl font-bold text-foreground lg:text-4xl xl:text-5xl leading-tight">{course.title}</h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{course.desc}</p>

              <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{course.duration}</span>
                <span className="flex items-center gap-2"><BarChart2 className="h-4 w-4 text-primary" />{course.level}</span>
                <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />{totalLessons} lessons</span>
                <span className="flex items-center gap-2"><Video className="h-4 w-4 text-primary" />{Math.floor(totalDuration / 60)}h {totalDuration % 60}m total</span>
              </div>

              <div className="mt-6 flex items-center gap-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(course.stats.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                  ))}
                  <span className="ml-2 text-sm font-medium text-foreground">{course.stats.rating}</span>
                  <span className="text-sm text-muted-foreground">({course.stats.reviews.toLocaleString()} reviews)</span>
                </div>
                <span className="text-sm text-muted-foreground">{course.stats.students.toLocaleString()} students enrolled</span>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="rounded-xl border border-border bg-background p-6 shadow-card lg:sticky lg:top-24 self-start">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-foreground">${course.price}</span>
                <span className="text-lg text-muted-foreground line-through">${course.originalPrice}</span>
                <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                  {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">One-time payment · Lifetime access</p>
              <Button variant="hero" size="lg" className="mt-6 w-full" asChild>
                <Link to={`/payment/${id}`}>Enroll Now</Link>
              </Button>
              <Button variant="heroOutline" size="lg" className="mt-3 w-full">
                Try Free Preview
              </Button>
              <p className="mt-4 text-center text-xs text-muted-foreground">30-day money-back guarantee · No risk</p>

              <div className="mt-6 border-t border-border pt-6 space-y-3">
                {course.includes.slice(0, 4).map((item) => {
                  const Icon = iconMap[item.icon] || Zap;
                  return (
                    <div key={item.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Icon className="h-4 w-4 text-primary shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-16">

            {/* What's Included */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-foreground">What's Included</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {course.includes.map((item) => {
                  const Icon = iconMap[item.icon] || Zap;
                  return (
                    <div key={item.text} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Learning Outcomes */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-foreground">What You'll Achieve</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {course.outcomes.map((o) => (
                  <div key={o} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm text-muted-foreground">{o}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tools */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-foreground">Tools You'll Master</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {course.tools.map((tool) => (
                  <span key={tool} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-card">
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Curriculum */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Curriculum</h2>
                <span className="text-sm text-muted-foreground">{course.curriculum.length} modules · {totalLessons} lessons</span>
              </div>
              <div className="mt-6 space-y-3">
                {course.curriculum.map((mod, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                    <button
                      onClick={() => setOpenModule(openModule === i ? null : i)}
                      className="flex w-full items-center justify-between p-5 text-left hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-primary-foreground text-sm font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground block">{mod.title}</span>
                          <span className="text-xs text-muted-foreground">{mod.lessons} lessons · {mod.duration}</span>
                        </div>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${openModule === i ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {openModule === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border px-5 pb-5 pt-3">
                            <ul className="space-y-2">
                              {mod.topics.map((t) => (
                                <li key={t} className="flex items-center gap-3 text-sm text-muted-foreground">
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                  {t}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* After the Course */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-foreground">What You Get After the Course</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {course.afterCourse.map((item) => (
                  <div key={item.title} className="rounded-xl border border-border bg-card p-5 shadow-card">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructor */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-semibold text-foreground">Your Instructor</h3>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-primary-foreground font-bold text-lg">
                  {course.instructor.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-foreground">{course.instructor}</div>
                  <div className="text-sm text-muted-foreground">{course.instructorRole}</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{course.instructorBio}</p>
            </div>

            {/* Stats */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-semibold text-foreground mb-4">Course at a Glance</h3>
              <div className="space-y-4">
                {[
                  { label: "Duration", value: course.duration },
                  { label: "Modules", value: `${course.curriculum.length} modules` },
                  { label: "Total Lessons", value: `${totalLessons} lessons` },
                  { label: "Hands-on Projects", value: `${course.stats.projects} projects` },
                  { label: "Skill Level", value: course.level },
                  { label: "Certificate", value: "Yes, included" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <span className="font-medium text-foreground">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA sticky on mobile */}
            <div className="rounded-xl gradient-primary p-6 text-primary-foreground">
              <h3 className="font-bold text-lg">Ready to start learning?</h3>
              <p className="mt-2 text-sm opacity-90">Join {course.stats.students.toLocaleString()}+ students already enrolled.</p>
              <Button variant="secondary" size="lg" className="mt-4 w-full" asChild>
                <Link to={`/payment/${id}`}>Enroll for ${course.price}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CourseDetail;

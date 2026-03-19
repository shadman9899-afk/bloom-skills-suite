import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Play, X, Github, Globe, Eye } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const categories = ["All", "Design", "Coding", "Marketing", "Data"];

const portfolioProjects = [
  {
    title: "E-Commerce Dashboard",
    student: "Priya Sharma",
    category: "Design",
    tags: ["UI/UX", "Figma"],
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    description: "A complete e-commerce analytics dashboard designed in Figma with real-time data visualization.",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Task Management App",
    student: "Rahul Verma",
    category: "Coding",
    tags: ["MERN Stack", "React"],
    thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
    description: "Full-stack task management application built with MongoDB, Express, React, and Node.js.",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Brand Campaign Strategy",
    student: "Ananya Patel",
    category: "Marketing",
    tags: ["Social Media", "Strategy"],
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    description: "Complete social media campaign strategy that increased brand engagement by 340%.",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Sales Prediction Model",
    student: "Arjun Reddy",
    category: "Data",
    tags: ["Python", "ML"],
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    description: "Machine learning model predicting quarterly sales with 94% accuracy using Python and scikit-learn.",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Mobile Banking UI",
    student: "Sneha Gupta",
    category: "Design",
    tags: ["UI/UX", "Motion"],
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=600&h=400&fit=crop",
    description: "Modern mobile banking interface with micro-interactions and seamless user flow.",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Real-Time Chat App",
    student: "Vikram Singh",
    category: "Coding",
    tags: ["Full Stack", "WebSocket"],
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
    description: "Real-time messaging platform with WebSocket integration, file sharing, and group chats.",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "SEO Growth Strategy",
    student: "Meera Joshi",
    category: "Marketing",
    tags: ["SEO", "Content"],
    thumbnail: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop",
    description: "Organic SEO strategy that drove 5x traffic growth for a SaaS startup in 6 months.",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Customer Churn Analysis",
    student: "Karthik Nair",
    category: "Data",
    tags: ["SQL", "Excel"],
    thumbnail: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=600&h=400&fit=crop",
    description: "End-to-end churn analysis using SQL and Excel dashboards to reduce attrition by 25%.",
    liveUrl: "#",
    githubUrl: "#",
  },
];

const videoTestimonials = [
  {
    name: "Riya Kapoor",
    role: "UI/UX Designer at Google",
    course: "UI/UX Design Fundamentals",
    thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    quote: "Slate Academy transformed my career. The hands-on projects gave me a portfolio that landed me my dream job.",
  },
  {
    name: "Aditya Mehta",
    role: "Full Stack Developer at Flipkart",
    course: "MERN Stack Development",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    quote: "The mentorship and real-world projects made all the difference. I went from zero coding to a full-time dev role.",
  },
  {
    name: "Pooja Desai",
    role: "Marketing Manager at Zomato",
    course: "Performance Marketing",
    thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    quote: "The practical approach to marketing was exactly what I needed. I could apply what I learned immediately.",
  },
  {
    name: "Sanjay Kumar",
    role: "Data Analyst at Razorpay",
    course: "Data Analytics with Python",
    thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    quote: "From Excel basics to Python ML models — this course gave me the confidence to switch careers.",
  },
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const filteredProjects =
    activeCategory === "All"
      ? portfolioProjects
      : portfolioProjects.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero py-16 lg:py-20">
        <div className="container text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground"
          >
            Student Showcase
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl font-bold tracking-tight text-foreground lg:text-5xl"
          >
            Real Projects. Real Results.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl text-muted-foreground"
          >
            Explore outstanding work from our students — built with real skills learned at Slate Academy.
          </motion.p>
        </div>
      </section>

      {/* Portfolio Cards */}
      <section className="container py-16">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-foreground">Student Projects</h2>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "gradient-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group rounded-xl border border-border bg-card shadow-card overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                  <a
                    href={project.liveUrl}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-md hover:bg-accent transition-colors"
                    title="Live Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </a>
                  <a
                    href={project.githubUrl}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-md hover:bg-accent transition-colors"
                    title="GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <div className="p-5">
                <div className="flex gap-2 flex-wrap">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="mt-3 font-semibold text-foreground">{project.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">by {project.student}</span>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {project.category}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="bg-secondary/50 py-16">
        <div className="container">
          <div className="text-center">
            <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground">
              Success Stories
            </span>
            <h2 className="mt-4 text-2xl font-bold text-foreground lg:text-3xl">
              Hear From Our Students
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Watch how Slate Academy helped our students land their dream roles.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {videoTestimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card shadow-card overflow-hidden"
              >
                {/* Video / Thumbnail */}
                <div className="relative aspect-video bg-muted">
                  {playingVideo === i ? (
                    <div className="relative w-full h-full">
                      <video
                        src={testimonial.videoUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        controls
                      />
                      <button
                        onClick={() => setPlayingVideo(null)}
                        className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-foreground/70 text-primary-foreground hover:bg-foreground/90 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setPlayingVideo(i)}
                      className="group/play relative w-full h-full"
                    >
                      <img
                        src={testimonial.thumbnail}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center group-hover/play:bg-foreground/30 transition-colors">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-card/90 shadow-lg group-hover/play:scale-110 transition-transform">
                          <Play className="h-6 w-6 text-primary ml-0.5" />
                        </div>
                      </div>
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <p className="text-sm text-muted-foreground italic line-clamp-3">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <img
                      src={testimonial.thumbnail}
                      alt={testimonial.name}
                      className="h-10 w-10 rounded-full object-cover border-2 border-border"
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <span className="mt-3 inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                    {testimonial.course}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 text-center">
        <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
          Ready to Build Your Portfolio?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Join thousands of students creating real-world projects with expert mentorship.
        </p>
        <Button variant="hero" size="lg" className="mt-6">
          Start Learning Today
        </Button>
      </section>

      <Footer />
    </div>
  );
};

export default Portfolio;

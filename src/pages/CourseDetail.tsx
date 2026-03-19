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
  "9": {
    title: "Graphics Design Professional",
    desc: "Master Adobe Creative Suite, branding, typography, and visual storytelling. Create stunning designs for print, digital media, and brand identities that captivate audiences.",
    duration: "10 weeks", level: "Beginner", category: "Design", price: 179, originalPrice: 359,
    instructor: "Priya Sharma", instructorRole: "Creative Director at Pentagram",
    instructorBio: "Award-winning designer with 14+ years in branding and visual identity. Worked with Nike, Coca-Cola, and Spotify on global campaigns.",
    stats: { students: 4100, rating: 4.8, reviews: 920, projects: 15 },
    outcomes: [
      "Master Adobe Photoshop, Illustrator & InDesign",
      "Create professional brand identities from scratch",
      "Design logos, business cards, and stationery sets",
      "Understand color theory, typography & composition",
      "Create social media graphics and marketing collateral",
      "Design print-ready files (brochures, posters, packaging)",
      "Build a professional graphic design portfolio",
      "Work with clients — briefs, revisions, and handoff",
    ],
    curriculum: [
      { title: "Design Fundamentals & Theory", lessons: 10, duration: "4h 30m", topics: ["Elements & principles of design", "Color theory & psychology", "Typography fundamentals & font pairing", "Composition, grids & layout", "Visual hierarchy"] },
      { title: "Adobe Photoshop Mastery", lessons: 12, duration: "5h 15m", topics: ["Interface & workspace setup", "Layers, masks & blending modes", "Photo retouching & manipulation", "Digital painting & compositing", "Export for web & print"] },
      { title: "Adobe Illustrator for Vector Art", lessons: 10, duration: "4h 45m", topics: ["Pen tool & pathfinder", "Logo design process", "Icon & illustration creation", "Pattern design & swatches", "Scalable vector workflows"] },
      { title: "Brand Identity Design", lessons: 9, duration: "4h", topics: ["Brand strategy & mood boards", "Logo design — concept to final", "Brand guidelines document", "Stationery & collateral design", "Presentation to clients"] },
      { title: "Print & Digital Media", lessons: 8, duration: "3h 30m", topics: ["Print production basics (CMYK, bleeds)", "Brochure & poster design", "Social media templates", "Packaging design intro", "Portfolio project"] },
    ],
    includes: [
      { icon: "video", text: "22+ hours of HD video tutorials" },
      { icon: "file", text: "100+ design templates & assets" },
      { icon: "book", text: "Brand identity starter kit" },
      { icon: "users", text: "Community of 4,000+ designers" },
      { icon: "headphones", text: "2 one-on-one portfolio reviews" },
      { icon: "award", text: "Industry-recognized certificate" },
      { icon: "download", text: "Lifetime access & updates" },
      { icon: "message", text: "Weekly design critiques" },
    ],
    afterCourse: [
      { title: "Design Portfolio", desc: "15+ polished projects including logos, brand identities, and print designs." },
      { title: "Freelance Ready", desc: "Client proposal templates, pricing calculator, and contract documents included." },
      { title: "Career Support", desc: "Resume design, portfolio review sessions, and job board access." },
      { title: "Certificate", desc: "Industry-recognized certificate to showcase your graphic design skills." },
      { title: "Design Community", desc: "Lifetime access to our alumni Slack with feedback channels and job postings." },
      { title: "Software Licenses", desc: "Discounted Adobe Creative Cloud subscription for 6 months." },
    ],
    tools: ["Photoshop", "Illustrator", "InDesign", "Canva", "Figma", "Procreate", "After Effects", "Lightroom"],
  },
  "10": {
    title: "MERN Stack Development",
    desc: "Build production-ready full-stack applications with MongoDB, Express.js, React, and Node.js. From REST APIs to real-time features, master the most in-demand JavaScript stack.",
    duration: "14 weeks", level: "Intermediate", category: "Coding", price: 279, originalPrice: 549,
    instructor: "Rahul Verma", instructorRole: "Principal Engineer at Shopify",
    instructorBio: "15+ years building scalable products. Core contributor to several open-source Node.js libraries. Has mentored 500+ developers.",
    stats: { students: 6200, rating: 4.9, reviews: 1580, projects: 22 },
    outcomes: [
      "Build & deploy full MERN stack applications",
      "Design RESTful APIs with Express & Node.js",
      "Model data with MongoDB & Mongoose ODM",
      "Create dynamic UIs with React & Redux Toolkit",
      "Implement JWT auth & role-based access control",
      "Add real-time features with Socket.io",
      "Write tests with Jest & React Testing Library",
      "Deploy with Docker, CI/CD & cloud platforms",
    ],
    curriculum: [
      { title: "JavaScript & Node.js Deep Dive", lessons: 12, duration: "5h 30m", topics: ["ES6+ features & async patterns", "Node.js runtime & event loop", "NPM ecosystem & package management", "Error handling & debugging"] },
      { title: "Express.js & REST APIs", lessons: 10, duration: "4h 45m", topics: ["Express middleware & routing", "CRUD API design patterns", "Input validation & error handling", "File uploads & streaming", "API documentation with Swagger"] },
      { title: "MongoDB & Data Modeling", lessons: 9, duration: "4h", topics: ["MongoDB Atlas setup", "Mongoose schemas & models", "Aggregation pipeline", "Indexing & performance", "Data relationships & population"] },
      { title: "React Frontend Development", lessons: 14, duration: "6h 30m", topics: ["Component architecture & hooks", "Redux Toolkit for state", "React Router v6", "Form handling & validation", "API integration & loading states"] },
      { title: "Authentication & Security", lessons: 8, duration: "3h 30m", topics: ["JWT tokens & refresh flow", "OAuth2 social login", "Role-based access control", "Security best practices (CORS, rate limiting)", "Password hashing & encryption"] },
      { title: "Real-Time, Testing & Deployment", lessons: 10, duration: "4h 45m", topics: ["Socket.io real-time events", "Unit & integration testing", "Docker containerization", "CI/CD with GitHub Actions", "AWS / Vercel deployment"] },
    ],
    includes: [
      { icon: "video", text: "30+ hours of HD video content" },
      { icon: "file", text: "120+ code exercises & projects" },
      { icon: "book", text: "MERN boilerplate starter kit" },
      { icon: "users", text: "Private Discord (6,000+ devs)" },
      { icon: "headphones", text: "Bi-weekly live coding sessions" },
      { icon: "award", text: "Industry-recognized certificate" },
      { icon: "download", text: "Lifetime access & updates" },
      { icon: "message", text: "Code review from senior devs" },
    ],
    afterCourse: [
      { title: "6+ Deployed Projects", desc: "Full-stack apps on your GitHub including e-commerce, chat app, and dashboard." },
      { title: "Interview Prep", desc: "50+ curated MERN interview questions with detailed answers and system design problems." },
      { title: "Career Support", desc: "Resume reviews, LinkedIn optimization, and referral network at top companies." },
      { title: "Certificate", desc: "Industry-recognized certificate verifying your MERN stack expertise." },
      { title: "Open Source Mentorship", desc: "Guided contributions to popular open-source projects to boost your profile." },
      { title: "Lifetime Updates", desc: "Course updated every quarter with new content on latest tools and practices." },
    ],
    tools: ["MongoDB", "Express.js", "React", "Node.js", "Redux", "Socket.io", "Docker", "Jest"],
  },
  "11": {
    title: "Digital Marketing Complete Guide",
    desc: "Master every channel of digital marketing — from SEO and Google Ads to social media, email automation, and analytics. Learn to plan, execute, and measure campaigns that drive real business results.",
    duration: "8 weeks", level: "Beginner", category: "Marketing", price: 129, originalPrice: 259,
    instructor: "Sarah Mitchell", instructorRole: "VP of Marketing at HubSpot",
    instructorBio: "Former Google Ads strategist. 11+ years driving growth for SaaS companies. Speaker at MarketingProfs and Content Marketing World.",
    stats: { students: 7800, rating: 4.7, reviews: 2100, projects: 10 },
    outcomes: [
      "Build & execute end-to-end marketing strategies",
      "Run profitable Google Ads & Facebook Ads campaigns",
      "Master SEO — on-page, off-page & technical",
      "Create high-converting email marketing funnels",
      "Build a content calendar & social media strategy",
      "Analyze data with Google Analytics 4",
      "A/B test landing pages and ad creatives",
      "Calculate ROI, CAC, LTV & key marketing metrics",
    ],
    curriculum: [
      { title: "Marketing Foundations & Strategy", lessons: 8, duration: "3h 30m", topics: ["Digital marketing landscape", "Customer journey & funnel stages", "Buyer personas & ICP", "Marketing plan template", "Setting KPIs & OKRs"] },
      { title: "SEO & Content Marketing", lessons: 10, duration: "4h 30m", topics: ["Keyword research with SEMrush & Ahrefs", "On-page SEO — meta, headers, schema", "Technical SEO — speed, crawlability", "Content strategy & blogging", "Link building tactics"] },
      { title: "Paid Advertising (PPC)", lessons: 9, duration: "4h", topics: ["Google Ads — Search, Display, Shopping", "Facebook & Instagram Ads Manager", "Campaign structure & bidding", "Ad copywriting & creatives", "Retargeting & lookalike audiences"] },
      { title: "Social Media & Email Marketing", lessons: 10, duration: "4h 15m", topics: ["Platform-specific strategies", "Content creation & scheduling", "Community management", "Email list building", "Automated email sequences & drip campaigns"] },
      { title: "Analytics, CRO & Growth", lessons: 8, duration: "3h 30m", topics: ["Google Analytics 4 setup & reports", "Conversion tracking & attribution", "A/B testing frameworks", "Landing page optimization", "Growth loops & referral programs"] },
    ],
    includes: [
      { icon: "video", text: "20+ hours of HD video content" },
      { icon: "file", text: "60+ templates & swipe files" },
      { icon: "book", text: "Marketing strategy playbook" },
      { icon: "users", text: "Community of 7,000+ marketers" },
      { icon: "headphones", text: "Monthly live campaign reviews" },
      { icon: "award", text: "Industry-recognized certificate" },
      { icon: "download", text: "Lifetime access & updates" },
      { icon: "message", text: "Direct Q&A with instructor" },
    ],
    afterCourse: [
      { title: "Campaign Portfolio", desc: "3+ documented case studies with real metrics showing campaign strategy and results." },
      { title: "Marketing Toolkit", desc: "Lifetime access to 60+ templates — ad copy, email sequences, content calendars, and audit checklists." },
      { title: "Career Support", desc: "Resume templates, interview prep, and access to marketing job board with 500+ listings." },
      { title: "Certificate", desc: "Industry-recognized certificate proving your digital marketing proficiency." },
      { title: "Agency Starter Kit", desc: "Client onboarding templates, proposal decks, and SOW documents to start freelancing." },
      { title: "Lifetime Updates", desc: "Stay current — course updated with every major platform change and algorithm update." },
    ],
    tools: ["Google Ads", "Meta Ads", "Google Analytics", "SEMrush", "Mailchimp", "Canva", "HubSpot", "Hotjar"],
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
              <Button variant="outline" size="lg" className="mt-3 w-full gap-2" onClick={() => {
                const link = document.createElement('a');
                link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(`${course.title} — Course Brochure\n\n${course.desc}\n\nDuration: ${course.duration}\nLevel: ${course.level}\nPrice: $${course.price}\n\nWhat You'll Learn:\n${course.outcomes.map(o => `• ${o}`).join('\n')}\n\nCurriculum:\n${course.curriculum.map((m, i) => `Module ${i+1}: ${m.title} (${m.lessons} lessons, ${m.duration})\n${m.topics.map(t => `  - ${t}`).join('\n')}`).join('\n\n')}\n\nTools: ${course.tools.join(', ')}\n\nInstructor: ${course.instructor} — ${course.instructorRole}\n\nEnroll at learnix.com`)}`;
                link.download = `${course.title.replace(/\s+/g, '-')}-Brochure.txt`;
                link.click();
              }}>
                <Download className="h-4 w-4" />
                Download Brochure
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

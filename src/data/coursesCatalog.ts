import uiuxImg from "@/assets/courses/uiux-design.jpg";
import figmaImg from "@/assets/courses/figma-masterclass.jpg";
import graphicsImg from "@/assets/courses/graphics-design.jpg";
import motionImg from "@/assets/courses/motion-graphics.jpg";
import videoImg from "@/assets/courses/video-editing.jpg";
import photoshopImg from "@/assets/courses/photoshop-advanced.jpg";
import illustratorImg from "@/assets/courses/illustrator-basics.jpg";
import brandingImg from "@/assets/courses/branding-identity.jpg";
import mobileUiImg from "@/assets/courses/mobile-app-ui.jpg";
import mernImg from "@/assets/courses/mern-stack.jpg";
import frontendImg from "@/assets/courses/frontend-dev.jpg";
import nodeImg from "@/assets/courses/nodejs-backend.jpg";
import pythonImg from "@/assets/courses/python-beginners.jpg";
import digitalMktImg from "@/assets/courses/digital-marketing-complete.jpg";
import socialImg from "@/assets/courses/social-media-marketing.jpg";
import perfMktImg from "@/assets/courses/performance-marketing.jpg";
import seoImg from "@/assets/courses/seo-mastery.jpg";
import dataImg from "@/assets/courses/data-analytics.jpg";
import excelImg from "@/assets/courses/excel-dashboards.jpg";
import sqlImg from "@/assets/courses/sql-database.jpg";

export type CourseTag = "Beginner" | "Advanced" | "Quick Skill";

export interface CatalogCourse {
  id: string;
  title: string;
  subtitle: string;
  tag: CourseTag;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  category: "Design" | "Coding" | "Marketing" | "Data";
  image: string;
}

export const coursesCatalog: CatalogCourse[] = [
  { id: "uiux-mastery", title: "UI/UX Design Mastery – Become Job Ready", subtitle: "Design real-world apps from wireframe to prototype", tag: "Beginner", level: "Beginner", duration: "10 weeks", category: "Design", image: uiuxImg },
  { id: "figma-masterclass", title: "Figma Masterclass – UI Design from Scratch", subtitle: "Auto-layout, components, and design systems", tag: "Beginner", level: "Beginner", duration: "6 weeks", category: "Design", image: figmaImg },
  { id: "graphic-design-fundamentals", title: "Graphic Design Fundamentals – Photoshop & Illustrator", subtitle: "Master the two essential tools every designer needs", tag: "Beginner", level: "Beginner", duration: "8 weeks", category: "Design", image: graphicsImg },
  { id: "motion-graphics", title: "Motion Graphics & Animation – After Effects Complete Guide", subtitle: "Create cinematic motion design and brand animations", tag: "Advanced", level: "Advanced", duration: "8 weeks", category: "Design", image: motionImg },
  { id: "video-editing-pro", title: "Video Editing Pro – Premiere Pro Complete Guide", subtitle: "Edit reels, ads, and YouTube videos like a pro", tag: "Advanced", level: "Intermediate", duration: "7 weeks", category: "Design", image: videoImg },
  { id: "photoshop-advanced", title: "Photoshop Step-Up – Advanced Editing Techniques", subtitle: "Pro-level retouching, compositing, and color grading", tag: "Advanced", level: "Advanced", duration: "5 weeks", category: "Design", image: photoshopImg },
  { id: "illustrator-beginners", title: "Illustrator for Beginners – Vector Design Basics", subtitle: "Build logos, icons, and illustrations confidently", tag: "Quick Skill", level: "Beginner", duration: "3 weeks", category: "Design", image: illustratorImg },
  { id: "branding-identity", title: "Branding & Visual Identity Design Course", subtitle: "Craft brand systems that win clients and customers", tag: "Advanced", level: "Intermediate", duration: "6 weeks", category: "Design", image: brandingImg },
  { id: "mobile-app-ui", title: "Mobile App UI Design – Real Projects", subtitle: "Ship App Store–ready iOS and Android designs", tag: "Advanced", level: "Intermediate", duration: "6 weeks", category: "Design", image: mobileUiImg },
  { id: "mern-fullstack", title: "Full Stack Web Development Course – MERN Stack", subtitle: "MongoDB, Express, React, and Node.js end-to-end", tag: "Advanced", level: "Advanced", duration: "16 weeks", category: "Coding", image: mernImg },
  { id: "frontend-dev", title: "Frontend Development – HTML, CSS, JavaScript Mastery", subtitle: "Build responsive, modern websites from zero", tag: "Beginner", level: "Beginner", duration: "10 weeks", category: "Coding", image: frontendImg },
  { id: "nodejs-backend", title: "Backend Development with Node.js – Complete Guide", subtitle: "REST APIs, databases, and authentication flows", tag: "Advanced", level: "Intermediate", duration: "9 weeks", category: "Coding", image: nodeImg },
  { id: "python-beginners", title: "Python for Beginners – Coding Essentials Course", subtitle: "Your first step into programming and automation", tag: "Beginner", level: "Beginner", duration: "8 weeks", category: "Coding", image: pythonImg },
  { id: "digital-marketing-complete", title: "Digital Marketing Mastery – Complete Course", subtitle: "Strategy, channels, funnels, and analytics in one course", tag: "Beginner", level: "Beginner", duration: "10 weeks", category: "Marketing", image: digitalMktImg },
  { id: "social-media-marketing", title: "Social Media Marketing – Instagram & Ads Course", subtitle: "Grow audiences and run conversion-driven campaigns", tag: "Beginner", level: "Beginner", duration: "5 weeks", category: "Marketing", image: socialImg },
  { id: "performance-marketing", title: "Performance Marketing – Paid Ads Strategy Mastery", subtitle: "Google, Meta, and YouTube ads that scale profitably", tag: "Advanced", level: "Advanced", duration: "8 weeks", category: "Marketing", image: perfMktImg },
  { id: "seo-mastery", title: "SEO Mastery Course – Rank on Google", subtitle: "Technical, on-page, and link-building that actually works", tag: "Advanced", level: "Intermediate", duration: "7 weeks", category: "Marketing", image: seoImg },
  { id: "data-analytics-fundamentals", title: "Data Analytics Fundamentals – Beginner to Advanced", subtitle: "Turn raw data into business decisions", tag: "Beginner", level: "Beginner", duration: "10 weeks", category: "Data", image: dataImg },
  { id: "excel-beginners", title: "Excel for Beginners – Data & Dashboards Course", subtitle: "Formulas, pivot tables, and reporting dashboards", tag: "Quick Skill", level: "Beginner", duration: "3 weeks", category: "Data", image: excelImg },
  { id: "sql-basics", title: "SQL Basics – Database Fundamentals Complete Guide", subtitle: "Query, join, and analyze data like an analyst", tag: "Quick Skill", level: "Beginner", duration: "4 weeks", category: "Data", image: sqlImg },
];

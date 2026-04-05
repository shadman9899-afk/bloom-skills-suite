import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, BarChart2, CheckCircle, ChevronDown, BookOpen, Award, Users, Headphones, FileText, Video, Briefcase, Star, Zap, Download, MessageCircle, Play, IndianRupee } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";

interface CourseDetailRow {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  level: string | null;
  category: string;
  image_url: string | null;
  total_modules: number;
}

// Mock course content data (in a real app, this would come from the database)
const courseContent = {
  "What You'll Learn": [
    "Master fundamental concepts and principles",
    "Apply knowledge through hands-on projects",
    "Develop problem-solving skills",
    "Build a strong portfolio of work",
    "Learn industry best practices and standards",
    "Prepare for professional certifications"
  ],
  "Course Content": [
    { title: "Introduction to the Course", duration: "15 min", type: "video" },
    { title: "Core Concepts & Fundamentals", duration: "45 min", type: "video" },
    { title: "Practical Applications", duration: "60 min", type: "video" },
    { title: "Hands-on Project", duration: "90 min", type: "project" },
    { title: "Assessment & Quiz", duration: "30 min", type: "quiz" },
    { title: "Final Project & Certification", duration: "120 min", type: "project" }
  ],
  "Requirements": [
    "Basic computer skills",
    "Stable internet connection",
    "Commitment to learning",
    "No prior experience required for beginner courses",
    "A modern web browser (Chrome, Firefox, Safari, or Edge)"
  ]
};

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetailRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string>("learn");
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: "instant" });
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, []);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!id) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, description, category, duration, level, image_url, total_modules")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Failed to fetch course detail", error);
        setCourse(null);
      } else {
        setCourse(data as CourseDetailRow);
      }
      setLoading(false);
    };

    void fetchCourseDetail();
  }, [id]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Convert price from USD to INR (assuming 1 USD = 85 INR, adjust as needed)
  const priceInINR = course ? Math.round(course.price * 85) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-64 bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse"></div>
              <div className="p-6 md:p-8">
                <div className="h-8 bg-slate-200 rounded-lg animate-pulse mb-4 w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse mb-2 w-5/6"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Course Not Found</h1>
              <p className="text-slate-600 mb-8">The course you're looking for doesn't exist or is not available.</p>
              <Link to="/courses">
                <Button className="bg-blue-600 hover:bg-blue-700">Back to Courses</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" ref={topRef}>
      <Navbar />

      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 pt-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-blue-600 transition-colors">Courses</Link>
            <span>/</span>
            <span className="text-slate-700 font-medium truncate">{course.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
          >
            <div className="relative h-48 md:h-64 lg:h-80 bg-gradient-to-r from-blue-600 to-purple-600">
              {course.image_url && (
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end md:items-center">
                <div className="text-white p-6 md:p-8">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-3">
                    {course.category}
                  </span>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{course.title}</h1>
                  <p className="text-sm md:text-base text-white/90 max-w-2xl line-clamp-2">{course.description}</p>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                    <span className="text-sm md:text-base">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <BarChart2 className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                    <span className="text-sm md:text-base">{course.level}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-600">Instructor: {course.instructor_name || "TBD"}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">${course.price}</div>
                  <div className="text-sm text-gray-500">One-time payment</div>
                </div>
              </div>

              <p className="text-slate-700 text-base md:text-lg leading-relaxed mb-6">{course.description}</p>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm md:text-base py-2 md:py-2.5">
                  <Play className="h-4 w-4 mr-2" />
                  Start Learning
                </Button>
                <Button variant="outline" className="flex-1 text-sm md:text-base py-2 md:py-2.5">
                  <Download className="h-4 w-4 mr-2" />
                  Download Syllabus
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Course Content Sections */}
          <div className="space-y-4 md:space-y-6">
            {/* What You'll Learn */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => toggleSection("learn")}
                className="w-full p-4 md:p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-600 flex-shrink-0" />
                  <h3 className="text-lg md:text-xl font-semibold text-slate-900">What You'll Learn</h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${expandedSection === "learn" ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {expandedSection === "learn" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-slate-100"
                  >
                    <div className="p-4 md:p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {courseContent["What You'll Learn"].map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 md:gap-3">
                            <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm md:text-base text-slate-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Course Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => toggleSection("content")}
                className="w-full p-4 md:p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-blue-600 flex-shrink-0" />
                  <h3 className="text-lg md:text-xl font-semibold text-slate-900">Course Content</h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${expandedSection === "content" ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {expandedSection === "content" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-slate-100"
                  >
                    <div className="p-4 md:p-6">
                      <div className="space-y-3 md:space-y-4">
                        {courseContent["Course Content"].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 md:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-2 md:gap-3">
                              {item.type === "video" && <Video className="h-4 w-4 md:h-5 md:w-5 text-blue-600 flex-shrink-0" />}
                              {item.type === "project" && <Briefcase className="h-4 w-4 md:h-5 md:w-5 text-purple-600 flex-shrink-0" />}
                              {item.type === "quiz" && <Star className="h-4 w-4 md:h-5 md:w-5 text-amber-600 flex-shrink-0" />}
                              <span className="text-sm md:text-base font-medium text-slate-700">{item.title}</span>
                            </div>
                            <span className="text-xs md:text-sm text-slate-500">{item.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => toggleSection("requirements")}
                className="w-full p-4 md:p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <Award className="h-5 w-5 md:h-6 md:w-6 text-purple-600 flex-shrink-0" />
                  <h3 className="text-lg md:text-xl font-semibold text-slate-900">Requirements</h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${expandedSection === "requirements" ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {expandedSection === "requirements" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-slate-100"
                  >
                    <div className="p-4 md:p-6">
                      <ul className="space-y-2 md:space-y-3">
                        {courseContent["Requirements"].map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2 md:gap-3 text-sm md:text-base text-slate-700">
                            <span className="text-blue-600 mt-0.5">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Instructor Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-5 md:p-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 mb-4 md:mb-6">
                <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="h-7 w-7 md:h-10 md:w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{course.instructor_name || "Expert Instructor"}</h3>
                  <p className="text-gray-600">Professional Developer & Educator</p>
                </div>
              </div>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                With over 10+ years of experience in the industry, our expert instructor brings real-world knowledge
                and practical insights to help you succeed in your learning journey. They have trained over 50,000+
                students globally and are passionate about making complex topics simple and accessible.
              </p>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 md:mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-10 text-center text-white"
          >
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
            <p className="text-lg opacity-90 mb-6">Join thousands of students who have transformed their careers with our courses.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Play className="h-5 w-5 mr-2" />
                Enroll Now - ${course.price}
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-slate-100 text-sm md:text-base">
                <MessageCircle className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                Ask Questions
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CourseDetail;
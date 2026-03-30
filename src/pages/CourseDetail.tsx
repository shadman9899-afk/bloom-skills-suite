import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, BarChart2, CheckCircle, ChevronDown, BookOpen, Award, Users, Headphones, FileText, Video, Briefcase, Star, Zap, Download, MessageCircle, Play } from "lucide-react";
import { useState, useEffect } from "react";
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

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetailRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 bg-gray-200 animate-pulse"></div>
              <div className="p-8">
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
            <p className="text-gray-600 mb-8">The course you're looking for doesn't exist or is not available.</p>
            <Link to="/courses">
              <Button>Back to Courses</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden mb-8"
          >
            <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 to-purple-600">
              {course.image_url && (
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
                  <p className="text-lg opacity-90">{course.category}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-600">{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart2 className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-600">{course.level}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Modules: {course.total_modules}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">Free</div>
                  <div className="text-sm text-muted-foreground">Lifetime access</div>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">{course.description}</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Play className="h-4 w-4 mr-2" />
                  Start Learning
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Syllabus
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Course Content Sections */}
          <div className="space-y-6">
            {/* What You'll Learn */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <button
                onClick={() => toggleSection("learn")}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">What You'll Learn</h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedSection === "learn" ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {expandedSection === "learn" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Master fundamental concepts and principles</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Apply knowledge through hands-on projects</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Develop problem-solving skills</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Build a strong portfolio of work</span>
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
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <button
                onClick={() => toggleSection("content")}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Course Content</h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedSection === "content" ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {expandedSection === "content" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Video className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">Introduction to the Course</span>
                        </div>
                        <span className="text-sm text-gray-600">15 min</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">Core Concepts</span>
                        </div>
                        <span className="text-sm text-gray-600">45 min</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">Practical Applications</span>
                        </div>
                        <span className="text-sm text-gray-600">60 min</span>
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
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <button
                onClick={() => toggleSection("requirements")}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Award className="h-6 w-6 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Requirements</h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedSection === "requirements" ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {expandedSection === "requirements" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <ul className="space-y-2 text-gray-700">
                      <li>• Basic computer skills</li>
                      <li>• Internet connection</li>
                      <li>• Commitment to learning</li>
                      <li>• No prior experience required for beginner courses</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Instructor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Expert Instructor</h3>
                  <p className="text-gray-600">Professional Developer & Educator</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                With years of experience in the industry, our instructors bring real-world knowledge and practical insights to help you succeed in your learning journey.
              </p>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white"
          >
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
            <p className="text-lg opacity-90 mb-6">Join thousands of students who have transformed their careers with our courses.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Play className="h-5 w-5 mr-2" />
                Enroll Now - Free
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <MessageCircle className="h-5 w-5 mr-2" />
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

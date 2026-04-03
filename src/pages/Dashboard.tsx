import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Play,
  BookOpen,
  LogOut,
  RefreshCw,
  Trophy,
  Clock,
  TrendingUp,
  ChevronRight,
  Star,
  CheckCircle2,
  Zap,
  CheckCircle,
  Circle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// ── Types ─────────────────────────────────────────────────────
interface EnrolledCourse {
  id: string;
  title: string;
  category: string;
  level: string | null;
  duration: string | null;
  progress: number;
  total_modules: number;
  completed_modules: number;
  image_url: string | null;
  thumbnail_url: string | null;
}

interface Course {
  id: string;
  title: string;
  category: string;
  level: string | null;
  duration: string | null;
}

// ── Constants ─────────────────────────────────────────────────
const categoryColors: Record<string, string> = {
  Design: "bg-pink-100 text-pink-700",
  Coding: "bg-blue-100 text-blue-700",
  Marketing: "bg-green-100 text-green-700",
  Data: "bg-purple-100 text-purple-700",
  Default: "bg-gray-100 text-gray-700",
};

const categoryGradients: Record<string, string> = {
  Design: "from-pink-500 to-rose-400",
  Coding: "from-blue-500 to-cyan-400",
  Marketing: "from-green-500 to-emerald-400",
  Data: "from-purple-500 to-violet-400",
  Default: "from-gray-500 to-gray-400",
};

// Quick Skills static data (can be moved to DB later)
const QUICK_SKILLS = [
  { name: "Photoshop", duration: "2h", category: "Quick Skill" },
  { name: "Illustrator", duration: "3h", category: "Quick Skill" },
  { name: "Figma", duration: "2.5h", category: "Quick Skill" },
  { name: "Excel", duration: "1.5h", category: "Quick Skill" },
  { name: "SQL", duration: "3h", category: "Quick Skill" },
  { name: "Premiere Pro", duration: "4h", category: "Quick Skill" },
];

// Student Journey steps
const JOURNEY_STEPS = [
  { label: "Account Created", key: "account" },
  { label: "First Enrollment", key: "enrolled" },
  { label: "Module Completed", key: "module" },
  { label: "Course Halfway", key: "halfway" },
  { label: "Course Completed", key: "completed" },
  { label: "Certificate Earned", key: "certificate" },
];

// ── Student Journey Component ─────────────────────────────────
const StudentJourney = ({
  enrolledCourses,
}: {
  enrolledCourses: EnrolledCourse[];
}) => {
  const hasEnrolled = enrolledCourses.length > 0;
  const hasModule = enrolledCourses.some((c) => c.completed_modules > 0);
  const hasHalfway = enrolledCourses.some((c) => c.progress >= 50);
  const hasCompleted = enrolledCourses.some((c) => c.progress === 100);
  const hasCertificate = enrolledCourses.filter((c) => c.progress === 100).length >= 1;

  const getStatus = (key: string): "done" | "active" | "pending" => {
    switch (key) {
      case "account": return "done";
      case "enrolled": return hasEnrolled ? "done" : "active";
      case "module": return hasModule ? "done" : hasEnrolled ? "active" : "pending";
      case "halfway": return hasHalfway ? "done" : hasModule ? "active" : "pending";
      case "completed": return hasCompleted ? "done" : hasHalfway ? "active" : "pending";
      case "certificate": return hasCertificate ? "done" : hasCompleted ? "active" : "pending";
      default: return "pending";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-blue-500" />
        Student Journey
      </h3>
      <div className="space-y-3">
        {JOURNEY_STEPS.map((step, i) => {
          const status = getStatus(step.key);
          return (
            <div key={step.key} className="flex items-center gap-3">
              {/* Icon */}
              <div className="relative flex items-center justify-center w-6 flex-shrink-0">
                {status === "done" ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : status === "active" ? (
                  <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
                {/* Connector line */}
                {i < JOURNEY_STEPS.length - 1 && (
                  <div
                    className={`absolute top-5 left-1/2 -translate-x-1/2 w-0.5 h-3 ${status === "done" ? "bg-green-300" : "bg-gray-200"
                      }`}
                  />
                )}
              </div>
              {/* Label */}
              <span
                className={`text-sm font-medium ${status === "done"
                  ? "text-gray-700"
                  : status === "active"
                    ? "text-blue-600"
                    : "text-gray-400"
                  }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Quick Skills Component ────────────────────────────────────
const QuickSkillsSection = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
        <Zap className="w-4 h-4 text-orange-500" />
        Quick Skills
      </h3>
      <span className="text-xs text-gray-400">Boost your learning in 2-4h</span>
    </div>
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {QUICK_SKILLS.map((skill) => (
        <button
          key={skill.name}
          className="flex flex-col items-center p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group"
        >
          <span className="text-sm font-medium text-gray-800 group-hover:text-orange-700 text-center">
            {skill.name}
          </span>
          <span className="text-xs text-orange-500 font-medium mt-1">
            {skill.category}
          </span>
          <span className="text-xs text-gray-400 mt-0.5">{skill.duration}</span>
        </button>
      ))}
    </div>
  </div>
);

// ── Recommended Next Component ────────────────────────────────
const RecommendedNext = ({
  enrolledCourses,
  allCourses,
}: {
  enrolledCourses: EnrolledCourse[];
  allCourses: Course[];
}) => {
  const enrolledIds = new Set(enrolledCourses.map((c) => c.id));
  const recommended = allCourses
    .filter((c) => !enrolledIds.has(c.id))
    .slice(0, 3);

  if (recommended.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          🔥 Recommended Next
        </h3>
        <Link
          to="/courses"
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          View All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommended.map((course) => {
          const badge =
            categoryColors[course.category] || categoryColors.Default;
          return (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all group"
            >
              <h4 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                {course.title}
              </h4>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}
                >
                  {course.category}
                </span>
                {course.level && (
                  <span className="text-xs text-gray-400">{course.level}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

// ── Course Card Component ─────────────────────────────────────
const CourseCard = ({
  course,
  index,
}: {
  course: EnrolledCourse;
  index: number;
}) => {
  const gradient = categoryGradients[course.category] || categoryGradients.Default;
  const badge = categoryColors[course.category] || categoryColors.Default;
  const isCompleted = course.progress === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
    >
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden">
        {course.thumbnail_url || course.image_url ? (
          <img
            src={course.thumbnail_url || course.image_url || ""}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <BookOpen className="w-12 h-12 text-white/80" />
          </div>
        )}
        {isCompleted && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge}`}>
            {course.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
          {course.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          {course.level && <span>{course.level}</span>}
          {course.duration && (
            <>
              <span>·</span>
              <span>{course.duration}</span>
            </>
          )}
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{course.progress}% complete</span>
            <span>
              {course.completed_modules}/{course.total_modules} modules
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isCompleted ? "bg-green-500" : "bg-blue-500"
                }`}
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/courses/${course.id}`}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${isCompleted
            ? "bg-green-50 text-green-700 hover:bg-green-100"
            : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
        >
          {isCompleted ? (
            <>
              <Star className="w-4 h-4" />
              Review Course
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              {course.progress > 0 ? "Continue" : "Start Learning"}
            </>
          )}
        </Link>
      </div>
    </motion.div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────
const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch enrollments
      const { data: enrollments, error: enrollError } = await supabase
        .from("enrollments")
        .select(`
          id,
          progress,
          completed_modules,
          courses (
            id,
            title,
            category,
            duration,
            level,
            total_modules,
            image_url,
            thumbnail_url
          )
        `)
        .eq("user_id", user.id);

      if (enrollError) throw enrollError;

      const courses: EnrolledCourse[] = (enrollments || []).map(
        (e: any) => ({
          id: e.courses.id,
          title: e.courses.title,
          category: e.courses.category,
          level: e.courses.level,
          duration: e.courses.duration,
          progress: e.progress || 0,
          total_modules: e.courses.total_modules || 10,
          completed_modules: e.completed_modules || 0,
          image_url: e.courses.image_url,
          thumbnail_url: e.courses.thumbnail_url,
        })
      );
      setEnrolledCourses(courses);

      // Fetch all courses for recommendations
      const { data: allCoursesData } = await supabase
        .from("courses")
        .select("id, title, category, level, duration")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      setAllCourses((allCoursesData as Course[]) || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const displayName =
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "Learner";

  const totalProgress =
    enrolledCourses.length > 0
      ? Math.round(
        enrolledCourses.reduce((sum, c) => sum + c.progress, 0) /
        enrolledCourses.length
      )
      : 0;

  const completedCourses = enrolledCourses.filter((c) => c.progress === 100).length;
  const inProgressCourses = enrolledCourses.filter((c) => c.progress > 0 && c.progress < 100);

  // ── Loading ──────────────────────────────────────────────────
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-36 bg-gray-200 rounded-2xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 bg-gray-200 rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="h-64 bg-gray-200 rounded-xl" />
              <div className="md:col-span-3 h-64 bg-gray-200 rounded-xl" />
            </div>
            <div className="h-32 bg-gray-200 rounded-xl" />
            <div className="h-40 bg-gray-200 rounded-xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* ── Hero Welcome Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 right-32 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">
                Welcome back 👋
              </p>
              <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
              <p className="text-blue-100 text-sm">
                {enrolledCourses.length > 0
                  ? `You're enrolled in ${enrolledCourses.length} course${enrolledCourses.length > 1 ? "s" : ""
                  }. Keep going!`
                  : "Start your learning journey today."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={refreshUserData}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <Link
                to="/courses"
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Browse Courses
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-red-500/30 rounded-lg text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: BookOpen, label: "Enrolled", value: enrolledCourses.length, color: "text-blue-600", bg: "bg-blue-50" },
            { icon: TrendingUp, label: "Avg Progress", value: `${totalProgress}%`, color: "text-purple-600", bg: "bg-purple-50" },
            { icon: Trophy, label: "Completed", value: completedCourses, color: "text-yellow-600", bg: "bg-yellow-50" },
            { icon: Clock, label: "In Progress", value: inProgressCourses.length, color: "text-green-600", bg: "bg-green-50" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <div
                className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-3`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Journey + Courses Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {/* Student Journey Sidebar */}
          <div className="md:col-span-1">
            <StudentJourney enrolledCourses={enrolledCourses} />
          </div>

          {/* Continue Learning or Empty State */}
          <div className="md:col-span-3">
            {enrolledCourses.length > 0 ? (
              <div>
                {inProgressCourses.length > 0 && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-gray-900">
                        Continue Learning
                      </h2>
                      <Link
                        to="/courses"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                      >
                        View all{" "}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {inProgressCourses.slice(0, 3).map((course, i) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          index={i}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* All enrolled courses below */}
                {enrolledCourses.length > inProgressCourses.length && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-gray-900">
                        My Courses
                      </h2>
                      <span className="text-sm text-gray-400">
                        {enrolledCourses.length} enrolled
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {enrolledCourses
                        .filter((c) => c.progress === 0 || c.progress === 100)
                        .map((course, i) => (
                          <CourseCard
                            key={course.id}
                            course={course}
                            index={i}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Empty State */
              <div className="h-full flex items-center justify-center bg-white rounded-2xl border border-dashed border-gray-200 py-16">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No courses yet
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                    Browse our catalog and enroll in your first course to start
                    learning.
                  </p>
                  <Link
                    to="/courses"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Browse Courses
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Quick Skills ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <QuickSkillsSection />
        </motion.div>

        {/* ── Recommended Next ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <RecommendedNext
            enrolledCourses={enrolledCourses}
            allCourses={allCourses}
          />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;

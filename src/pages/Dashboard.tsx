import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, BookOpen, LogOut, RefreshCw } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import StatsRow from "@/components/dashboard/StatsRow";
import CourseProgress from "@/components/dashboard/CourseProgress";
import JourneyTimeline from "@/components/dashboard/JourneyTimeline";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import RecommendedCourses from "@/components/dashboard/RecommendedCourses";

interface EnrolledCourse {
  id: string;
  title: string;
  progress: number;
  total_modules: number;
  completed_modules: number;
  category: string;
}

interface ActivityItem {
  action: string;
  icon: string;
  created_at: string;
}

interface RecommendedCourse {
  id: string;
  title: string;
  category: string;
  level: string | null;
  duration: string | null;
}

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ display_name: string | null } | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [avgScore, setAvgScore] = useState<number | null>(null);
  const [totalHours, setTotalHours] = useState(0);
  const [recommended, setRecommended] = useState<RecommendedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const clearAndRefresh = async () => {
    console.log('🧹 Clearing local storage and refreshing...');

    // Clear local storage
    localStorage.clear();

    // Sign out and redirect to login
    await signOut();
    navigate('/login');
  };

  const fetchData = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    const [profileRes, enrollRes, activityRes, scoresRes, coursesRes] = await Promise.all([
      // Temporarily disabled profiles query since table doesn't exist
      // supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle(),
      Promise.resolve({ data: null }), // Return null for profile
      supabase.from("enrollments").select("id, progress, completed_modules, course_id, courses(title, total_modules, category)").eq("user_id", user.id),
      supabase.from("activity_log").select("action, icon, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
      supabase.from("quiz_scores").select("score").eq("user_id", user.id),
      supabase.from("courses").select("id, title, category, level, duration"),
    ]);

    setProfile(profileRes.data);

    const enrolledIds = new Set<string>();
    if (enrollRes.data) {
      type EnrollmentRow = {
        id: string;
        course_id: string;
        progress: number;
        completed_modules: number;
        courses?: { title?: string; total_modules?: number; category?: string } | null;
      };

      const enrollData = enrollRes.data as EnrollmentRow[];

      setEnrolledCourses(
        enrollData.map((e) => {
          enrolledIds.add(e.course_id);
          return {
            id: e.id,
            title: e.courses?.title ?? "Unknown Course",
            progress: e.progress,
            total_modules: e.courses?.total_modules ?? 1,
            completed_modules: e.completed_modules,
            category: e.courses?.category ?? "",
          };
        })
      );

      const totalMods = enrollData.reduce((a, e) => a + e.completed_modules, 0);
      setTotalHours(Math.round(totalMods * 2.5));
    }

    setActivity(activityRes.data ?? []);

    if (scoresRes.data && scoresRes.data.length > 0) {
      const scoreData = scoresRes.data as Array<{ score: number }>;
      setAvgScore(Math.round(scoreData.reduce((a, s) => a + s.score, 0) / scoreData.length));
    }

    if (coursesRes.data) {
      const courseData = coursesRes.data as RecommendedCourse[];
      setRecommended(courseData.filter((c) => !enrolledIds.has(c.id)).slice(0, 3));
    }

    setLoading(false);
  }, [user]);

  const refreshUserData = async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }

    void fetchData();
  }, [authLoading, user, navigate, fetchData]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-10 space-y-8">
          <Skeleton className="h-10 w-80" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-24" />)}
          </div>
          <Skeleton className="h-48" />
        </main>
      </div>
    );
  }

  const getUserDisplayName = () => {
    if (profile?.display_name && profile.display_name.trim()) {
      return profile.display_name;
    }

    const metadata = user?.user_metadata as Record<string, unknown> | undefined;
    const fullName = metadata?.full_name;

    if (typeof fullName === "string" && fullName.trim()) {
      return fullName;
    }

    // ✅ No fallback text
    return "Admin"; // Return empty string instead of "User"
  };

  const displayName = getUserDisplayName();

  // Debug logging to check user data
  console.log('👤 Current user object:', {
    id: user?.id,
    email: user?.email,
    user_metadata: user?.user_metadata,
    app_metadata: user?.app_metadata
  });
  console.log('📋 Profile data:', profile);
  console.log('📝 Display name being used:', displayName);
  const totalProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCourses.reduce((a, c) => a + c.progress, 0) / enrolledCourses.length)
    : 0;
  const totalModulesCompleted = enrolledCourses.reduce((a, c) => a + c.completed_modules, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10 space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome {displayName} 👋</h1>
            <p className="text-muted-foreground mt-1">
              {enrolledCourses.length > 0
                ? <>You've completed <span className="font-semibold text-primary">{totalProgress}%</span> of your active courses. Keep going!</>
                : "You haven't enrolled in any courses yet. Explore our catalog!"}
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshUserData}
              disabled={refreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAndRefresh}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Clear & Re-login
            </Button>
            <Button variant="hero" asChild>
              <Link to="/courses"><Play className="mr-2 h-4 w-4" />Continue Learning</Link>
            </Button>
            <Button variant="orange" asChild>
              <Link to="/courses"><BookOpen className="mr-2 h-4 w-4" />Explore Courses</Link>
            </Button>
            <Button variant="outline" size="icon" onClick={() => { signOut(); navigate("/"); }} title="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <StatsRow
          coursesEnrolled={enrolledCourses.length}
          modulesCompleted={totalModulesCompleted}
          hoursLearned={totalHours}
          avgScore={avgScore}
          streak={totalModulesCompleted > 0 ? Math.min(totalModulesCompleted, 7) : 0}
        />

        {/* Course Progress */}
        <CourseProgress courses={enrolledCourses} />

        <div className="grid gap-6 lg:grid-cols-2">
          <JourneyTimeline />
          <RecentActivity activity={activity} />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Recommended Courses */}
        <RecommendedCourses courses={recommended} />
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

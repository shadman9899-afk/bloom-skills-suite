import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, BookOpen, LogOut } from "lucide-react";
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

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }

    const fetchData = async () => {
      setLoading(true);

      const [profileRes, enrollRes, activityRes, scoresRes, coursesRes] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle(),
        supabase.from("enrollments").select("id, progress, completed_modules, course_id, courses(title, total_modules, category)").eq("user_id", user.id),
        supabase.from("activity_log").select("action, icon, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("quiz_scores").select("score").eq("user_id", user.id),
        supabase.from("courses").select("id, title, category, level, duration"),
      ]);

      setProfile(profileRes.data);

      const enrolledIds = new Set<string>();
      if (enrollRes.data) {
        setEnrolledCourses(
          enrollRes.data.map((e: any) => {
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
        const totalMods = enrollRes.data.reduce((a: number, e: any) => a + e.completed_modules, 0);
        setTotalHours(Math.round(totalMods * 2.5));
      }

      setActivity(activityRes.data ?? []);

      if (scoresRes.data && scoresRes.data.length > 0) {
        setAvgScore(Math.round(scoresRes.data.reduce((a: number, s: any) => a + s.score, 0) / scoresRes.data.length));
      }

      if (coursesRes.data) {
        setRecommended(coursesRes.data.filter((c: any) => !enrolledIds.has(c.id)).slice(0, 3));
      }

      setLoading(false);
    };

    fetchData();
  }, [user, authLoading, navigate]);

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

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Student";
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
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {displayName} 👋</h1>
            <p className="text-muted-foreground mt-1">
              {enrolledCourses.length > 0
                ? <>You've completed <span className="font-semibold text-primary">{totalProgress}%</span> of your active courses. Keep going!</>
                : "You haven't enrolled in any courses yet. Explore our catalog!"}
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
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

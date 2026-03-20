import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, Trophy, Clock, TrendingUp, Play,
  CheckCircle2, Circle, ChevronRight, BarChart3, Calendar, LogOut
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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

const iconMap: Record<string, React.ElementType> = {
  CheckCircle2, Play, Trophy, BarChart3, BookOpen, Clock,
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const milestones = [
  { label: "Enrolled", done: true },
  { label: "First Module Complete", done: true },
  { label: "Mid-Course Project", done: true },
  { label: "Advanced Modules", done: false, active: true },
  { label: "Final Assessment", done: false },
  { label: "Certificate Earned", done: false },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ display_name: string | null } | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [avgScore, setAvgScore] = useState<number | null>(null);
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }

    const fetchData = async () => {
      setLoading(true);

      const [profileRes, enrollRes, activityRes, scoresRes] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle(),
        supabase.from("enrollments").select("id, progress, completed_modules, course_id, courses(title, total_modules, category)").eq("user_id", user.id),
        supabase.from("activity_log").select("action, icon, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("quiz_scores").select("score").eq("user_id", user.id),
      ]);

      setProfile(profileRes.data);

      if (enrollRes.data) {
        setEnrolledCourses(
          enrollRes.data.map((e: any) => ({
            id: e.id,
            title: e.courses?.title ?? "Unknown Course",
            progress: e.progress,
            total_modules: e.courses?.total_modules ?? 1,
            completed_modules: e.completed_modules,
            category: e.courses?.category ?? "",
          }))
        );
        const totalMods = enrollRes.data.reduce((a: number, e: any) => a + e.completed_modules, 0);
        setTotalHours(Math.round(totalMods * 2.5));
      }

      setActivity(activityRes.data ?? []);

      if (scoresRes.data && scoresRes.data.length > 0) {
        setAvgScore(Math.round(scoresRes.data.reduce((a: number, s: any) => a + s.score, 0) / scoresRes.data.length));
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}
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
        <motion.div {...fadeUp} className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
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

        {/* Stats Row */}
        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Courses Enrolled", value: String(enrolledCourses.length), icon: BookOpen, color: "text-primary" },
            { label: "Modules Completed", value: String(totalModulesCompleted), icon: CheckCircle2, color: "text-secondary" },
            { label: "Hours Learned", value: String(totalHours), icon: Clock, color: "text-primary" },
            { label: "Avg. Score", value: avgScore !== null ? `${avgScore}%` : "—", icon: TrendingUp, color: "text-secondary" },
          ].map((stat) => (
            <Card key={stat.label} className="shadow-card hover:shadow-card-hover transition-shadow duration-200">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Progress Tracker */}
        {enrolledCourses.length > 0 && (
          <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Course Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{course.title}</p>
                        <p className="text-xs text-muted-foreground">{course.completed_modules}/{course.total_modules} modules • {course.category}</p>
                      </div>
                      <span className="text-sm font-semibold text-primary">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Journey Timeline */}
          <motion.div {...fadeUp} transition={{ delay: 0.3 }}>
            <Card className="shadow-card h-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" /> Learning Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-0">
                  {milestones.map((m, i) => (
                    <div key={i} className="flex gap-4 pb-6 last:pb-0">
                      <div className="flex flex-col items-center">
                        {m.done ? (
                          <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                        ) : m.active ? (
                          <div className="h-5 w-5 rounded-full border-2 border-primary bg-primary/20 shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground/40 shrink-0" />
                        )}
                        {i < milestones.length - 1 && (
                          <div className={`w-0.5 flex-1 mt-1 ${m.done ? "bg-secondary" : "bg-border"}`} />
                        )}
                      </div>
                      <div className="pb-1">
                        <p className={`text-sm font-medium ${m.done ? "text-foreground" : m.active ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                          {m.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div {...fadeUp} transition={{ delay: 0.4 }}>
            <Card className="shadow-card h-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-secondary" /> Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No activity yet. Start a course to see your progress here!</p>
                ) : (
                  activity.map((item, i) => {
                    const Icon = iconMap[item.icon] || CheckCircle2;
                    return (
                      <div key={i} className="flex items-start gap-3 group cursor-default">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent group-hover:bg-primary/10 transition-colors">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.action}</p>
                          <p className="text-xs text-muted-foreground">{timeAgo(item.created_at)}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-1" />
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Play, BookOpen, LogOut, GraduationCap, CheckCircle2, Clock,
  TrendingUp, Flame, Award, MessageSquare, HelpCircle, ArrowRight,
  Sparkles, ChevronRight, Download, Zap, LayoutDashboard, Compass, User,
} from "lucide-react";
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

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
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
              id: e.id, title: e.courses?.title ?? "Unknown Course",
              progress: e.progress, total_modules: e.courses?.total_modules ?? 1,
              completed_modules: e.completed_modules, category: e.courses?.category ?? "",
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
        <main className="container py-10 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Student";
  const totalProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length)
    : 0;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-[240px] border-r border-border bg-card p-6 hidden lg:flex flex-col shrink-0">
        <Link to="/" className="flex items-center gap-2.5 mb-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
              <p className="text-xs text-muted-foreground">
                Active learning paths
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
              <Progress className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProgress}%</div>
              <p className="text-xs text-muted-foreground">
                Overall completion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                Earned this year
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enrolled Courses */}
        {enrolledCourses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Courses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">{course.category}</p>
                      <div className="mt-2">
                        <Progress value={course.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {course.progress}% complete
                        </p>
                      </div>
                    </div>
                    <Button asChild>
                      <Link to={`/course/${course.id}`}>
                        <Play className="mr-2 h-4 w-4" />
                        Continue
                      </Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                  <Link to="/courses">
                    <BookOpen className="h-6 w-6" />
                    <span>Browse Courses</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                  <Link to="/ai-chat">
                    <BookOpen className="h-6 w-6" />
                    <span>AI Assistant</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                  <Link to="/support">
                    <BookOpen className="h-6 w-6" />
                    <span>Get Support</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

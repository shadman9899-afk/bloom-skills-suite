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

const quickSkills = [
  { title: "Photoshop", tag: "Quick Skill", duration: "2h" },
  { title: "Illustrator", tag: "Quick Skill", duration: "3h" },
  { title: "Figma", tag: "Quick Skill", duration: "2.5h" },
  { title: "Excel", tag: "Quick Skill", duration: "1.5h" },
  { title: "SQL", tag: "Quick Skill", duration: "3h" },
  { title: "Premiere Pro", tag: "Quick Skill", duration: "4h" },
];

const iconMap: Record<string, React.ElementType> = {
  CheckCircle2, Play, TrendingUp, BookOpen, Clock, Award,
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const sideNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", active: true },
  { icon: BookOpen, label: "My Courses", path: "/courses" },
  { icon: Compass, label: "Explore", path: "/courses" },
  { icon: Award, label: "Certificates", path: "#certificates" },
  { icon: User, label: "Profile", path: "#" },
];

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
      <div className="min-h-screen bg-background flex">
        <div className="w-[240px] border-r border-border bg-card p-6 hidden lg:block">
          <Skeleton className="h-8 w-32 mb-8" />
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-10 w-full mb-2" />)}
        </div>
        <main className="flex-1 p-8 space-y-6">
          <Skeleton className="h-10 w-80" />
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4"><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /></div>
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
  const streak = totalModulesCompleted > 0 ? Math.min(totalModulesCompleted, 7) : 0;
  const currentCourse = enrolledCourses.length > 0
    ? enrolledCourses.reduce((a, b) => (a.progress < b.progress && a.progress > 0 ? a : b))
    : null;
  const completedCourses = enrolledCourses.filter(c => c.progress >= 100);
  const ongoingCourses = enrolledCourses.filter(c => c.progress < 100);

  const milestones = [
    { label: "Account Created", done: true },
    { label: "First Enrollment", done: enrolledCourses.length > 0 },
    { label: "Module Completed", done: totalModulesCompleted > 0 },
    { label: "Course Halfway", done: enrolledCourses.some(c => c.progress >= 50), active: enrolledCourses.some(c => c.progress > 0 && c.progress < 50) },
    { label: "Course Completed", done: completedCourses.length > 0 },
    { label: "Certificate Earned", done: completedCourses.length > 0 },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-[240px] border-r border-border bg-card p-6 hidden lg:flex flex-col shrink-0">
        <Link to="/" className="flex items-center gap-2.5 mb-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">Slate Academy</span>
        </Link>

        <nav className="space-y-1 flex-1">
          {sideNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                item.active
                  ? "bg-accent text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => { signOut(); navigate("/"); }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

          {/* SECTION 1: Welcome + Primary CTA */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome back, {displayName} 👋</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  {enrolledCourses.length > 0
                    ? totalProgress >= 80 ? "You're almost there! Keep pushing 🔥" : `You've completed ${totalProgress}% of your courses. Keep going!`
                    : "Start your journey — explore our courses!"}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="hero" className="rounded-xl h-11 px-5" asChild>
                  <Link to="/courses"><Play className="mr-2 h-4 w-4" />Resume Learning</Link>
                </Button>
                <Button variant="orange" className="rounded-xl h-11 px-5" asChild>
                  <Link to="/courses"><BookOpen className="mr-2 h-4 w-4" />Explore</Link>
                </Button>
              </div>
            </div>

            {/* Current Course - Hero Card */}
            {currentCourse && (
              <Card className="shadow-card border-primary/10 bg-gradient-to-br from-accent to-background overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">CURRENT COURSE</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{currentCourse.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {currentCourse.completed_modules}/{currentCourse.total_modules} modules completed • {currentCourse.category}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Progress value={currentCourse.progress} className="h-3 rounded-full" />
                    </div>
                    <span className="text-lg font-bold text-primary">{currentCourse.progress}%</span>
                  </div>
                  <Button variant="hero" className="mt-4 rounded-xl" asChild>
                    <Link to="/courses">Resume <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* SECTION 2: Stats Row */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="grid gap-3 grid-cols-2 lg:grid-cols-4"
          >
            {[
              { label: "Enrolled", value: String(enrolledCourses.length), icon: BookOpen, iconColor: "text-primary" },
              { label: "Completed", value: String(totalModulesCompleted), icon: CheckCircle2, iconColor: "text-secondary" },
              { label: "Hours", value: String(totalHours), icon: Clock, iconColor: "text-primary" },
              { label: "Streak", value: `${streak}d`, icon: Flame, iconColor: "text-destructive" },
            ].map((stat) => (
              <Card key={stat.label} className="shadow-card hover:shadow-card-hover transition-shadow duration-200 group cursor-default">
                <CardContent className="flex items-center gap-3.5 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent group-hover:scale-105 transition-transform">
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* SECTION 3: Your Journey + Continue Learning */}
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Journey Timeline */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="shadow-card h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold text-foreground">Your Journey</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-0">
                    {milestones.map((m, i) => (
                      <div key={i} className="flex gap-3.5 pb-5 last:pb-0">
                        <div className="flex flex-col items-center">
                          {m.done ? (
                            <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                          ) : m.active ? (
                            <div className="h-5 w-5 rounded-full border-2 border-primary bg-primary/20 shrink-0 animate-pulse" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-border shrink-0" />
                          )}
                          {i < milestones.length - 1 && (
                            <div className={`w-0.5 flex-1 mt-1 ${m.done ? "bg-secondary" : "bg-border"}`} />
                          )}
                        </div>
                        <p className={`text-sm ${m.done ? "font-medium text-foreground" : m.active ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                          {m.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Continue Learning */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}
              className="lg:col-span-3"
            >
              <Card className="shadow-card h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold text-foreground">Continue Learning</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ongoingCourses.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground text-sm mb-3">No courses in progress</p>
                      <Button variant="orange" size="sm" className="rounded-xl" asChild>
                        <Link to="/courses">Browse Courses</Link>
                      </Button>
                    </div>
                  ) : (
                    ongoingCourses.map((course) => (
                      <div key={course.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/40 transition-colors group">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{course.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {course.completed_modules}/{course.total_modules} modules
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Progress value={course.progress} className="h-1.5 flex-1" />
                            <span className="text-xs font-semibold text-primary">{course.progress}%</span>
                          </div>
                        </div>
                        <Button variant="hero" size="sm" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shrink-0" asChild>
                          <Link to="/courses">Continue</Link>
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* SECTION 4: Quick Skills */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
            <Card className="shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-secondary" /> Quick Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {quickSkills.map((skill) => (
                    <Link
                      key={skill.title}
                      to="/courses"
                      className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 hover:shadow-card-hover hover:border-primary/20 transition-all group text-center"
                    >
                      <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{skill.title}</p>
                      <span className="text-[10px] font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">{skill.tag}</span>
                      <span className="text-xs text-muted-foreground">{skill.duration}</span>
                      <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">Start →</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* SECTION 5: Recommended Next */}
          {recommended.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}>
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-secondary" /> Recommended Next
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs" asChild>
                    <Link to="/courses">View All <ArrowRight className="ml-1 h-3 w-3" /></Link>
                  </Button>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {recommended.map((course) => (
                    <Link
                      key={course.id}
                      to={`/courses/${course.id}`}
                      className="group rounded-xl border border-border p-4 hover:shadow-card-hover hover:border-primary/20 transition-all"
                    >
                      <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{course.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {course.category} • {course.level ?? "All Levels"}
                      </p>
                      {enrolledCourses.length > 0 && (
                        <p className="text-xs text-secondary font-medium mt-2">
                          After {enrolledCourses[0].category} → Try this
                        </p>
                      )}
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* SECTION 6: Activity / Tracking */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
            <Card className="shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-secondary" /> Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activity.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No activity yet. Start a course to track your progress!</p>
                ) : (
                  <div className="space-y-3">
                    {activity.map((item, i) => {
                      const Icon = iconMap[item.icon] || CheckCircle2;
                      return (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-sm text-foreground flex-1 truncate">{item.action}</p>
                          <span className="text-xs text-muted-foreground shrink-0">{timeAgo(item.created_at)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{totalHours}h</p>
                    <p className="text-xs text-muted-foreground">Total Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{avgScore !== null ? `${avgScore}%` : "—"}</p>
                    <p className="text-xs text-muted-foreground">Avg Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{streak}d</p>
                    <p className="text-xs text-muted-foreground">Streak 🔥</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* SECTION 7: Certificates */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.45 }}
            id="certificates"
          >
            <Card className="shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-secondary" /> Certificates
                </CardTitle>
              </CardHeader>
              <CardContent>
                {completedCourses.length === 0 ? (
                  <div className="text-center py-6">
                    <Award className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Complete a course to earn your first certificate!</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">You're almost there 💪</p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {completedCourses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-accent/30">
                        <div>
                          <p className="font-medium text-foreground text-sm">{course.title}</p>
                          <p className="text-xs text-muted-foreground">{course.category} • Completed ✓</p>
                        </div>
                        <Button variant="ghost" size="sm" className="shrink-0">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* SECTION 8: Support / Help */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
            <Card className="shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-foreground">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button variant="heroOutline" className="h-auto flex-col gap-2 py-5 rounded-xl" asChild>
                  <Link to="/ai-chat">
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-xs font-medium">AI Assistant</span>
                  </Link>
                </Button>
                <Button variant="orangeOutline" className="h-auto flex-col gap-2 py-5 rounded-xl" asChild>
                  <Link to="/support">
                    <HelpCircle className="h-5 w-5" />
                    <span className="text-xs font-medium">Get Support</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bottom spacing */}
          <div className="h-4" />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

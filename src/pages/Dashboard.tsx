import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, BookOpen, LogOut, RefreshCw } from "lucide-react";
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

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const clearAndRefresh = async () => {
    console.log("🧹 Clearing local storage and refreshing...");
    localStorage.clear();
    await signOut();
    navigate("/login");
  };

  // ✅ FIXED: Normal function (no useCallback)
  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: enrollments, error: enrollError } = await supabase
        .from("enrollments")
        .select(`
          id,
          progress,
          courses (
            id,
            title,
            category,
            duration,
            level
          )
        `)
        .eq("user_id", user.id);

      if (enrollError) {
        console.error("Error fetching enrollments:", enrollError);
      } else {
        const courses: EnrolledCourse[] = (enrollments || []).map((enrollment: any) => ({
          id: enrollment.courses.id,
          title: enrollment.courses.title,
          progress: enrollment.progress || 0,
          total_modules: 10,
          completed_modules: Math.floor((enrollment.progress || 0) / 10),
          category: enrollment.courses.category,
        }));
        setEnrolledCourses(courses);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // ✅ FIXED: Clean useEffect
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-10 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const displayName =
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "User";

  const totalProgress =
    enrolledCourses.length > 0
      ? Math.round(
        enrolledCourses.reduce((sum, course) => sum + course.progress, 0) /
        enrolledCourses.length
      )
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10 space-y-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">
              Welcome {displayName} 👋
            </h1>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <Button onClick={refreshUserData} disabled={refreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Button onClick={clearAndRefresh}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>

            <Button asChild>
              <Link to="/courses">
                <Play className="mr-2 h-4 w-4" />
                Continue
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Courses</CardTitle>
            </CardHeader>
            <CardContent>
              {enrolledCourses.length}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {totalProgress}%
            </CardContent>
          </Card>
        </div>

        {/* Courses */}
        {enrolledCourses.map((course) => (
          <Card key={course.id}>
            <CardContent className="p-4">
              <h3>{course.title}</h3>
              <Progress value={course.progress} />
              <Link to={`/course/${course.id}`}>
                <Button>Continue</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
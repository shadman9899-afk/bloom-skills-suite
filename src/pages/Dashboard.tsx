import { useCallback, useEffect, useState } from "react";
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
    console.log('🧹 Clearing local storage and refreshing...');
    localStorage.clear();
    await signOut();
    navigate('/login');
  };

  const fetchData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch enrolled courses
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
        const courses: EnrolledCourse[] = (enrollments || []).map(enrollment => ({
          id: enrollment.courses.id,
          title: enrollment.courses.title,
          progress: enrollment.progress || 0,
          total_modules: 10, // Placeholder
          completed_modules: Math.floor((enrollment.progress || 0) / 10),
          category: enrollment.courses.category
        }));
        setEnrolledCourses(courses);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refreshUserData = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

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

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';
  const totalProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length)
    : 0;

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
            <Button variant="default" asChild>
              <Link to="/courses">
                <Play className="mr-2 h-4 w-4" />
                Continue Learning
              </Link>
            </Button>
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

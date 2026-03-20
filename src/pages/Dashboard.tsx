import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, Trophy, Clock, TrendingUp, Play,
  CheckCircle2, Circle, ChevronRight, BarChart3, Calendar
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const enrolledCourses = [
  { id: 1, title: "UI/UX Design Fundamentals", progress: 72, modules: 12, completed: 9, category: "Design" },
  { id: 3, title: "React & TypeScript Bootcamp", progress: 45, modules: 10, completed: 4, category: "Development" },
  { id: 5, title: "Digital Marketing Mastery", progress: 20, modules: 8, completed: 2, category: "Marketing" },
];

const milestones = [
  { label: "Enrolled", date: "Jan 5", done: true },
  { label: "First Module Complete", date: "Jan 12", done: true },
  { label: "Mid-Course Project", date: "Feb 8", done: true },
  { label: "Advanced Modules", date: "Mar 1", done: false, active: true },
  { label: "Final Assessment", date: "Apr 10", done: false },
  { label: "Certificate Earned", date: "—", done: false },
];

const recentActivity = [
  { action: "Completed lesson: Color Theory Basics", time: "2 hours ago", icon: CheckCircle2 },
  { action: "Started module: Advanced Prototyping", time: "Yesterday", icon: Play },
  { action: "Scored 92% on React Hooks Quiz", time: "2 days ago", icon: Trophy },
  { action: "Downloaded: Marketing Analytics Report", time: "3 days ago", icon: BarChart3 },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const Dashboard = () => {
  const totalProgress = Math.round(enrolledCourses.reduce((a, c) => a + c.progress, 0) / enrolledCourses.length);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10 space-y-8">
        {/* Welcome Header */}
        <motion.div {...fadeUp} className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, Alex 👋</h1>
            <p className="text-muted-foreground mt-1">You've completed <span className="font-semibold text-primary">{totalProgress}%</span> of your active courses. Keep going!</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="hero" asChild>
              <Link to="/courses"><Play className="mr-2 h-4 w-4" />Continue Learning</Link>
            </Button>
            <Button variant="orange" asChild>
              <Link to="/courses"><BookOpen className="mr-2 h-4 w-4" />Explore Courses</Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Courses Enrolled", value: "3", icon: BookOpen, color: "text-primary" },
            { label: "Modules Completed", value: "15", icon: CheckCircle2, color: "text-secondary" },
            { label: "Hours Learned", value: "42", icon: Clock, color: "text-primary" },
            { label: "Avg. Score", value: "88%", icon: TrendingUp, color: "text-secondary" },
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
                      <p className="text-xs text-muted-foreground">{course.completed}/{course.modules} modules • {course.category}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

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
                        <p className="text-xs text-muted-foreground">{m.date}</p>
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
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 group cursor-default">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent group-hover:bg-primary/10 transition-colors">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-1" />
                  </div>
                ))}
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

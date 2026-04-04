import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index.tsx"));
const Courses = lazy(() => import("./pages/Courses.tsx"));
const CourseDetail = lazy(() => import("./pages/CourseDetail.tsx"));
const Payment = lazy(() => import("./pages/Payment.tsx"));
const Portfolio = lazy(() => import("./pages/Portfolio.tsx"));
const Support = lazy(() => import("./pages/Support.tsx"));
const AIChatbot = lazy(() => import("./pages/AIChatbot.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Signup = lazy(() => import("./pages/Signup.tsx"));
const Onboarding = lazy(() => import("./pages/Onboarding.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const AdminSupportTickets = lazy(() => import("./pages/AdminSupportTickets.tsx"));

// Admin pages
const AdminPanel = lazy(() => import("./pages/admin/AdminPanel.tsx"));
const AdminCourses = lazy(() => import("./pages/admin/AdminCourses.tsx"));
const AdminLessons = lazy(() => import("./pages/admin/AdminLessons.tsx"));
const AdminMedia = lazy(() => import("./pages/admin/AdminMedia.tsx"));
const AdminStudents = lazy(() => import("./pages/admin/AdminStudents.tsx"));
const AdminPageBuilder = lazy(() => import("./pages/admin/AdminPageBuilder.tsx"));
const RequireAdmin = lazy(() => import("./components/admin/RequireAdmin.tsx"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <ScrollToTop />
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/payment/:id" element={<Payment />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/support" element={<Support />} />
              <Route path="/ai-chat" element={<AIChatbot />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin/support-tickets" element={<AdminSupportTickets />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/courses" element={<AdminCourses />} />
              <Route path="/admin/lessons/:courseId" element={<AdminLessons />} />
              <Route path="/admin/media" element={<AdminMedia />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/pages" element={<AdminPageBuilder />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
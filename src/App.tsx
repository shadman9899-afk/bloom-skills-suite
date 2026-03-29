import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

// Existing pages
import Index from "./pages/Index.tsx";
import Courses from "./pages/Courses.tsx";
import CourseDetail from "./pages/CourseDetail.tsx";
import Payment from "./pages/Payment.tsx";
import Portfolio from "./pages/Portfolio.tsx";
import Support from "./pages/Support.tsx";
import AIChatbot from "./pages/AIChatbot.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminSupportTickets from "./pages/AdminSupportTickets.tsx";

// Admin pages
import AdminPanel from "./pages/admin/AdminPanel.tsx";
import AdminCourses from "./pages/admin/AdminCourses.tsx";
import AdminLessons from "./pages/admin/AdminLessons.tsx";
import AdminMedia from "./pages/admin/AdminMedia.tsx";
import AdminStudents from "./pages/admin/AdminStudents.tsx";
import AdminPageBuilder from "./pages/admin/AdminPageBuilder.tsx";
import RequireAdmin from "./components/admin/RequireAdmin.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* ── Public Routes ── */}
            <Route path="/" element={<Index />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/payment/:id" element={<Payment />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/support" element={<Support />} />
            <Route path="/ai-chat" element={<AIChatbot />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/support-tickets" element={<AdminSupportTickets />} />

            {/* ── Admin Routes (protected) ── */}
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminPanel />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <RequireAdmin>
                  <AdminCourses />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/lessons/:courseId"
              element={
                <RequireAdmin>
                  <AdminLessons />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/media"
              element={
                <RequireAdmin>
                  <AdminMedia />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/students"
              element={
                <RequireAdmin>
                  <AdminStudents />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/pages"
              element={
                <RequireAdmin>
                  <AdminPageBuilder />
                </RequireAdmin>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

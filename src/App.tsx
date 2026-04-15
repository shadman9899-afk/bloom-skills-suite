import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";

// Import only critical pages
import Index from "./pages/Index.tsx";
import Courses from "./pages/Courses.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import NotFound from "./pages/NotFound.tsx";
import Portfolio from "./pages/Portfolio.tsx";
import Support from "./pages/Support.tsx";
import AIChatbot from "./pages/AIChatbot.tsx";

// Lazy load everything else
const CourseDetail = lazy(() => import("./pages/CourseDetail.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));

// Simple loader
const Loader = () => <div className="min-h-screen flex items-center justify-center">
  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
</div>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HashRouter>
      <ScrollToTop />
      <Toaster />
      <AuthProvider>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/support" element={<Support />} />
            <Route path="/ai-chat" element={<AIChatbot />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </HashRouter>
  </QueryClientProvider>
);

export default App;
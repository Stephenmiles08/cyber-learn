import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import CreateInstructor from "./pages/instructor/CreateInstructor";
import CreateLab from "./pages/instructor/CreateLab";
import EditLab from "./pages/instructor/EditLab";
import LabSubmissions from "./pages/instructor/LabSubmissions";
import StudentProfile from "./pages/instructor/StudentProfile";
import StudentDashboard from "./pages/student/StudentDashboard";
import LabDetail from "./pages/student/LabDetail";
import Leaderboard from "./pages/student/Leaderboard";
import Profile from "./pages/student/Profile";
import ChangePassword from "./pages/ChangePassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Change Password - Accessible to both roles */}
          <Route
            path="/change-password"
            element={
              <ProtectedRoute requiredRole={null}>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          
          {/* Instructor Routes */}
          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRoute requiredRole="instructor">
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/create"
            element={
              <ProtectedRoute requiredRole="instructor">
                <CreateInstructor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/student/:id"
            element={
              <ProtectedRoute requiredRole="instructor">
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/labs/create"
            element={
              <ProtectedRoute requiredRole="instructor">
                <CreateLab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/labs/:id/edit"
            element={
              <ProtectedRoute requiredRole="instructor">
                <EditLab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/labs/:id/submissions"
            element={
              <ProtectedRoute requiredRole="instructor">
                <LabSubmissions />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/labs/:id"
            element={
              <ProtectedRoute requiredRole="student">
                <LabDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/leaderboard"
            element={
              <ProtectedRoute requiredRole="student">
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute requiredRole="student">
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

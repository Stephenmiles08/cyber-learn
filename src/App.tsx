import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
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
          
          {/* Change Password - Accessible to all authenticated users */}
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          
          {/* Super Admin Routes */}
          <Route
            path="/superadmin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Instructor Routes - Superadmin can also access */}
          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['superadmin', 'instructor']}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/create"
            element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <CreateInstructor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/student/:id"
            element={
              <ProtectedRoute allowedRoles={['superadmin', 'instructor']}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/labs/create"
            element={
              <ProtectedRoute allowedRoles={['superadmin', 'instructor']}>
                <CreateLab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/labs/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['superadmin', 'instructor']}>
                <EditLab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/labs/:id/submissions"
            element={
              <ProtectedRoute allowedRoles={['superadmin', 'instructor']}>
                <LabSubmissions />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/labs/:id"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <LabDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/leaderboard"
            element={
              <ProtectedRoute allowedRoles={['superadmin', 'instructor', 'student']}>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={['student']}>
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

import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Shield, BookOpen, Users, Settings, Trophy, User, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Role = 'superadmin' | 'instructor' | 'student' | null;

interface NavbarProps {
  role?: Role;
}

export const Navbar = ({ role }: NavbarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    toast({
      title: "Logged out successfully",
    });
    navigate('/login');
  };

  return (
    <nav className="border-b bg-card/30 backdrop-blur-lg border-border/50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold glow-text">SQI Cyber BootCamp</span>
          </div>
          
          {role && (
            <div className="flex items-center space-x-6">
              {role === 'superadmin' && (
                <>
                  <NavLink to="/superadmin/dashboard">
                    <Settings className="h-4 w-4 inline mr-1" />
                    Dashboard
                  </NavLink>
                  <NavLink to="/instructor/labs/create">
                    <BookOpen className="h-4 w-4 inline mr-1" />
                    Create Lab
                  </NavLink>
                  <NavLink to="/student/leaderboard">
                    <Trophy className="h-4 w-4 inline mr-1" />
                    Leaderboard
                  </NavLink>
                </>
              )}
              {role === 'instructor' && (
                <>
                  <NavLink to="/instructor/dashboard">
                    <BookOpen className="h-4 w-4 inline mr-1" />
                    Labs
                  </NavLink>
                  <NavLink to="/instructor/labs/create">
                    Create Lab
                  </NavLink>
                  <NavLink to="/student/leaderboard">
                    <Trophy className="h-4 w-4 inline mr-1" />
                    Leaderboard
                  </NavLink>
                </>
              )}
              {role === 'student' && (
                <>
                  <NavLink to="/student/dashboard">
                    <BookOpen className="h-4 w-4 inline mr-1" />
                    Labs
                  </NavLink>
                  <NavLink to="/student/leaderboard">
                    <Trophy className="h-4 w-4 inline mr-1" />
                    Leaderboard
                  </NavLink>
                  <NavLink to="/student/profile">
                    <User className="h-4 w-4 inline mr-1" />
                    Profile
                  </NavLink>
                </>
              )}
              <NavLink to="/change-password">
                <Lock className="h-4 w-4 inline mr-1" />
                Change Password
              </NavLink>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

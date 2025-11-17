import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NavbarProps {
  role?: 'student' | 'instructor' | null;
}

export const Navbar = ({ role }: NavbarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    toast({
      title: "Logged out successfully",
    });
    navigate('/login');
  };

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard'} className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">SQI Cyber BootCamp</span>
        </Link>

        <div className="flex items-center gap-4">
          {role === 'student' && (
            <>
              <Link to="/student/dashboard">
                <Button variant="ghost">Labs</Button>
              </Link>
              <Link to="/student/leaderboard">
                <Button variant="ghost">Leaderboard</Button>
              </Link>
              <Link to="/student/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
            </>
          )}

          {role === 'instructor' && (
            <>
              <Link to="/instructor/dashboard">
                <Button variant="ghost">Labs</Button>
              </Link>
              <Link to="/instructor/labs/create">
                <Button variant="ghost">Create Lab</Button>
              </Link>
            </>
          )}

          {role && (
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

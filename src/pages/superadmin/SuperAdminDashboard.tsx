import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Users, Shield, BookOpen, Settings, AlertTriangle, RotateCcw } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Lab {
  id: string;
  title: string;
  lab_type: "exercise" | "competition";
  score: number;
}

interface Student {
  id: string;
  username: string;
  total_score: number;
  labs_solved: number;
}

interface Instructor {
  id: string;
  username: string;
}

const SuperAdminDashboard = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [dashboardMode, setDashboardMode] = useState<'exercise' | 'competition' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    
    const initializeDashboard = async () => {
      try {
        const modeData = await api.getDashboardMode();
        if (!isMounted) return;
        
        const mode = modeData.mode || 'exercise';
        setDashboardMode(mode);

        const [labsData, studentsData, instructorsData] = await Promise.all([
          api.instructorLabs(),
          api.getStudents(),
          api.getInstructors(),
        ]);
        
        if (!isMounted) return;
        
        setLabs(labsData.labs || []);
        setStudents(studentsData.students || []);
        setInstructors(instructorsData.instructors || []);
      } catch (error) {
        if (!isMounted) return;
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeDashboard();

    return () => {
      isMounted = false;
    };
  }, [toast]);

  const handleModeToggle = async (checked: boolean) => {
    const newMode = checked ? 'competition' : 'exercise';
    try {
      await api.setDashboardMode(newMode);
      setDashboardMode(newMode);
      
      const labsData = await api.instructorLabs();
      setLabs(labsData.labs || []);
      
      toast({
        title: "Mode Changed",
        description: `Dashboard mode set to ${newMode}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change dashboard mode",
        variant: "destructive",
      });
    }
  };

  const handleResetDatabase = async () => {
    try {
      await api.resetDatabase();
      toast({
        title: "Success",
        description: "Database reset successfully",
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset database",
        variant: "destructive",
      });
    }
  };

  const handleResetScores = async () => {
    try {
      await api.resetScores();
      toast({
        title: "Success",
        description: "All student scores reset",
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset scores",
        variant: "destructive",
      });
    }
  };

  const handleResetLabs = async () => {
    try {
      await api.resetLabs();
      toast({
        title: "Success",
        description: "All labs reset",
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset labs",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLab = async (id: string) => {
    try {
      await api.deleteLab(id);
      setLabs(labs.filter(lab => lab.id !== id));
      toast({
        title: "Success",
        description: "Lab deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete lab",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a15] to-[#1a1a2e]">
        <Navbar role="superadmin" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a15] to-[#1a1a2e]">
      <Navbar role="superadmin" />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 glow-text">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage the entire platform</p>
        </div>

        {/* Dashboard Mode Toggle */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/30 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Platform Mode
            </CardTitle>
            <CardDescription>Control which lab type students see</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="mode-toggle" className="text-base font-semibold">
                  {dashboardMode === 'exercise' ? 'Exercise Mode' : 'Competition Mode'}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {dashboardMode === 'exercise' 
                    ? 'Students see practice labs' 
                    : 'Students see competition labs'}
                </p>
              </div>
              <Switch
                id="mode-toggle"
                checked={dashboardMode === 'competition'}
                onCheckedChange={handleModeToggle}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-card/50 backdrop-blur-sm border-border/30 rounded-2xl hover:shadow-2xl hover:shadow-primary/10 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <BookOpen className="h-5 w-5" />
                Total Labs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{labs.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/30 rounded-2xl hover:shadow-2xl hover:shadow-accent/10 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <Shield className="h-5 w-5" />
                Instructors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{instructors.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/30 rounded-2xl hover:shadow-2xl hover:shadow-success/10 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <Users className="h-5 w-5" />
                Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{students.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Instructors Management */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/30 rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Instructors
                </CardTitle>
                <CardDescription>Manage instructor accounts</CardDescription>
              </div>
              <Link to="/instructor/create">
                <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Instructor
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {instructors.map((instructor) => (
                <div 
                  key={instructor.id}
                  className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all border border-border/20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
                >
                  <p className="font-semibold text-foreground">{instructor.username}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Students Overview */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/30 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Students Overview
            </CardTitle>
            <CardDescription>View all student performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border/30 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/40">
                    <TableHead className="font-bold text-foreground">Username</TableHead>
                    <TableHead className="font-bold text-foreground">Score</TableHead>
                    <TableHead className="font-bold text-foreground">Labs Solved</TableHead>
                    <TableHead className="font-bold text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow 
                      key={student.id}
                      className={index % 2 === 0 ? 'bg-muted/10 hover:bg-muted/20' : 'hover:bg-muted/20'}
                    >
                      <TableCell className="font-medium">{student.username}</TableCell>
                      <TableCell className="text-primary font-bold">{student.total_score}</TableCell>
                      <TableCell>{student.labs_solved}</TableCell>
                      <TableCell>
                        <Link to={`/instructor/student/${student.id}`}>
                          <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary hover:border-primary/50">
                            View Profile
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Labs Management */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/30 rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  All Labs
                </CardTitle>
                <CardDescription>Manage all training labs</CardDescription>
              </div>
              <Link to="/instructor/labs/create">
                <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Lab
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {labs.map((lab) => (
                <Card key={lab.id} className="bg-muted/20 backdrop-blur-sm border-border/30 hover:border-primary/50 transition-all rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-base">{lab.title}</CardTitle>
                    <CardDescription>
                      <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${
                        lab.lab_type === 'exercise' ? 'bg-accent/20 text-accent' : 'bg-warning/20 text-warning'
                      }`}>
                        {lab.lab_type}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-primary">{lab.score} pts</span>
                      <div className="flex gap-2">
                        <Link to={`/instructor/labs/${lab.id}/edit`}>
                          <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary">
                            Edit
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-border/50">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Lab?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the lab.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteLab(lab.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <Card className="bg-destructive/10 backdrop-blur-sm border-destructive/30 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Destructive administrative actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full shadow-lg shadow-destructive/50">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Entire Database
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border/50">
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Entire Database?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete all labs, submissions, and student data. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleResetDatabase}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Reset Database
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full border-destructive/50 text-destructive hover:bg-destructive/10">
                  Reset Student Scores
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border/50">
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset All Scores?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset all student scores to zero. Labs will remain intact.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleResetScores}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Reset Scores
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full border-destructive/50 text-destructive hover:bg-destructive/10">
                  Reinitialize Labs
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border/50">
                <AlertDialogHeader>
                  <AlertDialogTitle>Reinitialize All Labs?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset all labs to their default state. Student submissions will be cleared.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleResetLabs}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Reinitialize Labs
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

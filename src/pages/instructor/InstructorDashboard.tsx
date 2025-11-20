import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Users, UserPlus, RotateCcw, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Lab {
  id: string;
  title: string;
  description: string;
  score: number;
  submissionsCount?: number;
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

const InstructorDashboard = () => {
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
        // First, fetch the dashboard mode
        const modeData = await api.getDashboardMode();
        if (!isMounted) return;
        
        const mode = modeData.mode || 'exercise';
        setDashboardMode(mode);

        // Then fetch all other data
        const [labsData, studentsData, instructorsData] = await Promise.all([
          api.getLabs(),
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
      
      // Re-fetch labs to reflect the mode change immediately
      const labsData = await api.getLabs();
      setLabs(labsData.labs || []);
      
      toast({
        title: "Mode Changed",
        description: `Students will now see ${newMode} labs`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change mode",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lab?")) return;

    try {
      await api.deleteLab(id);
      toast({
        title: "Lab deleted",
      });
      
      // Re-fetch data after deletion
      const labsData = await api.getLabs();
      setLabs(labsData.labs || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete lab",
        variant: "destructive",
      });
    }
  };

  const handleResetDatabase = async () => {
    try {
      await api.resetDatabase();
      toast({
        title: "Database reset",
        description: "All data has been cleared",
      });
      
      // Re-fetch all data after reset
      const [labsData, studentsData, instructorsData] = await Promise.all([
        api.getLabs(),
        api.getStudents(),
        api.getInstructors(),
      ]);
      setLabs(labsData.labs || []);
      setStudents(studentsData.students || []);
      setInstructors(instructorsData.instructors || []);
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
        title: "Scores reset",
        description: "All student scores have been reset to 0",
      });
      
      // Re-fetch students data after reset
      const studentsData = await api.getStudents();
      setStudents(studentsData.students || []);
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
        title: "Labs reset",
        description: "All labs have been reinitialized",
      });
      
      // Re-fetch labs after reset
      const labsData = await api.getLabs();
      setLabs(labsData.labs || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset labs",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a15] via-[#1a1a2e] to-[#0f0a2e]">
      <Navbar role="instructor" />
      
      {isLoading || dashboardMode === null ? (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            <p className="text-muted-foreground text-lg">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Instructor Dashboard
              </h1>
              <p className="text-muted-foreground">Manage labs, students, and platform settings</p>
            </div>
            <div className="flex gap-2">
              <Link to="/instructor/create">
                <Button variant="outline" className="shadow-lg hover:shadow-primary/20 transition-all">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Instructor
                </Button>
              </Link>
              <Link to="/instructor/labs/create">
                <Button className="shadow-lg hover:shadow-primary/30 transition-all">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Lab
                </Button>
              </Link>
            </div>
          </div>

          {labs.length === 0 ? (
            <Card className="bg-card/50 backdrop-blur-sm border-border shadow-xl">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No labs created yet</p>
                <Link to="/instructor/labs/create">
                  <Button className="shadow-lg hover:shadow-primary/30">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Lab
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Dashboard Mode Toggle */}
              <Card className="mb-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-xl hover:shadow-2xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <span className="text-2xl">{dashboardMode === 'exercise' ? '📚' : '🏆'}</span>
                    Dashboard Mode
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Control which lab type students can see on their dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/20 hover:border-primary/40 transition-all">
                    <div className="space-y-1">
                      <Label htmlFor="mode-toggle" className="text-xl font-bold text-foreground cursor-pointer">
                        {dashboardMode === 'exercise' ? 'Exercise Mode' : 'Competition Mode'}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {dashboardMode === 'exercise' 
                          ? 'Students see training exercises and practice challenges' 
                          : 'Students see competition challenges and timed contests'}
                      </p>
                    </div>
                    <Switch
                      id="mode-toggle"
                      checked={dashboardMode === 'competition'}
                      onCheckedChange={handleModeToggle}
                      className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-primary scale-125"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Instructors Section */}
              <Card className="mb-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-xl hover:shadow-2xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-primary" />
                    All Instructors
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    List of all instructor accounts with access to the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {instructors.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No instructors found</p>
                  ) : (
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-3">
                        {instructors.map((instructor) => (
                          <div
                            key={instructor.id}
                            className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/10 border border-primary/20 hover:border-primary/40 group"
                          >
                            <p className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                              {instructor.username}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>

              {/* Student List Section */}
              <Card className="mb-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-xl hover:shadow-2xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    Students Overview
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Track student progress and scores across all labs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {students.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No students registered yet</p>
                  ) : (
                    <div className="rounded-lg border border-border/50 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50 hover:bg-muted/70">
                            <TableHead className="font-bold">Username</TableHead>
                            <TableHead className="font-bold">Total Score</TableHead>
                            <TableHead className="font-bold">Labs Solved</TableHead>
                            <TableHead className="font-bold">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((student, index) => (
                            <TableRow 
                              key={student.id}
                              className={`hover:bg-primary/5 transition-colors ${index % 2 === 0 ? 'bg-card/30' : 'bg-card/10'}`}
                            >
                              <TableCell className="font-medium">{student.username}</TableCell>
                              <TableCell className="text-success font-semibold">{student.total_score} points</TableCell>
                              <TableCell className="text-accent font-semibold">{student.labs_solved} labs</TableCell>
                              <TableCell>
                                <Link to={`/instructor/student/${student.id}`}>
                                  <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:border-primary/50">
                                    <Users className="h-4 w-4 mr-2" />
                                    View Profile
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Labs Section */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  All Labs
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {labs.map((lab) => (
                    <Card 
                      key={lab.id} 
                      className="bg-card/50 backdrop-blur-sm border-border/50 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all hover:scale-105 group"
                    >
                      <CardHeader>
                        <CardTitle className="group-hover:text-primary transition-colors">{lab.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{lab.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4 p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm font-semibold text-success">Points: {lab.score}</span>
                          <span className="text-sm font-semibold text-accent">
                            {lab.submissionsCount || 0} submissions
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/instructor/labs/${lab.id}/edit`} className="flex-1">
                            <Button variant="outline" className="w-full hover:bg-primary/10 hover:border-primary/50">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </Link>
                          <Link to={`/instructor/labs/${lab.id}/submissions`} className="flex-1">
                            <Button variant="outline" className="w-full hover:bg-accent/10 hover:border-accent/50">
                              <Users className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(lab.id)}
                            className="hover:scale-110 transition-transform"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Admin Reset Section */}
              <Card className="border-destructive/50 bg-destructive/5 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:shadow-destructive/10 transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-6 w-6 animate-pulse" />
                    Admin Controls
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Dangerous operations - use with extreme caution. These actions cannot be undone.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground shadow-lg hover:shadow-destructive/30 transition-all">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset Database
                      </Button>
                    </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset Entire Database?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all data including students, labs, submissions, and scores. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleResetDatabase} className="bg-destructive hover:bg-destructive/90">
                        Reset Database
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground shadow-lg hover:shadow-destructive/30 transition-all">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset Scores
                      </Button>
                    </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset All Student Scores?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will reset all student scores to 0. Submission history will be preserved. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleResetScores} className="bg-destructive hover:bg-destructive/90">
                        Reset Scores
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground shadow-lg hover:shadow-destructive/30 transition-all">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset Labs
                      </Button>
                    </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reinitialize All Labs?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will delete all labs and create a fresh set of default labs. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleResetLabs} className="bg-destructive hover:bg-destructive/90">
                        Reset Labs
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;

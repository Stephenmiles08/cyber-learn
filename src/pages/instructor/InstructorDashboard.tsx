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
  const [dashboardMode, setDashboardMode] = useState<'exercise' | 'competition'>('exercise');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
    fetchDashboardMode();
  }, []);

  const fetchData = async () => {
    try {
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
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboardMode = async () => {
    try {
      const data = await api.getDashboardMode();
      setDashboardMode(data.mode || 'exercise');
    } catch (error) {
      console.error('Failed to fetch dashboard mode:', error);
    }
  };

  const handleModeToggle = async (checked: boolean) => {
    const newMode = checked ? 'competition' : 'exercise';
    try {
      await api.setDashboardMode(newMode);
      setDashboardMode(newMode);
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
      fetchData();
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
      fetchData();
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
      fetchData();
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
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset labs",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a15] to-[#1a1a2e]">
      <Navbar role="instructor" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Instructor Dashboard</h1>
            <p className="text-muted-foreground">Manage labs, students, and platform settings</p>
          </div>
          <div className="flex gap-2">
            <Link to="/instructor/create">
              <Button variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Instructor
              </Button>
            </Link>
            <Link to="/instructor/labs/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Lab
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading labs...</p>
          </div>
        ) : labs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No labs created yet</p>
              <Link to="/instructor/labs/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Lab
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Dashboard Mode Toggle */}
            <Card className="mb-6 bg-gradient-dark border-border/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-foreground">Dashboard Mode</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Control which lab type students can see
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-card/30 rounded-lg border border-border/30">
                  <div className="space-y-1">
                    <Label htmlFor="mode-toggle" className="text-lg font-semibold text-foreground">
                      {dashboardMode === 'exercise' ? '📚 Exercise Mode' : '🏆 Competition Mode'}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {dashboardMode === 'exercise' 
                        ? 'Students see training exercises' 
                        : 'Students see competition challenges'}
                    </p>
                  </div>
                  <Switch
                    id="mode-toggle"
                    checked={dashboardMode === 'competition'}
                    onCheckedChange={handleModeToggle}
                    className="data-[state=checked]:bg-accent"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Instructors Section */}
            <Card className="mb-6 bg-gradient-dark border-border/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-foreground">All Instructors</CardTitle>
                <CardDescription className="text-muted-foreground">
                  List of all instructor accounts
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
                          className="p-4 rounded-lg bg-card/50 hover:bg-card/70 transition-all duration-300 shadow-md hover:shadow-lg border border-border/30"
                        >
                          <p className="font-bold text-lg text-foreground">{instructor.username}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* Student List Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Students Overview</CardTitle>
                <CardDescription>Track student progress and scores</CardDescription>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No students registered yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Total Score</TableHead>
                        <TableHead>Labs Solved</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.username}</TableCell>
                          <TableCell>{student.total_score} points</TableCell>
                          <TableCell>{student.labs_solved} labs</TableCell>
                          <TableCell>
                            <Link to={`/instructor/student/${student.id}`}>
                              <Button variant="outline" size="sm">
                                <Users className="h-4 w-4 mr-2" />
                                View Profile
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Labs Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Labs</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {labs.map((lab) => (
              <Card key={lab.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{lab.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{lab.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Points: {lab.score}</span>
                    <span className="text-sm text-muted-foreground">
                      {lab.submissionsCount || 0} submissions
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/instructor/labs/${lab.id}/edit`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Link to={`/instructor/labs/${lab.id}/submissions`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Users className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(lab.id)}
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
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Admin Controls
                </CardTitle>
                <CardDescription>
                  Dangerous operations - use with caution
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
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
                    <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
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
                    <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
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
    </div>
  );
};

export default InstructorDashboard;

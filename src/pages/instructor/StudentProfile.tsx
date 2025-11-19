import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, CheckCircle, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Student {
  username: string;
  total_score: number;
}

interface SolvedLab {
  lab_id: string;
  lab_title: string;
  score: number;
  solved_at: string;
}

interface Attempt {
  flag: string;
  correct: boolean;
  submitted_at: string;
}

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [solvedLabs, setSolvedLabs] = useState<SolvedLab[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const fetchStudentData = async () => {
    try {
      const [studentData, solvedData, attemptsData] = await Promise.all([
        api.getStudent(id!),
        api.getStudentSolved(id!),
        api.getStudentAttempts(id!),
      ]);
      setStudent(studentData);
      setSolvedLabs(solvedData);
      setAttempts(attemptsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load student data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar role="instructor" />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar role="instructor" />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Student not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="instructor" />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Student Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{student.username}</CardTitle>
                <CardDescription>Student Profile</CardDescription>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{student.total_score}</span>
                </div>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Badge variant="outline">{solvedLabs.length} labs solved</Badge>
              <Badge variant="outline">{attempts.length} total attempts</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Solved Labs */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Solved Labs</CardTitle>
            <CardDescription>Labs completed by this student</CardDescription>
          </CardHeader>
          <CardContent>
            {solvedLabs.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No labs solved yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lab Title</TableHead>
                    <TableHead>Score Awarded</TableHead>
                    <TableHead>Solved At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {solvedLabs.map((lab) => (
                    <TableRow key={lab.lab_id}>
                      <TableCell className="font-medium">{lab.lab_title}</TableCell>
                      <TableCell>{lab.score} points</TableCell>
                      <TableCell>{new Date(lab.solved_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Attempt History */}
        <Card>
          <CardHeader>
            <CardTitle>Attempt History</CardTitle>
            <CardDescription>All flag submissions by this student</CardDescription>
          </CardHeader>
          <CardContent>
            {attempts.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No attempts yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Flag Submitted</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attempts.map((attempt, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono">{attempt.flag}</TableCell>
                      <TableCell>
                        {attempt.correct ? (
                          <Badge className="bg-success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Correct
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Incorrect
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{new Date(attempt.submitted_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;

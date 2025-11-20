import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Award, Send, Lightbulb, ChevronDown, CheckCircle, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Lab {
  id: string;
  title: string;
  description: string;
  score: number;
  difficulty?: string;
  completed?: boolean;
}

interface Attempt {
  flag: string;
  correct: boolean;
  submitted_at: string;
}

const LabDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [lab, setLab] = useState<Lab | null>(null);
  const [hint, setHint] = useState<string>("");
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [flag, setFlag] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLab();
  }, [id]);

  const fetchLab = async () => {
    try {
      const [labData, hintData, attemptsData] = await Promise.all([
        api.getLab(id!),
        api.getLabHint(id!).catch(() => ({ hint: "No hint available" })),
        api.getLabAttempts(id!).catch(() => []),
      ]);
      setLab(labData);
      setHint(hintData.hint || "No hint available");
      setAttempts(attemptsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load lab",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.submitFlag(id!, flag);

      if (response.correct) {
        toast({
          title: "Correct! 🎉",
          description: `You earned ${lab?.score} points!`,
          className: "bg-success text-success-foreground",
        });
        setLab({ ...lab!, completed: true });
        setFlag("");
        fetchLab(); // Refresh to get updated attempts
      } else {
        toast({
          title: "Incorrect",
          description: "Try again!",
          variant: "destructive",
        });
        fetchLab(); // Refresh to get updated attempts
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit flag",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a15] to-[#1a1a2e]">
        <Navbar role="student" />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Loading lab...</p>
        </div>
      </div>
    );
  }

  if (!lab) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a15] to-[#1a1a2e]">
        <Navbar role="student" />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Lab not found</p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-success text-success-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'hard':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a15] to-[#1a1a2e]">
      <Navbar role="student" />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="backdrop-blur-sm bg-card/80 border-border/30 shadow-2xl rounded-2xl">
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{lab.title}</CardTitle>
                <div className="flex items-center gap-2 mb-2">
                  <CardDescription className="text-base">
                    Worth {lab.score} points
                  </CardDescription>
                  {lab.difficulty && (
                    <Badge className={getDifficultyColor(lab.difficulty)}>
                      {lab.difficulty}
                    </Badge>
                  )}
                </div>
              </div>
              {lab.completed ? (
                <Badge className="bg-success shadow-lg shadow-success/50">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Solved
                </Badge>
              ) : (
                <Badge variant="destructive" className="shadow-lg shadow-destructive/50">
                  <XCircle className="h-4 w-4 mr-1" />
                  Not Solved
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Description</h3>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {lab.description}
                </ReactMarkdown>
              </div>
            </div>

            {/* Hint Section */}
            <Collapsible open={hintOpen} onOpenChange={setHintOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Hint
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${hintOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {hint}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Submit Flag</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="flag">Flag</Label>
                  <Input
                    id="flag"
                    placeholder="flag{your_answer_here}"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    required
                    disabled={lab.completed}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || lab.completed}
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : lab.completed ? (
                    "Already Completed"
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Flag
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Attempt History */}
            {attempts.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Your Attempts</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Flag</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attempts.map((attempt, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{attempt.flag}</TableCell>
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
                        <TableCell className="text-sm">{new Date(attempt.submitted_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LabDetail;

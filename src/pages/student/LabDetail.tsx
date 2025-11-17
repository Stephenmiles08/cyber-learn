import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Send } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Lab {
  id: string;
  title: string;
  description: string;
  score: number;
  completed?: boolean;
}

const LabDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [lab, setLab] = useState<Lab | null>(null);
  const [flag, setFlag] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLab();
  }, [id]);

  const fetchLab = async () => {
    try {
      const data = await api.getLab(id!);
      setLab(data);
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
      } else {
        toast({
          title: "Incorrect",
          description: "Try again!",
          variant: "destructive",
        });
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
      <div className="min-h-screen bg-background">
        <Navbar role="student" />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Loading lab...</p>
        </div>
      </div>
    );
  }

  if (!lab) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar role="student" />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Lab not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="student" />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{lab.title}</CardTitle>
                <CardDescription className="text-base">
                  Worth {lab.score} points
                </CardDescription>
              </div>
              {lab.completed && (
                <Badge className="bg-success">
                  <Award className="h-4 w-4 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{lab.description}</p>
            </div>

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LabDetail;

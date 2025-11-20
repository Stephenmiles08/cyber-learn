import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Lock } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Lab {
  id: string;
  title: string;
  description: string;
  score: number;
  completed?: boolean;
}

const StudentDashboard = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const data = await api.getLabs();
      setLabs(data.labs || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load labs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a15] to-[#1a1a2e]">
      <Navbar role="student" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Labs</h1>
          <p className="text-muted-foreground">Choose a lab to start your training</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading labs...</p>
          </div>
        ) : labs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No labs available yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {labs.map((lab) => (
              <Link key={lab.id} to={`/student/labs/${lab.id}`}>
                <Card className="hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 h-full bg-card/50 backdrop-blur-sm border-border/30 hover:border-primary/50 hover:scale-[1.02] rounded-2xl">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg text-foreground">{lab.title}</CardTitle>
                      {lab.completed && (
                        <Badge className="bg-success shadow-lg shadow-success/50">
                          <Award className="h-3 w-3 mr-1" />
                          Solved
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-3 text-muted-foreground">{lab.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-primary glow-text">
                        {lab.score} points
                      </span>
                      <span className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        Click to start →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;

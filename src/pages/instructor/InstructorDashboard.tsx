import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Lab {
  id: string;
  title: string;
  description: string;
  score: number;
  submissionsCount?: number;
}

const InstructorDashboard = () => {
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lab?")) return;

    try {
      await api.deleteLab(id);
      toast({
        title: "Lab deleted",
      });
      fetchLabs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete lab",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="instructor" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Lab Management</h1>
            <p className="text-muted-foreground">Create and manage cybersecurity labs</p>
          </div>
          <Link to="/instructor/labs/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Lab
            </Button>
          </Link>
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
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;

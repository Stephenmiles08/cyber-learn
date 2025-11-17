import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const CreateLab = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [flag, setFlag] = useState("");
  const [score, setScore] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.createLab({
        title,
        description,
        flag,
        score: parseInt(score),
      });

      toast({
        title: "Lab created successfully",
      });

      navigate('/instructor/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create lab",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="instructor" />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Lab</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Lab Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., SQL Injection Basics"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the lab challenge..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="flag">Flag</Label>
                <Input
                  id="flag"
                  placeholder="flag{example_flag_here}"
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  The correct flag that students need to find
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="score">Points</Label>
                <Input
                  id="score"
                  type="number"
                  placeholder="100"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/instructor/dashboard')}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Lab"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateLab;

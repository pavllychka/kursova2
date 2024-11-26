import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, ThumbsUp, ThumbsDown, Plus } from "lucide-react";
import { ProjectWithLikes } from "@/types";
import {
  createProject,
  getProjects,
  likeProject,
  ProjectCreate,
  unlikeProject,
} from "@/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import ConfettiExplosion from "react-confetti-explosion";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogHeader } from "./ui/dialog";
import { Input } from "./ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { CreateProjectForm } from "./CreateProjectForm";

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectWithLikes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isExploding, setIsExploding] = useState(projects.map(() => false));
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchProjects();
  }, [debouncedSearchTerm]);

  if (!user) {
    navigate("/auth");
    return;
  }

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const fetchedProjects = await getProjects(debouncedSearchTerm);
      setProjects(fetchedProjects);
      setError(null);
    } catch (err) {
      setError("Failed to fetch projects. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (projectId: number) => {
    try {
      await likeProject(user.id, projectId);
      setProjects(
        projects.map((p) => (p.id === projectId ? { ...p, likes: [...(p.likes ?? []), user] } : p))
      );
      setIsExploding(projects.map((p) => p.id === projectId));
      setTimeout(() => setIsExploding(projects.map(() => false)), 1500);
      toast({ title: "Project liked successfully!" });
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to like project", variant: "destructive" });
    }
  };

  const handleUnlike = async (projectId: number) => {
    try {
      await unlikeProject(user.id, projectId);
      setProjects(
        projects.map((p) =>
          p.id === projectId ? { ...p, likes: p.likes?.filter((like) => like.id !== user.id) } : p
        )
      );
      toast({ title: "Project unliked successfully!" });
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to unlike project", variant: "destructive" });
    }
  };

  const handleCreateProject = async (newProject: ProjectCreate) => {
    try {
      const { id, locationDisplay } = await createProject(newProject);
      setProjects([
        ...projects,
        {
          id,
          ...newProject,
          locationDisplay,
          user: user,
          likes: [],
        },
      ]);
      setIsCreateDialogOpen(false);
      toast({ title: "Project created successfully!" });
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to create project", variant: "destructive" });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">Projects List</h1>
        {user.role === 'project_creator' && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>

            <DialogContent className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
              <div className="w-full max-w-md p-4 bg-background rounded-lg shadow-lg">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <CreateProjectForm
                  onSubmit={handleCreateProject}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <form onSubmit={handleSearchSubmit} className="flex space-x-2 mb-6">
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button type="button" onClick={handleSearchSubmit}>Search</Button>
      </form>
      {loading && <ProjectsSkeleton />}
      {!loading &&
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{project.title}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {project.likes ? `${project.likes.length} likes` : <Skeleton className="w-16 h-4" />}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {project.locationDisplay || `${project.location.x.toFixed(4)}, ${project.location.y.toFixed(4)}`}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${project.user.name}`}
                      alt={project.user.name}
                    />
                    <AvatarFallback>
                      {project.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{project.user.name}</p>
                    <p className="text-xs text-muted-foreground">{project.user.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap w-full justify-center">
                  {project.likes?.slice(0, 5).map((like, i) => (
                    <Link to={`/${like.id}`} key={like.id}>
                      <Avatar
                        key={like.id}
                        className={`h-6 w-6 ${i === 0 ? "" : "ml-[-10px]"}`}
                        title={like.name}
                      >
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${like.name}`}
                          alt={like.name}
                        />
                        <AvatarFallback>{like.name[0]}</AvatarFallback>
                      </Avatar>
                    </Link>
                  ))}
                  {project.likes?.length && project.likes.length > 5 && (
                    <span className="text-sm text-muted-foreground ml-0.5">
                      +{project.likes.length - 5} more
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLike(project.id)}
                  disabled={!project.likes || project.likes?.some((like) => like.id === user.id)}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Like
                  {isExploding[index] && (
                    <ConfettiExplosion
                      height={70}
                      width={200}
                      particleCount={30}
                      duration={1500}
                      className="mt-[-40px]"
                    />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnlike(project.id)}
                  disabled={!project.likes || !project.likes?.some((like) => like.id === user.id)}
                >
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  Unlike
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      }
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="w-48 h-8 mb-6" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="flex-grow">
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex items-center space-x-2 mb-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, j) => (
                  <Skeleton key={j} className="h-6 w-6 rounded-full" />
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}



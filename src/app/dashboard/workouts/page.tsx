import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { getWorkouts, deleteWorkout } from "@/app/actions/workout-actions";
// Removed subscription check to allow access to workouts
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dumbbell,
  Plus,
  Calendar,
  Filter,
  ArrowUpDown,
  Search,
  BarChart3,
  Clock,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import WorkoutTemplateCard from "@/components/workout-template-card";

// Define the Exercise interface
interface Exercise {
  id?: string;
  name: string;
  sets: any[];
  weight?: string;
}

export default async function WorkoutsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get all workouts from database
  const workoutsData = await getWorkouts();

  // Format dates for display
  const workouts = workoutsData.map((workout) => {
    const workoutDate = new Date(workout.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateDisplay;
    if (workoutDate.toDateString() === today.toDateString()) {
      dateDisplay = "Today";
    } else if (workoutDate.toDateString() === yesterday.toDateString()) {
      dateDisplay = "Yesterday";
    } else {
      // Calculate days ago
      const diffTime = Math.abs(today.getTime() - workoutDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      dateDisplay =
        diffDays <= 7
          ? `${diffDays} days ago`
          : workoutDate.toLocaleDateString();
    }

    return {
      ...workout,
      date: dateDisplay,
      duration: workout.duration || "--",
    };
  });

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-background min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-foreground">Workouts</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Calendar className="h-4 w-4" />
                  Filter by Date
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1 bg-primary hover:bg-primary/90"
                  asChild
                >
                  <a href="/dashboard/workouts/new">
                    <Plus className="h-4 w-4" />
                    New Workout
                  </a>
                </Button>
              </div>
            </div>
          </header>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workouts..."
                className="pl-10 w-full"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </div>
          </div>

          {/* Workout Templates */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Workout Templates
              </CardTitle>
              <CardDescription>
                Quick start with a template or create your own
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: "upper-body",
                    name: "Upper Body",
                    exercises: 8,
                  },
                  {
                    id: "lower-body",
                    name: "Lower Body",
                    exercises: 6,
                  },
                  {
                    id: "full-body",
                    name: "Full Body",
                    exercises: 10,
                  },
                ].map((template) => (
                  <WorkoutTemplateCard
                    key={template.id}
                    id={template.id}
                    name={template.name}
                    exercises={template.exercises}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Workouts */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Recent Workouts
              </CardTitle>
              <CardDescription>Your workout history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workouts.length > 0 ? (
                  workouts.map((workout) => (
                    <div
                      key={`workout-${workout.id}`}
                      className="border border-border rounded-lg overflow-hidden"
                    >
                      <div className="p-4 flex justify-between items-center bg-card">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Dumbbell className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{workout.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {workout.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <BarChart3 className="h-4 w-4" />
                            <span>{workout.exercises.length} exercises</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{workout.duration}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={`/dashboard/workouts/${workout.id}`}>
                                View Details
                              </a>
                            </Button>
                            <form
                              action={async () => {
                                "use server";
                                await deleteWorkout(workout.id);
                              }}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                Delete
                              </Button>
                            </form>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-background">
                        <h4 className="text-sm font-medium mb-2">Exercises</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {workout.exercises.map((exercise: Exercise, index: number) => (
                            <div
                              key={`${workout.id}-${index}`}
                              className="flex items-center gap-2 p-2 rounded-md bg-secondary/20"
                            >
                              <Check className="h-4 w-4 text-primary" />
                              <div className="text-sm">
                                <span className="font-medium">
                                  {exercise.name}
                                </span>
                                <span className="text-muted-foreground">
                                  {" "}
                                  -{" "}
                                  {Array.isArray(exercise.sets)
                                    ? exercise.sets.length
                                    : exercise.sets}{" "}
                                  sets
                                  {exercise.weight
                                    ? ` @ ${exercise.weight}`
                                    : ""}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8 border border-dashed border-border rounded-lg">
                    <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No workouts yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start tracking your fitness journey by creating your first
                      workout
                    </p>
                    <Button asChild>
                      <a href="/dashboard/workouts/new">Create Workout</a>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Progress Charts */}
          <Card className="border border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl font-bold">
                  Progress Tracking
                </CardTitle>
                <CardDescription>
                  Monitor your strength gains over time
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard/workouts/progress">
                  View Detailed Progress
                </a>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full flex items-center justify-center border border-dashed border-border rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Progress charts will appear here as you log more workouts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

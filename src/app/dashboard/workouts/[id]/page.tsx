import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  getWorkout,
  updateWorkout,
  deleteWorkout,
} from "@/app/actions/workout-actions";
import {
  Dumbbell,
  ArrowLeft,
  Clock,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";
import DatePicker from "@/components/date-picker";
import WorkoutFormWrapper from "@/components/workout-form-wrapper";

// Define the Exercise interface
interface Exercise {
  id?: string;
  name: string;
  sets: any[];
  weight?: string;
}

export default async function WorkoutDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { date?: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const workout = await getWorkout(params.id);
  if (!workout) {
    return redirect("/dashboard/workouts");
  }

  // Format date for display
  const workoutDate = new Date(workout.date);
  const formattedDate = workoutDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-background min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Button variant="ghost" size="sm" asChild className="p-0">
                <a href="/dashboard/workouts">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Workouts
                </a>
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {workout.name}
                </h1>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formattedDate}</span>
                  </div>
                  {workout.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{workout.duration}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <form
                  action={async () => {
                    "use server";
                    await deleteWorkout(params.id);
                    redirect("/dashboard/workouts");
                  }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          </header>

          {/* Workout Details */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Workout Details
              </CardTitle>
              <CardDescription>Edit your workout information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="workout-date">Workout Date</Label>
                <div className="mt-2">
                  {/* Using client component for date picker */}
                  <DatePicker
                    defaultValue={
                      searchParams.date ||
                      new Date(workout.date).toISOString().split("T")[0]
                    }
                    searchParams={searchParams as Record<string, string>}
                  />
                </div>
              </div>
              <WorkoutFormWrapper
                initialData={{
                  name: workout.name,
                  exercises: workout.exercises.map((ex: Exercise) => ({
                    id: ex.id,
                    name: ex.name,
                    sets: ex.sets,
                    weight: ex.weight,
                  })),
                }}
                onSaveAction={async (formData: FormData) => {
                  "use server";
                  const name = formData.get("name") as string;
                  const exercises = JSON.parse(
                    formData.get("exercises") as string,
                  );

                  await updateWorkout(params.id, {
                    name,
                    exercises,
                    date: searchParams.date
                      ? new Date(searchParams.date).toISOString()
                      : workout.date,
                    duration: workout.duration,
                    notes: workout.notes,
                  });
                  redirect(`/dashboard/workouts/${params.id}`);
                }}
              />
            </CardContent>
          </Card>

          {/* Notes Section */}
          {workout.notes && (
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{workout.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}

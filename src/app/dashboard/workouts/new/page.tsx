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
import WorkoutFormWrapper from "@/components/workout-form-wrapper";
import { createWorkout } from "@/app/actions/workout-actions";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/date-picker";

function getTemplateWorkout(templateId: string) {
  const templates = {
    "upper-body": {
      name: "Upper Body Workout",
      exercises: [
        {
          id: "1",
          name: "Bench Press",
          sets: Array(4)
            .fill(0)
            .map(() => ({
              id: `bp-${Math.random().toString(36).substring(2)}`,
              reps: "8-10",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "2",
          name: "Overhead Press",
          sets: Array(3)
            .fill(0)
            .map(() => ({
              id: `op-${Math.random().toString(36).substring(2)}`,
              reps: "8-10",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "3",
          name: "Lat Pulldown",
          sets: Array(3)
            .fill(0)
            .map(() => ({
              id: `lp-${Math.random().toString(36).substring(2)}`,
              reps: "10-12",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "4",
          name: "Seated Row",
          sets: Array(3)
            .fill(0)
            .map(() => ({
              id: `sr-${Math.random().toString(36).substring(2)}`,
              reps: "10-12",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "5",
          name: "Bicep Curls",
          sets: Array(3)
            .fill(0)
            .map(() => ({
              id: `bc-${Math.random().toString(36).substring(2)}`,
              reps: "12-15",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "6",
          name: "Tricep Pushdown",
          sets: Array(3)
            .fill(0)
            .map(() => ({
              id: `tp-${Math.random().toString(36).substring(2)}`,
              reps: "12-15",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "7",
          name: "Lateral Raises",
          sets: Array(3)
            .fill(0)
            .map(() => ({
              id: `lr-${Math.random().toString(36).substring(2)}`,
              reps: "12-15",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "8",
          name: "Face Pulls",
          sets: Array(3)
            .fill(0)
            .map(() => ({
              id: `fp-${Math.random().toString(36).substring(2)}`,
              reps: "15-20",
              weight: "",
            })),
          weight: "",
        },
      ],
    },
    "lower-body": {
      name: "Lower Body Workout",
      exercises: [
        {
          id: "1",
          name: "Squats",
          sets: Array(4)
            .fill(0)
            .map(() => ({
              id: `sq-${Math.random().toString(36).substring(2)}`,
              reps: "8-10",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "2",
          name: "Romanian Deadlift",
          sets: Array(3)
            .fill(0)
            .map(() => ({
              id: `rd-${Math.random().toString(36).substring(2)}`,
              reps: "8-10",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "3",
          name: "Leg Press",
          sets: Array(3)
            .fill(0)
            .map(() => ({
              id: `lp-${Math.random().toString(36).substring(2)}`,
              reps: "10-12",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "4",
          name: "Leg Extensions",
          sets: Array(3)
            .fill(0)
            .map(() => ({
              id: `le-${Math.random().toString(36).substring(2)}`,
              reps: "12-15",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "5",
          name: "Leg Curls",
          sets: Array(3)
            .fill(0)
            .map(() => ({
              id: `lc-${Math.random().toString(36).substring(2)}`,
              reps: "12-15",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "6",
          name: "Calf Raises",
          sets: Array(4)
            .fill(0)
            .map(() => ({
              id: `cr-${Math.random().toString(36).substring(2)}`,
              reps: "15-20",
              weight: "",
            })),
          weight: "",
        },
      ],
    },
    "full-body": {
      name: "Full Body Workout",
      exercises: [
        {
          id: "1",
          name: "Squats",
          sets: Array(3)
            .fill(0)
            .map(() => ({
              id: `sq-${Math.random().toString(36).substring(2)}`,
              reps: "8-10",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "2",
          name: "Bench Press",
          sets: Array(3)
            .fill(0)
            .map(() => ({
              id: `bp-${Math.random().toString(36).substring(2)}`,
              reps: "8-10",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "3",
          name: "Deadlift",
          sets: Array(3)
            .fill(0)
            .map(() => ({
              id: `dl-${Math.random().toString(36).substring(2)}`,
              reps: "6-8",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "4",
          name: "Overhead Press",
          sets: Array(3)
            .fill(0)
            .map(() => ({
              id: `op-${Math.random().toString(36).substring(2)}`,
              reps: "8-10",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "5",
          name: "Pull-ups/Lat Pulldown",
          sets: Array(3)
            .fill(0)
            .map(() => ({
              id: `pu-${Math.random().toString(36).substring(2)}`,
              reps: "8-10",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "6",
          name: "Dumbbell Rows",
          sets: Array(3)
            .fill(0)
            .map(() => ({
              id: `dr-${Math.random().toString(36).substring(2)}`,
              reps: "10-12",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "7",
          name: "Bicep Curls",
          sets: Array(2)
            .fill(0)
            .map(() => ({
              id: `bc-${Math.random().toString(36).substring(2)}`,
              reps: "12-15",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "8",
          name: "Tricep Extensions",
          sets: Array(2)
            .fill(0)
            .map(() => ({
              id: `te-${Math.random().toString(36).substring(2)}`,
              reps: "12-15",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "9",
          name: "Lateral Raises",
          sets: Array(2)
            .fill(0)
            .map(() => ({
              id: `lr-${Math.random().toString(36).substring(2)}`,
              reps: "12-15",
              weight: "",
            })),
          weight: "",
        },
        {
          id: "10",
          name: "Calf Raises",
          sets: Array(3)
            .fill(0)
            .map(() => ({
              id: `cr-${Math.random().toString(36).substring(2)}`,
              reps: "15-20",
              weight: "",
            })),
          weight: "",
        },
      ],
    },
  };

  return templates[templateId as keyof typeof templates];
}

export default async function NewWorkoutPage({
  searchParams,
}: {
  searchParams: { template?: string; date?: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-background min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-foreground">
                Create New Workout
              </h1>
            </div>
          </header>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Workout Details
              </CardTitle>
              <CardDescription>
                Create a new workout by adding exercises, sets, reps, and
                weights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="workout-date">Workout Date</Label>
                <div className="mt-2">
                  {/* Using client component for date picker */}
                  <DatePicker
                    defaultValue={
                      searchParams.date ||
                      new Date().toISOString().split("T")[0]
                    }
                    searchParams={searchParams as Record<string, string>}
                  />
                </div>
              </div>
              <WorkoutFormWrapper
                initialData={
                  searchParams.template
                    ? getTemplateWorkout(searchParams.template)
                    : undefined
                }
                onSaveAction={async (formData: FormData) => {
                  "use server";
                  const name = formData.get("name") as string;
                  const exercises = JSON.parse(
                    formData.get("exercises") as string,
                  );

                  const result = await createWorkout({
                    name,
                    exercises,
                    date: searchParams.date
                      ? new Date(searchParams.date).toISOString()
                      : new Date().toISOString(),
                  });

                  if (result.success) {
                    redirect("/dashboard/workouts");
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

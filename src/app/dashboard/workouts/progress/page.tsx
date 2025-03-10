import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import { getWorkouts } from "@/app/actions/workout-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProgressChart from "@/components/progress-chart";
import { Dumbbell, ArrowUpRight } from "lucide-react";

// Define the interfaces
interface ExerciseSet {
  id?: string;
  reps: string;
  weight: string;
}

interface Exercise {
  id?: string;
  name: string;
  sets: ExerciseSet[];
  weight?: string;
}

interface Workout {
  id: string;
  date: string;
  exercises: Exercise[];
}

export default async function WorkoutProgressPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get all workouts to generate progress data
  const workouts = await getWorkouts();

  // Extract exercise data for progress charts
  const exerciseData: Record<string, { date: string; value: number }[]> = {};

  workouts.forEach((workout: Workout) => {
    const workoutDate = new Date(workout.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    workout.exercises.forEach((exercise: Exercise) => {
      // Find the maximum weight used for this exercise in this workout
      let maxWeight = 0;
      exercise.sets.forEach((set: ExerciseSet) => {
        const weight = parseFloat(set.weight) || 0;
        if (weight > maxWeight) maxWeight = weight;
      });

      if (maxWeight > 0) {
        if (!exerciseData[exercise.name]) {
          exerciseData[exercise.name] = [];
        }

        // Add this data point
        exerciseData[exercise.name].push({
          date: workoutDate,
          value: maxWeight,
        });
      }
    });
  });

  // Sort data points by date for each exercise
  Object.keys(exerciseData).forEach((exercise) => {
    exerciseData[exercise].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  });

  // Use sample data if no real data exists
  const benchPressData = exerciseData["Bench Press"] || [
    { date: "Jan 1", value: 135 },
    { date: "Jan 8", value: 145 },
    { date: "Jan 15", value: 145 },
    { date: "Jan 22", value: 155 },
    { date: "Jan 29", value: 155 },
    { date: "Feb 5", value: 165 },
    { date: "Feb 12", value: 175 },
    { date: "Feb 19", value: 175 },
    { date: "Feb 26", value: 185 },
  ];

  const squatData = exerciseData["Squat"] || [
    { date: "Jan 3", value: 185 },
    { date: "Jan 10", value: 195 },
    { date: "Jan 17", value: 205 },
    { date: "Jan 24", value: 215 },
    { date: "Jan 31", value: 225 },
    { date: "Feb 7", value: 235 },
    { date: "Feb 14", value: 245 },
    { date: "Feb 21", value: 255 },
    { date: "Feb 28", value: 265 },
  ];

  const deadliftData = exerciseData["Deadlift"] || [
    { date: "Jan 5", value: 225 },
    { date: "Jan 12", value: 235 },
    { date: "Jan 19", value: 245 },
    { date: "Jan 26", value: 255 },
    { date: "Feb 2", value: 265 },
    { date: "Feb 9", value: 275 },
    { date: "Feb 16", value: 285 },
    { date: "Feb 23", value: 295 },
    { date: "Mar 1", value: 315 },
  ];

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-background min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-foreground">
                Strength Progress
              </h1>
            </div>
          </header>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Bench Press",
                current: "185 lbs",
                increase: "+50 lbs",
                percentage: "37%",
              },
              {
                title: "Squat",
                current: "265 lbs",
                increase: "+80 lbs",
                percentage: "43%",
              },
              {
                title: "Deadlift",
                current: "315 lbs",
                increase: "+90 lbs",
                percentage: "40%",
              },
            ].map((stat, index) => (
              <Card key={index} className="border border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">{stat.current}</p>
                      <div className="flex items-center gap-1 text-sm text-green-500">
                        <ArrowUpRight className="h-4 w-4" />
                        <span>{stat.increase}</span>
                        <span className="text-xs">({stat.percentage})</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Dumbbell className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progress Charts */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Bench Press Progress
              </CardTitle>
              <CardDescription>
                Track your strength gains over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressChart
                data={benchPressData}
                title="Weight (lbs)"
                color="hsl(var(--primary))"
              />
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Squat Progress
              </CardTitle>
              <CardDescription>
                Track your strength gains over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressChart
                data={squatData}
                title="Weight (lbs)"
                color="hsl(var(--chart-2))"
              />
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Deadlift Progress
              </CardTitle>
              <CardDescription>
                Track your strength gains over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressChart
                data={deadliftData}
                title="Weight (lbs)"
                color="hsl(var(--chart-3))"
              />
            </CardContent>
          </Card>

          {/* Insights */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Strength Insights
              </CardTitle>
              <CardDescription>
                AI-powered recommendations based on your progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Bench Press Plateau",
                    description:
                      "You've maintained the same weight for two weeks. Consider adding an extra set or implementing a deload week to break through.",
                    icon: <ArrowUpRight className="h-5 w-5 text-primary" />,
                  },
                  {
                    title: "Impressive Squat Progress",
                    description:
                      "Your squat has increased consistently every week. Great job maintaining progressive overload!",
                    icon: <ArrowUpRight className="h-5 w-5 text-primary" />,
                  },
                  {
                    title: "Deadlift Milestone",
                    description:
                      "Congratulations on reaching 315 lbs on your deadlift! You've reached the 3-plate milestone.",
                    icon: <ArrowUpRight className="h-5 w-5 text-primary" />,
                  },
                ].map((insight, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {insight.icon}
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

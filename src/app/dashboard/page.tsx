import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../supabase/server";
import {
  InfoIcon,
  Dumbbell,
  Utensils,
  LineChart,
  TrendingUp,
  Calendar,
  Plus,
} from "lucide-react";
import { redirect } from "next/navigation";
import { getWorkouts } from "@/app/actions/workout-actions";
import { getHabits, toggleHabitCompletion } from "@/app/actions/habit-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DashboardHabitTracker from "@/components/dashboard-habit-tracker";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get recent workouts (limited to 3)
  const workouts = await getWorkouts(3);

  // Get habits
  const habits = await getHabits();

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-background min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Calendar className="h-4 w-4" />
                  Today
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
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>
                Welcome to your personal dashboard. Track your fitness,
                nutrition, and habits all in one place.
              </span>
            </div>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Workouts Completed",
                value: "0",
                icon: <Dumbbell className="h-5 w-5 text-primary" />,
                change: "0 this week",
              },
              {
                title: "Calories Today",
                value: "0",
                icon: <Utensils className="h-5 w-5 text-primary" />,
                change: "0% of goal",
              },
              {
                title: "Active Habits",
                value: habits ? habits.length.toString() : "0",
                icon: <LineChart className="h-5 w-5 text-primary" />,
                change: `${habits ? habits.filter((h) => h.completed).length : 0} completed today`,
              },
              {
                title: "Monthly Consistency",
                value:
                  habits && habits.length > 0
                    ? `${Math.round((habits.reduce((sum, h) => sum + (h.completedDays?.length || 0), 0) / (habits.length * 30)) * 100)}%`
                    : "0%",
                icon: <TrendingUp className="h-5 w-5 text-primary" />,
                change: "Habit completion rate",
              },
            ].map((stat, index) => (
              <Card key={index} className="border border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Dashboard Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Strength Training Section */}
            <Card className="border border-border lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl font-bold">
                    Recent Workouts
                  </CardTitle>
                  <CardDescription>
                    Track your strength training progress
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/workouts">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workouts && workouts.length > 0 ? (
                    <div className="space-y-3">
                      {workouts.slice(0, 3).map((workout) => (
                        <div
                          key={workout.id}
                          className="flex justify-between items-center p-3 border border-border rounded-lg hover:bg-secondary/20 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Dumbbell className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{workout.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {new Date(workout.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/dashboard/workouts/${workout.id}`}>
                              View
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 border border-dashed border-border rounded-lg">
                      <Dumbbell className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No workouts yet</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        asChild
                      >
                        <a href="/dashboard/workouts/new">
                          Create Your First Workout
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Habits Section */}
            <Card className="border border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl font-bold">
                    Today's Habits
                  </CardTitle>
                  <CardDescription>Keep your streaks going</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/habits">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {habits && habits.length > 0 ? (
                    <div className="space-y-2">
                      {habits.map((habit) => (
                        <DashboardHabitTracker
                          key={habit.id}
                          habit={habit}
                          onToggle={async (habitId, completed) => {
                            await toggleHabitCompletion(habitId, completed);
                          }}
                        />
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        asChild
                      >
                        <a href="/dashboard/habits">View All Habits</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center p-6 border border-dashed border-border rounded-lg">
                      <LineChart className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No habits yet</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        asChild
                      >
                        <a href="/dashboard/habits/new">
                          Create Your First Habit
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nutrition Section */}
          <Card className="border border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl font-bold">
                  Today's Nutrition
                </CardTitle>
                <CardDescription>Track your meals and macros</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/nutrition">View Details</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    label: "Calories",
                    value: "0",
                    target: "2400",
                    color: "bg-primary",
                  },
                  {
                    label: "Protein",
                    value: "0g",
                    target: "150g",
                    color: "bg-blue-500",
                  },
                  {
                    label: "Carbs",
                    value: "0g",
                    target: "250g",
                    color: "bg-green-500",
                  },
                  {
                    label: "Fat",
                    value: "0g",
                    target: "80g",
                    color: "bg-yellow-500",
                  },
                ].map((macro, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{macro.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {macro.value} / {macro.target}
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${macro.color} rounded-full`}
                        style={{
                          width: "0%",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="text-center p-6 border border-dashed border-border rounded-lg">
                  <Utensils className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No meals logged today</p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <a href="/dashboard/nutrition/new">Log Your First Meal</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

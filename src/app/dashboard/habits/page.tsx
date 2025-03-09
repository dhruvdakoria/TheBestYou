import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import {
  getHabits,
  toggleHabitCompletion,
  deleteHabit,
  getHabitStats,
} from "@/app/actions/habit-actions";
// Removed subscription check to allow access to habits
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Plus,
  Calendar,
  Check,
  X,
  Bell,
  Flame,
  BarChart3,
  ArrowUpRight,
  Edit,
} from "lucide-react";
import HabitTracker from "@/components/habit-tracker";
import HabitCalendar from "@/components/habit-calendar";

export default async function HabitsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get habits from database
  let habits = [];
  try {
    habits = await getHabits();
  } catch (error) {
    // Handle error silently
  }

  // Get habit statistics
  const habitStats = await getHabitStats();

  // Calculate completion rate
  const totalHabits = habitStats.totalHabits;
  const completedHabits = habitStats.completedToday;
  const completionRate = habitStats.completionRate;
  const monthlyCompletionRate = habitStats.monthlyCompletionRate;

  // Map category to icon color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Health":
        return "text-blue-500";
      case "Fitness":
        return "text-green-500";
      case "Mindfulness":
        return "text-purple-500";
      case "Personal Development":
        return "text-yellow-500";
      case "Productivity":
        return "text-orange-500";
      default:
        return "text-primary";
    }
  };

  // Generate calendar days for the current month
  const daysInMonth = 30; // Simplified for demo
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-background min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-foreground">
                Habit Tracking
              </h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Calendar className="h-4 w-4" />
                  Change Date
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1 bg-primary hover:bg-primary/90"
                  asChild
                >
                  <a href="/dashboard/habits/new">
                    <Plus className="h-4 w-4" />
                    New Habit
                  </a>
                </Button>
              </div>
            </div>
          </header>

          {/* Habits Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Today's Progress */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  Today's Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-secondary stroke-current"
                        strokeWidth="10"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                      ></circle>
                      <circle
                        className="text-primary stroke-current"
                        strokeWidth="10"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        strokeDasharray="251.2"
                        strokeDashoffset={
                          251.2 - (251.2 * completionRate) / 100
                        }
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">
                        {completionRate}%
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Completed
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    You've completed {completedHabits} out of {totalHabits}{" "}
                    habits today
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Streak Summary */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  Current Streaks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {habits
                    .sort((a, b) => b.streak - a.streak)
                    .slice(0, 3)
                    .map((habit) => (
                      <div
                        key={habit.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Flame
                              className={`h-5 w-5 ${getCategoryColor(habit.category)}`}
                            />
                          </div>
                          <span className="font-medium">{habit.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame className="h-4 w-4 text-orange-500" />
                          <span className="font-bold">{habit.streak}</span>
                          <span className="text-sm text-muted-foreground">
                            days
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4">
                  View All Streaks
                </Button>
              </CardContent>
            </Card>

            {/* Monthly Overview */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  Monthly Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <BarChart3 className="h-24 w-24 text-primary" />
                </div>
                <div className="text-center mt-2">
                  <p className="text-2xl font-bold">{monthlyCompletionRate}%</p>
                  <p className="text-sm text-muted-foreground">
                    Average completion rate this month
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4">
                  View Detailed Stats
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Today's Habits */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Today's Habits
              </CardTitle>
              <CardDescription>
                Swipe to mark habits as complete
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {habits.length > 0 ? (
                  habits.map((habit) => (
                    <HabitTracker
                      key={habit.id}
                      habit={habit}
                      onToggle={async (habitId, completed) => {
                        await toggleHabitCompletion(habitId, completed);
                      }}
                    />
                  ))
                ) : (
                  <div className="text-center p-8 border border-dashed border-border rounded-lg">
                    <Flame className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No habits yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start building consistency by creating your first habit
                    </p>
                    <Button asChild>
                      <a href="/dashboard/habits/new">Create Habit</a>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Calendar */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Monthly Consistency
              </CardTitle>
              <CardDescription>
                Track your habit completion over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {habits.length > 0 ? (
                  habits.map((habit) => (
                    <HabitCalendar
                      key={habit.id}
                      habitName={habit.name}
                      completedDays={habit.completedDays || []}
                      daysInMonth={daysInMonth}
                      completionRate={Math.round(
                        (habit.completedDays?.length / daysInMonth) * 100 || 0,
                      )}
                      categoryColor={getCategoryColor(habit.category)}
                    />
                  ))
                ) : (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">
                      No habits to display
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Habit Insights
              </CardTitle>
              <CardDescription>
                AI-powered recommendations to improve your habits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Best time for meditation",
                    description:
                      "Based on your completion patterns, you're most consistent with meditation in the morning between 7-8 AM.",
                    icon: <ArrowUpRight className="h-5 w-5 text-primary" />,
                  },
                  {
                    title: "Habit stacking opportunity",
                    description:
                      "Try linking your 'Read' habit with your evening routine to improve consistency.",
                    icon: <ArrowUpRight className="h-5 w-5 text-primary" />,
                  },
                  {
                    title: "Streak milestone approaching",
                    description:
                      "You're 2 days away from a 2-week streak for 'Drink Water'. Keep it up!",
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

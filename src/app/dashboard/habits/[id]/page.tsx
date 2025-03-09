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
import {
  getHabit,
  updateHabit,
  deleteHabit,
} from "@/app/actions/habit-actions";
import { Flame, ArrowLeft, Bell, Trash2 } from "lucide-react";
import HabitForm from "@/components/habit-form";

export default async function HabitDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const habit = await getHabit(params.id);
  if (!habit) {
    return redirect("/dashboard/habits");
  }

  // Map category to color
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

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-background min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Button variant="ghost" size="sm" asChild className="p-0">
                <a href="/dashboard/habits">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Habits
                </a>
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Flame
                    className={`h-5 w-5 ${getCategoryColor(habit.category)}`}
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {habit.name}
                  </h1>
                  <div className="flex items-center gap-4 mt-1 text-muted-foreground">
                    <span>{habit.target}</span>
                    <span>•</span>
                    <span>{habit.category}</span>
                    {habit.reminder_time && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Bell className="h-4 w-4" />
                          <span>{habit.reminder_time}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <form
                  action={async () => {
                    "use server";
                    await deleteHabit(params.id);
                    redirect("/dashboard/habits");
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

          {/* Habit Details */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Habit Details</CardTitle>
              <CardDescription>Edit your habit information</CardDescription>
            </CardHeader>
            <CardContent>
              <HabitForm
                initialData={{
                  name: habit.name,
                  target: habit.target,
                  category: habit.category,
                  reminderTime: habit.reminder_time,
                }}
                onSave={async (updatedHabit) => {
                  "use server";
                  await updateHabit(params.id, updatedHabit);
                  redirect(`/dashboard/habits/${params.id}`);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

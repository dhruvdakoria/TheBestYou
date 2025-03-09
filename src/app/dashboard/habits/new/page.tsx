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
import HabitForm from "@/components/habit-form";
import { createHabit } from "@/app/actions/habit-actions";

export default async function NewHabitPage() {
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
                Create New Habit
              </h1>
            </div>
          </header>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Habit Details</CardTitle>
              <CardDescription>
                Create a new habit to track daily and build consistency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HabitForm
                onSave={async (habit) => {
                  "use server";
                  const result = await createHabit(habit);
                  if (result.success) {
                    redirect("/dashboard/habits");
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

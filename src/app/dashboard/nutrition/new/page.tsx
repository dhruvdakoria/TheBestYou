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
import MealForm from "@/components/meal-form";
import { createMeal } from "@/app/actions/meal-actions";

export default async function NewMealPage() {
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
                Add New Meal
              </h1>
            </div>
          </header>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Meal Details</CardTitle>
              <CardDescription>
                Log your meal by adding food items and their nutritional
                information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MealForm
                onSave={async (meal) => {
                  "use server";
                  const result = await createMeal(meal);
                  if (result.success) {
                    redirect("/dashboard/nutrition");
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

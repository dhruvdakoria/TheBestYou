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
import { getMeal, updateMeal, deleteMeal } from "@/app/actions/meal-actions";
import { Utensils, ArrowLeft, Clock, Calendar, Trash2 } from "lucide-react";
import MealForm from "@/components/meal-form";

export default async function MealDetailPage({
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

  const meal = await getMeal(params.id);
  if (!meal) {
    return redirect("/dashboard/nutrition");
  }

  // Format date for display
  const mealDate = new Date(meal.date);
  const formattedDate = mealDate.toLocaleDateString("en-US", {
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
                <a href="/dashboard/nutrition">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Nutrition
                </a>
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {meal.type}
                </h1>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{meal.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <form
                  action={async () => {
                    "use server";
                    await deleteMeal(params.id);
                    redirect("/dashboard/nutrition");
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

          {/* Meal Details */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Meal Details</CardTitle>
              <CardDescription>Edit your meal information</CardDescription>
            </CardHeader>
            <CardContent>
              <MealForm
                initialData={{
                  type: meal.type,
                  time: meal.time,
                  foods: meal.foods.map((food) => ({
                    id: food.id,
                    name: food.name,
                    portion: food.portion,
                    calories: food.calories,
                    protein: food.protein,
                    carbs: food.carbs,
                    fat: food.fat,
                  })),
                }}
                onSave={async (updatedMeal) => {
                  "use server";
                  await updateMeal(params.id, updatedMeal);
                  redirect(`/dashboard/nutrition/${params.id}`);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

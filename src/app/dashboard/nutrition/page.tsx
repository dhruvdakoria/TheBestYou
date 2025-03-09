import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import {
  getMeals,
  deleteMeal,
  getNutritionSummary,
} from "@/app/actions/meal-actions";
// Removed subscription check to allow access to nutrition
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Utensils,
  Plus,
  Calendar,
  Camera,
  Search,
  PieChart,
  ArrowUpRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function NutritionPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get meals from database
  let meals = [];
  try {
    meals = await getMeals();
  } catch (error) {
    // Handle error silently
  }

  // Get nutrition summary
  const nutritionData = await getNutritionSummary();

  // Extract nutrition data
  const { summary } = nutritionData;
  const dailyCalories = summary.calories.current;
  const dailyProtein = summary.protein.current;
  const dailyCarbs = summary.carbs.current;
  const dailyFat = summary.fat.current;

  // Nutrition goals
  const calorieGoal = summary.calories.goal;
  const proteinGoal = summary.protein.goal;
  const carbsGoal = summary.carbs.goal;
  const fatGoal = summary.fat.goal;

  // Sample meal images (in a real app, these would be stored with the meal data)
  const mealTypeImages = {
    Breakfast:
      "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500&q=80",
    Lunch:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&q=80",
    Dinner:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&q=80",
    Snack:
      "https://images.unsplash.com/photo-1579722821273-0f6c1b5d0b51?w=500&q=80",
  };

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-background min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-foreground">
                Nutrition Tracking
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
                  <a href="/dashboard/nutrition/new">
                    <Plus className="h-4 w-4" />
                    Add Meal
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Camera className="h-4 w-4" />
                  Scan Food
                </Button>
              </div>
            </div>
          </header>

          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search foods..." className="pl-10 w-full" />
          </div>

          {/* Nutrition Summary */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Today's Nutrition
              </CardTitle>
              <CardDescription>
                Daily nutrition summary and goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {[
                  {
                    label: "Calories",
                    value: dailyCalories,
                    target: calorieGoal,
                    color: "bg-primary",
                    unit: "kcal",
                  },
                  {
                    label: "Protein",
                    value: dailyProtein,
                    target: proteinGoal,
                    color: "bg-blue-500",
                    unit: "g",
                  },
                  {
                    label: "Carbs",
                    value: dailyCarbs,
                    target: carbsGoal,
                    color: "bg-green-500",
                    unit: "g",
                  },
                  {
                    label: "Fat",
                    value: dailyFat,
                    target: fatGoal,
                    color: "bg-yellow-500",
                    unit: "g",
                  },
                ].map((macro, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{macro.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {macro.value} / {macro.target} {macro.unit}
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${macro.color} rounded-full`}
                        style={{
                          width: `${Math.min((macro.value / macro.target) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      {Math.round((macro.value / macro.target) * 100)}% of goal
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mb-6">
                <div className="w-64 h-64 relative">
                  <PieChart className="w-full h-full text-muted-foreground" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold">{dailyCalories}</span>
                    <span className="text-sm text-muted-foreground">
                      calories consumed
                    </span>
                    <span className="text-sm text-muted-foreground mt-1">
                      {calorieGoal - dailyCalories} remaining
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold">
                    {Math.round(((dailyProtein * 4) / dailyCalories) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Protein</div>
                </div>
                <div>
                  <div className="text-lg font-bold">
                    {Math.round(((dailyCarbs * 4) / dailyCalories) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Carbs</div>
                </div>
                <div>
                  <div className="text-lg font-bold">
                    {Math.round(((dailyFat * 9) / dailyCalories) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Fat</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meals */}
          <div className="space-y-6">
            {meals.length > 0 ? (
              meals.map((meal) => (
                <Card
                  key={meal.id}
                  className="border border-border overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 h-48 md:h-auto relative">
                      <img
                        src={
                          mealTypeImages[
                            meal.type as keyof typeof mealTypeImages
                          ] ||
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"
                        }
                        alt={meal.type}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                        <h3 className="text-white text-xl font-bold">
                          {meal.type}
                        </h3>
                        <p className="text-white/80 text-sm">{meal.time}</p>
                      </div>
                    </div>
                    <div className="p-6 md:w-3/4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-lg font-bold">{meal.type}</h3>
                          <p className="text-sm text-muted-foreground">
                            {meal.time} • {meal.totalCalories} calories
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/dashboard/nutrition/${meal.id}`}>Edit</a>
                          </Button>
                          <form
                            action={async () => {
                              "use server";
                              await deleteMeal(meal.id);
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

                      <div className="space-y-2">
                        {meal.foods.map((food, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 rounded-md hover:bg-secondary/20 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Utensils className="h-4 w-4 text-primary" />
                              <div>
                                <span className="font-medium">{food.name}</span>
                                <span className="text-sm text-muted-foreground">
                                  {" "}
                                  • {food.portion}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">
                                {food.calories} cal
                              </span>
                              <span className="text-muted-foreground">
                                {" "}
                                • {food.protein}p {food.carbs}c {food.fat}f
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center p-8 border border-dashed border-border rounded-lg">
                <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No meals logged yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your nutrition by logging your first meal
                </p>
                <Button asChild>
                  <a href="/dashboard/nutrition/new">Add Meal</a>
                </Button>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                AI Recommendations
              </CardTitle>
              <CardDescription>
                Personalized nutrition insights based on your goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Increase protein intake",
                    description:
                      "You're currently at 80% of your protein goal. Consider adding more lean protein sources to your meals.",
                    icon: <ArrowUpRight className="h-5 w-5 text-primary" />,
                  },
                  {
                    title: "Hydration reminder",
                    description:
                      "Don't forget to drink water throughout the day. Aim for at least 8 glasses.",
                    icon: <ArrowUpRight className="h-5 w-5 text-primary" />,
                  },
                  {
                    title: "Pre-workout nutrition",
                    description:
                      "Based on your workout schedule, consider having a carb-rich snack 1-2 hours before your training session.",
                    icon: <ArrowUpRight className="h-5 w-5 text-primary" />,
                  },
                ].map((recommendation, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {recommendation.icon}
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">
                        {recommendation.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {recommendation.description}
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

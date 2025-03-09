"use server";

import { createClient } from "../../../supabase/server";
import { revalidatePath } from "next/cache";

interface Food {
  id?: string;
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Meal {
  type: string;
  time: string;
  foods: Food[];
  date?: string;
}

export async function createMeal(meal: Meal) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Create meal
  const { data: mealData, error: mealError } = await supabase
    .from("meals")
    .insert({
      user_id: user.id,
      type: meal.type,
      time: meal.time,
      date: meal.date || new Date().toISOString(),
    })
    .select()
    .single();

  if (mealError) {
    throw new Error(`Error creating meal: ${mealError.message}`);
  }

  // Create foods
  const foodsWithMealId = meal.foods.map((food) => ({
    meal_id: mealData.id,
    name: food.name,
    portion: food.portion,
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
  }));

  const { error: foodsError } = await supabase
    .from("foods")
    .insert(foodsWithMealId);

  if (foodsError) {
    throw new Error(`Error creating foods: ${foodsError.message}`);
  }

  revalidatePath("/dashboard/nutrition");
  revalidatePath("/dashboard");

  return { success: true, mealId: mealData.id };
}

export async function getMeals() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: meals, error: mealsError } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (mealsError) {
    throw new Error(`Error fetching meals: ${mealsError.message}`);
  }

  // Get foods for each meal
  const mealsWithFoods = await Promise.all(
    meals.map(async (meal) => {
      const { data: foods, error: foodsError } = await supabase
        .from("foods")
        .select("*")
        .eq("meal_id", meal.id);

      if (foodsError) {
        throw new Error(`Error fetching foods: ${foodsError.message}`);
      }

      // Calculate total calories
      const totalCalories =
        foods?.reduce((sum, food) => sum + food.calories, 0) || 0;

      return {
        ...meal,
        foods: foods || [],
        totalCalories,
      };
    }),
  );

  return mealsWithFoods;
}

export async function getMeal(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: meal, error: mealError } = await supabase
    .from("meals")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (mealError) {
    throw new Error(`Error fetching meal: ${mealError.message}`);
  }

  const { data: foods, error: foodsError } = await supabase
    .from("foods")
    .select("*")
    .eq("meal_id", id);

  if (foodsError) {
    throw new Error(`Error fetching foods: ${foodsError.message}`);
  }

  return {
    ...meal,
    foods: foods || [],
  };
}

export async function updateMeal(id: string, meal: Meal) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Update meal
  const { error: mealError } = await supabase
    .from("meals")
    .update({
      type: meal.type,
      time: meal.time,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (mealError) {
    throw new Error(`Error updating meal: ${mealError.message}`);
  }

  // Delete existing foods
  const { error: deleteError } = await supabase
    .from("foods")
    .delete()
    .eq("meal_id", id);

  if (deleteError) {
    throw new Error(`Error deleting foods: ${deleteError.message}`);
  }

  // Create new foods
  const foodsWithMealId = meal.foods.map((food) => ({
    meal_id: id,
    name: food.name,
    portion: food.portion,
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
  }));

  const { error: foodsError } = await supabase
    .from("foods")
    .insert(foodsWithMealId);

  if (foodsError) {
    throw new Error(`Error creating foods: ${foodsError.message}`);
  }

  revalidatePath("/dashboard/nutrition");
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/nutrition/${id}`);

  return { success: true };
}

export async function deleteMeal(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Delete meal (foods will be deleted via cascade)
  const { error } = await supabase
    .from("meals")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Error deleting meal: ${error.message}`);
  }

  revalidatePath("/dashboard/nutrition");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function getNutritionSummary(date?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Format date to YYYY-MM-DD for comparison
  const targetDate = date || new Date().toISOString().split("T")[0];

  // Get meals for the specified date
  const { data: meals, error: mealsError } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", `${targetDate}T00:00:00`)
    .lt("date", `${targetDate}T23:59:59`);

  if (mealsError) {
    throw new Error(`Error fetching meals: ${mealsError.message}`);
  }

  // Get all foods for these meals
  let allFoods: any[] = [];

  if (meals && meals.length > 0) {
    const mealIds = meals.map((meal) => meal.id);

    const { data: foods, error: foodsError } = await supabase
      .from("foods")
      .select("*")
      .in("meal_id", mealIds);

    if (foodsError) {
      throw new Error(`Error fetching foods: ${foodsError.message}`);
    }

    allFoods = foods || [];
  }

  // Calculate nutrition totals
  const dailyCalories = allFoods.reduce((sum, food) => sum + food.calories, 0);
  const dailyProtein = allFoods.reduce((sum, food) => sum + food.protein, 0);
  const dailyCarbs = allFoods.reduce((sum, food) => sum + food.carbs, 0);
  const dailyFat = allFoods.reduce((sum, food) => sum + food.fat, 0);

  // Nutrition goals (could be personalized per user in the future)
  const calorieGoal = 2400;
  const proteinGoal = 150;
  const carbsGoal = 250;
  const fatGoal = 80;

  return {
    meals: meals || [],
    summary: {
      calories: {
        current: dailyCalories,
        goal: calorieGoal,
        percentage: Math.round((dailyCalories / calorieGoal) * 100),
      },
      protein: {
        current: dailyProtein,
        goal: proteinGoal,
        percentage: Math.round((dailyProtein / proteinGoal) * 100),
      },
      carbs: {
        current: dailyCarbs,
        goal: carbsGoal,
        percentage: Math.round((dailyCarbs / carbsGoal) * 100),
      },
      fat: {
        current: dailyFat,
        goal: fatGoal,
        percentage: Math.round((dailyFat / fatGoal) * 100),
      },
    },
  };
}

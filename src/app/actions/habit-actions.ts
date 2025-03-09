"use server";

import { createClient } from "../../../supabase/server";
import { revalidatePath } from "next/cache";

interface Habit {
  name: string;
  target: string;
  category: string;
  reminderTime?: string;
}

export async function createHabit(habit: Habit) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("habits")
    .insert({
      user_id: user.id,
      name: habit.name,
      target: habit.target,
      category: habit.category,
      reminder_time: habit.reminderTime,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating habit: ${error.message}`);
  }

  revalidatePath("/dashboard/habits");
  revalidatePath("/dashboard");

  return { success: true, habitId: data.id };
}

export async function getHabits() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: habits, error: habitsError } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user.id);

  if (habitsError) {
    throw new Error(`Error fetching habits: ${habitsError.message}`);
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Get habit completions for each habit for today
  const habitsWithCompletions = await Promise.all(
    habits.map(async (habit) => {
      const { data: completions, error: completionsError } = await supabase
        .from("habit_completions")
        .select("*")
        .eq("habit_id", habit.id)
        .eq("date", today)
        .limit(1);

      if (completionsError) {
        throw new Error(
          `Error fetching completions: ${completionsError.message}`,
        );
      }

      // Calculate streak
      const { data: streakData, error: streakError } = await supabase
        .from("habit_completions")
        .select("date")
        .eq("habit_id", habit.id)
        .eq("completed", true)
        .order("date", { ascending: false });

      if (streakError) {
        throw new Error(`Error calculating streak: ${streakError.message}`);
      }

      let streak = 0;
      if (streakData && streakData.length > 0) {
        // Sort dates in descending order
        const sortedDates = streakData
          .map((item) => new Date(item.date))
          .sort((a, b) => b.getTime() - a.getTime());

        // Calculate streak by checking consecutive days
        let currentDate = new Date(sortedDates[0]);
        streak = 1;

        for (let i = 1; i < sortedDates.length; i++) {
          const prevDate = new Date(currentDate);
          prevDate.setDate(prevDate.getDate() - 1);

          if (
            sortedDates[i].toISOString().split("T")[0] ===
            prevDate.toISOString().split("T")[0]
          ) {
            streak++;
            currentDate = prevDate;
          } else {
            break;
          }
        }
      }

      // Get all completions for the current month for the calendar view
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const startOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, "0")}-01`;
      const endOfMonth = new Date(currentYear, currentMonth, 0)
        .toISOString()
        .split("T")[0];

      const { data: monthCompletions, error: monthError } = await supabase
        .from("habit_completions")
        .select("date")
        .eq("habit_id", habit.id)
        .eq("completed", true)
        .gte("date", startOfMonth)
        .lte("date", endOfMonth);

      if (monthError) {
        throw new Error(
          `Error fetching month completions: ${monthError.message}`,
        );
      }

      const completedDays =
        monthCompletions?.map((item) => new Date(item.date).getDate()) || [];

      return {
        ...habit,
        completed:
          completions && completions.length > 0
            ? completions[0].completed
            : false,
        streak,
        completedDays,
      };
    }),
  );

  return habitsWithCompletions;
}

export async function getHabit(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: habit, error } = await supabase
    .from("habits")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw new Error(`Error fetching habit: ${error.message}`);
  }

  return habit;
}

export async function updateHabit(id: string, habit: Habit) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("habits")
    .update({
      name: habit.name,
      target: habit.target,
      category: habit.category,
      reminder_time: habit.reminderTime,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Error updating habit: ${error.message}`);
  }

  revalidatePath("/dashboard/habits");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function deleteHabit(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Error deleting habit: ${error.message}`);
  }

  revalidatePath("/dashboard/habits");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function toggleHabitCompletion(
  habitId: string,
  completed: boolean,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Check if there's already a completion record for today
  const { data: existingCompletion, error: checkError } = await supabase
    .from("habit_completions")
    .select("*")
    .eq("habit_id", habitId)
    .eq("date", today)
    .maybeSingle();

  if (checkError) {
    throw new Error(`Error checking habit completion: ${checkError.message}`);
  }

  let error;

  if (existingCompletion) {
    // Update existing completion
    const { error: updateError } = await supabase
      .from("habit_completions")
      .update({ completed })
      .eq("id", existingCompletion.id);

    error = updateError;
  } else {
    // Create new completion
    const { error: insertError } = await supabase
      .from("habit_completions")
      .insert({
        habit_id: habitId,
        date: today,
        completed,
      });

    error = insertError;
  }

  if (error) {
    throw new Error(`Error toggling habit completion: ${error.message}`);
  }

  revalidatePath("/dashboard/habits");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function getHabitStats() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get all habits
  const { data: habits, error: habitsError } = await supabase
    .from("habits")
    .select("id")
    .eq("user_id", user.id);

  if (habitsError) {
    throw new Error(`Error fetching habits: ${habitsError.message}`);
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Get completions for today
  const { data: todayCompletions, error: completionsError } = await supabase
    .from("habit_completions")
    .select("*")
    .in(
      "habit_id",
      habits.map((h) => h.id),
    )
    .eq("date", today)
    .eq("completed", true);

  if (completionsError) {
    throw new Error(`Error fetching completions: ${completionsError.message}`);
  }

  // Calculate completion rate for the current month
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const startOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, "0")}-01`;
  const endOfMonth = new Date(currentYear, currentMonth, 0)
    .toISOString()
    .split("T")[0];

  const { data: monthCompletions, error: monthError } = await supabase
    .from("habit_completions")
    .select("date, habit_id")
    .in(
      "habit_id",
      habits.map((h) => h.id),
    )
    .eq("completed", true)
    .gte("date", startOfMonth)
    .lte("date", endOfMonth);

  if (monthError) {
    throw new Error(`Error fetching month completions: ${monthError.message}`);
  }

  // Calculate days in month
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Calculate total possible completions (habits × days)
  const totalPossibleCompletions = habits.length * daysInMonth;

  // Calculate monthly completion rate
  const monthlyCompletionRate =
    totalPossibleCompletions > 0
      ? Math.round(
          ((monthCompletions?.length || 0) / totalPossibleCompletions) * 100,
        )
      : 0;

  return {
    totalHabits: habits.length,
    completedToday: todayCompletions?.length || 0,
    completionRate:
      habits.length > 0
        ? Math.round(((todayCompletions?.length || 0) / habits.length) * 100)
        : 0,
    monthlyCompletionRate,
  };
}

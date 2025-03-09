"use server";

import { createClient } from "../../../supabase/server";
import { revalidatePath } from "next/cache";

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
  name: string;
  exercises: Exercise[];
  date?: string;
  duration?: string;
  notes?: string;
}

export async function createWorkout(workout: Workout) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Create workout
  const { data: workoutData, error: workoutError } = await supabase
    .from("workouts")
    .insert({
      user_id: user.id,
      name: workout.name,
      date: workout.date || new Date().toISOString(),
      duration: workout.duration || "",
      notes: workout.notes || "",
    })
    .select()
    .single();

  if (workoutError) {
    throw new Error(`Error creating workout: ${workoutError.message}`);
  }

  // Create exercises and their sets
  for (const exercise of workout.exercises) {
    // Create the exercise
    const { data: exerciseData, error: exerciseError } = await supabase
      .from("exercises")
      .insert({
        workout_id: workoutData.id,
        name: exercise.name,
        sets: exercise.sets.length,
        reps: exercise.sets[0]?.reps || "", // For backward compatibility
        weight: exercise.weight || "",
      })
      .select()
      .single();

    if (exerciseError) {
      throw new Error(`Error creating exercise: ${exerciseError.message}`);
    }

    // Create sets for this exercise
    const setsWithExerciseId = exercise.sets.map((set, index) => ({
      exercise_id: exerciseData.id,
      set_number: index + 1,
      reps: set.reps,
      weight: set.weight || exercise.weight || "",
    }));

    const { error: setsError } = await supabase
      .from("exercise_sets")
      .insert(setsWithExerciseId);

    if (setsError) {
      throw new Error(`Error creating exercise sets: ${setsError.message}`);
    }
  }

  revalidatePath("/dashboard/workouts");
  revalidatePath("/dashboard");

  return { success: true, workoutId: workoutData.id };
}

export async function getWorkouts(limit?: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  let query = supabase
    .from("workouts")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data: workouts, error: workoutsError } = await query;

  if (workoutsError) {
    throw new Error(`Error fetching workouts: ${workoutsError.message}`);
  }

  // Get exercises and their sets for each workout
  const workoutsWithExercises = await Promise.all(
    workouts.map(async (workout) => {
      const { data: exercises, error: exercisesError } = await supabase
        .from("exercises")
        .select("*")
        .eq("workout_id", workout.id);

      if (exercisesError) {
        throw new Error(`Error fetching exercises: ${exercisesError.message}`);
      }

      // Get sets for each exercise
      const exercisesWithSets = await Promise.all(
        (exercises || []).map(async (exercise) => {
          const { data: sets, error: setsError } = await supabase
            .from("exercise_sets")
            .select("*")
            .eq("exercise_id", exercise.id)
            .order("set_number", { ascending: true });

          if (setsError) {
            throw new Error(
              `Error fetching exercise sets: ${setsError.message}`,
            );
          }

          // If no sets found, create a backward compatible format
          if (!sets || sets.length === 0) {
            return {
              ...exercise,
              sets: Array(exercise.sets)
                .fill(0)
                .map((_, i) => ({
                  id: `legacy-${exercise.id}-${i}`,
                  reps: exercise.reps,
                  weight: exercise.weight,
                })),
            };
          }

          // Map sets to the expected format
          return {
            ...exercise,
            sets: sets.map((set) => ({
              id: set.id,
              reps: set.reps,
              weight: set.weight,
            })),
          };
        }),
      );

      return {
        ...workout,
        exercises: exercisesWithSets || [],
      };
    }),
  );

  return workoutsWithExercises;
}

export async function getWorkout(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: workout, error: workoutError } = await supabase
    .from("workouts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (workoutError) {
    throw new Error(`Error fetching workout: ${workoutError.message}`);
  }

  const { data: exercises, error: exercisesError } = await supabase
    .from("exercises")
    .select("*")
    .eq("workout_id", id);

  if (exercisesError) {
    throw new Error(`Error fetching exercises: ${exercisesError.message}`);
  }

  // Get sets for each exercise
  const exercisesWithSets = await Promise.all(
    (exercises || []).map(async (exercise) => {
      const { data: sets, error: setsError } = await supabase
        .from("exercise_sets")
        .select("*")
        .eq("exercise_id", exercise.id)
        .order("set_number", { ascending: true });

      if (setsError) {
        throw new Error(`Error fetching exercise sets: ${setsError.message}`);
      }

      // If no sets found, create a backward compatible format
      if (!sets || sets.length === 0) {
        return {
          ...exercise,
          sets: Array(exercise.sets)
            .fill(0)
            .map((_, i) => ({
              id: `legacy-${exercise.id}-${i}`,
              reps: exercise.reps,
              weight: exercise.weight,
            })),
        };
      }

      // Map sets to the expected format
      return {
        ...exercise,
        sets: sets.map((set) => ({
          id: set.id,
          reps: set.reps,
          weight: set.weight,
        })),
      };
    }),
  );

  return {
    ...workout,
    exercises: exercisesWithSets || [],
  };
}

export async function updateWorkout(id: string, workout: Workout) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Update workout
  const { error: workoutError } = await supabase
    .from("workouts")
    .update({
      name: workout.name,
      date: workout.date || new Date().toISOString(),
      duration: workout.duration || "",
      notes: workout.notes || "",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (workoutError) {
    throw new Error(`Error updating workout: ${workoutError.message}`);
  }

  // Get existing exercises to delete their sets first
  const { data: existingExercises, error: fetchError } = await supabase
    .from("exercises")
    .select("id")
    .eq("workout_id", id);

  if (fetchError) {
    throw new Error(`Error fetching existing exercises: ${fetchError.message}`);
  }

  // Delete sets for existing exercises
  if (existingExercises && existingExercises.length > 0) {
    const exerciseIds = existingExercises.map((ex) => ex.id);
    const { error: deleteSetsError } = await supabase
      .from("exercise_sets")
      .delete()
      .in("exercise_id", exerciseIds);

    if (deleteSetsError) {
      throw new Error(
        `Error deleting exercise sets: ${deleteSetsError.message}`,
      );
    }
  }

  // Delete existing exercises
  const { error: deleteError } = await supabase
    .from("exercises")
    .delete()
    .eq("workout_id", id);

  if (deleteError) {
    throw new Error(`Error deleting exercises: ${deleteError.message}`);
  }

  // Create new exercises and their sets
  for (const exercise of workout.exercises) {
    // Create the exercise
    const { data: exerciseData, error: exerciseError } = await supabase
      .from("exercises")
      .insert({
        workout_id: id,
        name: exercise.name,
        sets: exercise.sets.length,
        reps: exercise.sets[0]?.reps || "", // For backward compatibility
        weight: exercise.weight || "",
      })
      .select()
      .single();

    if (exerciseError) {
      throw new Error(`Error creating exercise: ${exerciseError.message}`);
    }

    // Create sets for this exercise
    const setsWithExerciseId = exercise.sets.map((set, index) => ({
      exercise_id: exerciseData.id,
      set_number: index + 1,
      reps: set.reps,
      weight: set.weight || exercise.weight || "",
    }));

    const { error: setsError } = await supabase
      .from("exercise_sets")
      .insert(setsWithExerciseId);

    if (setsError) {
      throw new Error(`Error creating exercise sets: ${setsError.message}`);
    }
  }

  revalidatePath("/dashboard/workouts");
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/workouts/${id}`);

  return { success: true };
}

export async function deleteWorkout(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Delete workout (exercises will be deleted via cascade)
  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Error deleting workout: ${error.message}`);
  }

  revalidatePath("/dashboard/workouts");
  revalidatePath("/dashboard");

  return { success: true };
}

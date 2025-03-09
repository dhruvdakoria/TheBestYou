"use client";

import { useState } from "react";
import WorkoutForm from "./workout-form";

interface Exercise {
  id: string;
  name: string;
  sets: {
    id: string;
    reps: string;
    weight: string;
  }[];
  weight: string;
}

interface WorkoutFormWrapperProps {
  initialData?: {
    name: string;
    exercises: Exercise[];
  };
  onSaveAction: (formData: FormData) => void;
}

export default function WorkoutFormWrapper({
  initialData,
  onSaveAction,
}: WorkoutFormWrapperProps) {
  const [workoutData, setWorkoutData] = useState(
    initialData || { name: "", exercises: [] },
  );

  const handleSave = (workout: { name: string; exercises: Exercise[] }) => {
    // Create a FormData object to submit
    const formData = new FormData();
    formData.append("name", workout.name);
    formData.append("exercises", JSON.stringify(workout.exercises));

    // Call the server action
    onSaveAction(formData);
  };

  return <WorkoutForm initialData={workoutData} onSave={handleSave} />;
}

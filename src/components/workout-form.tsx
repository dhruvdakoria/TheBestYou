"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dumbbell, Plus, Trash2, Save, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import ExerciseSelector from "./exercise-selector";

interface ExerciseSet {
  id: string;
  reps: string;
  weight: string;
}

interface Exercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
  weight: string;
}

interface WorkoutFormProps {
  onSave?: (workout: { name: string; exercises: Exercise[] }) => void;
  initialData?: {
    name: string;
    exercises: Exercise[];
  };
}

export default function WorkoutForm({ onSave, initialData }: WorkoutFormProps) {
  const [workoutName, setWorkoutName] = useState(initialData?.name || "");
  const [exercises, setExercises] = useState<Exercise[]>(
    initialData?.exercises || [],
  );

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: Date.now().toString(),
        name: "",
        sets: Array(3)
          .fill(0)
          .map(() => ({
            id: Date.now().toString() + Math.random().toString(36).substring(2),
            reps: "10",
            weight: "",
          })),
        weight: "",
      },
    ]);
  };

  const updateExercise = (id: string, field: keyof Exercise, value: any) => {
    setExercises(
      exercises.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex)),
    );
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        name: workoutName,
        exercises,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="workoutName">Workout Name</Label>
        <Input
          id="workoutName"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          placeholder="e.g., Upper Body Strength"
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Exercises</h3>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <Search className="h-4 w-4" /> Browse Exercises
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Select Exercise</DialogTitle>
                </DialogHeader>
                <ExerciseSelector
                  onSelectExercise={(exercise) => {
                    setExercises([
                      ...exercises,
                      {
                        id: Date.now().toString(),
                        name: exercise.name,
                        sets: Array(3)
                          .fill(0)
                          .map(() => ({
                            id:
                              Date.now().toString() +
                              Math.random().toString(36).substring(2),
                            reps: "10",
                            weight: "",
                          })),
                        weight: "",
                      },
                    ]);
                  }}
                />
              </DialogContent>
            </Dialog>
            <Button
              type="button"
              onClick={addExercise}
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <Plus className="h-4 w-4" /> Add Custom
            </Button>
          </div>
        </div>

        {exercises.length === 0 ? (
          <Card className="border border-dashed border-border">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <Dumbbell className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No exercises added yet</p>
              <Button
                type="button"
                onClick={addExercise}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                Add Your First Exercise
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {exercises.map((exercise) => (
              <Card key={exercise.id} className="border border-border">
                <CardHeader className="p-4 pb-0">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={`exercise-${exercise.id}-name`}>
                      Exercise
                    </Label>
                    <Button
                      type="button"
                      onClick={() => removeExercise(exercise.id)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        id={`exercise-${exercise.id}-name`}
                        value={exercise.name}
                        onChange={(e) =>
                          updateExercise(exercise.id, "name", e.target.value)
                        }
                        placeholder="Exercise name"
                        required
                      />
                    </div>
                    <div>
                      <div className="flex flex-col space-y-1">
                        <Label
                          htmlFor={`exercise-${exercise.id}-sets`}
                          className="text-xs"
                        >
                          Sets
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id={`exercise-${exercise.id}-sets`}
                            type="number"
                            min="1"
                            value={exercise.sets.length}
                            onChange={(e) => {
                              const newSetCount = parseInt(e.target.value);
                              const currentSets = [...exercise.sets];

                              if (newSetCount > currentSets.length) {
                                // Add more sets
                                const setsToAdd =
                                  newSetCount - currentSets.length;
                                const newSets = Array(setsToAdd)
                                  .fill(0)
                                  .map(() => ({
                                    id:
                                      Date.now().toString() +
                                      Math.random().toString(36).substring(2),
                                    reps: "10",
                                    weight: "",
                                  }));
                                updateExercise(exercise.id, "sets", [
                                  ...currentSets,
                                  ...newSets,
                                ]);
                              } else if (newSetCount < currentSets.length) {
                                // Remove sets
                                updateExercise(
                                  exercise.id,
                                  "sets",
                                  currentSets.slice(0, newSetCount),
                                );
                              }
                            }}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col space-y-1">
                        <Label className="text-xs">Reps & Weight per Set</Label>
                        <div className="space-y-2 mt-1">
                          {exercise.sets.map((set, setIndex) => (
                            <div
                              key={set.id}
                              className="flex items-center gap-2"
                            >
                              <span className="text-xs text-muted-foreground w-6">
                                #{setIndex + 1}
                              </span>
                              <Input
                                value={set.reps}
                                onChange={(e) => {
                                  const newSets = [...exercise.sets];
                                  newSets[setIndex].reps = e.target.value;
                                  updateExercise(exercise.id, "sets", newSets);
                                }}
                                placeholder="Reps"
                                className="flex-1"
                                required
                              />
                              <Input
                                value={set.weight}
                                onChange={(e) => {
                                  const newSets = [...exercise.sets];
                                  newSets[setIndex].weight = e.target.value;
                                  updateExercise(exercise.id, "sets", newSets);
                                }}
                                placeholder="Weight"
                                className="flex-1"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex flex-col space-y-1">
                        <Label
                          htmlFor={`exercise-${exercise.id}-default-weight`}
                          className="text-xs"
                        >
                          Default Weight (optional)
                        </Label>
                        <Input
                          id={`exercise-${exercise.id}-default-weight`}
                          value={exercise.weight}
                          onChange={(e) =>
                            updateExercise(
                              exercise.id,
                              "weight",
                              e.target.value,
                            )
                          }
                          placeholder="e.g., 135 lbs or Bodyweight"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full gap-2 bg-primary hover:bg-primary/90"
      >
        <Save className="h-4 w-4" /> Save Workout
      </Button>
    </form>
  );
}

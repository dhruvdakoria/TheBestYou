"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Dumbbell, Search, Plus } from "lucide-react";

interface ExerciseSelectorProps {
  onSelectExercise: (exercise: { name: string; category: string }) => void;
}

export default function ExerciseSelector({
  onSelectExercise,
}: ExerciseSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Predefined exercise categories and exercises
  const exerciseCategories = [
    { id: "chest", name: "Chest" },
    { id: "back", name: "Back" },
    { id: "legs", name: "Legs" },
    { id: "shoulders", name: "Shoulders" },
    { id: "arms", name: "Arms" },
    { id: "core", name: "Core" },
    { id: "cardio", name: "Cardio" },
  ];

  const predefinedExercises = [
    // Chest
    { name: "Bench Press", category: "chest" },
    { name: "Incline Bench Press", category: "chest" },
    { name: "Decline Bench Press", category: "chest" },
    { name: "Dumbbell Fly", category: "chest" },
    { name: "Push-up", category: "chest" },
    { name: "Cable Crossover", category: "chest" },

    // Back
    { name: "Pull-up", category: "back" },
    { name: "Lat Pulldown", category: "back" },
    { name: "Seated Row", category: "back" },
    { name: "Bent Over Row", category: "back" },
    { name: "Deadlift", category: "back" },
    { name: "T-Bar Row", category: "back" },

    // Legs
    { name: "Squat", category: "legs" },
    { name: "Leg Press", category: "legs" },
    { name: "Leg Extension", category: "legs" },
    { name: "Leg Curl", category: "legs" },
    { name: "Calf Raise", category: "legs" },
    { name: "Lunge", category: "legs" },

    // Shoulders
    { name: "Overhead Press", category: "shoulders" },
    { name: "Lateral Raise", category: "shoulders" },
    { name: "Front Raise", category: "shoulders" },
    { name: "Reverse Fly", category: "shoulders" },
    { name: "Face Pull", category: "shoulders" },
    { name: "Shrug", category: "shoulders" },

    // Arms
    { name: "Bicep Curl", category: "arms" },
    { name: "Tricep Extension", category: "arms" },
    { name: "Hammer Curl", category: "arms" },
    { name: "Skull Crusher", category: "arms" },
    { name: "Preacher Curl", category: "arms" },
    { name: "Dip", category: "arms" },

    // Core
    { name: "Crunch", category: "core" },
    { name: "Plank", category: "core" },
    { name: "Russian Twist", category: "core" },
    { name: "Leg Raise", category: "core" },
    { name: "Mountain Climber", category: "core" },
    { name: "Ab Wheel Rollout", category: "core" },

    // Cardio
    { name: "Running", category: "cardio" },
    { name: "Cycling", category: "cardio" },
    { name: "Rowing", category: "cardio" },
    { name: "Jump Rope", category: "cardio" },
    { name: "Stair Climber", category: "cardio" },
    { name: "Elliptical", category: "cardio" },
  ];

  // Filter exercises based on search term and selected category
  const filteredExercises = predefinedExercises.filter((exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? exercise.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
          className="text-xs"
        >
          All
        </Button>
        {exerciseCategories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="text-xs"
          >
            {category.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-1">
        {filteredExercises.map((exercise, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 border border-border rounded-md hover:bg-secondary/20 cursor-pointer transition-all"
            onClick={() => onSelectExercise(exercise)}
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Dumbbell className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium">{exercise.name}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 p-3 border border-dashed border-border rounded-md hover:bg-secondary/20 cursor-pointer transition-all">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Plus className="h-4 w-4 text-primary" />
        </div>
        <Input
          placeholder="Add custom exercise..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              onSelectExercise({
                name: e.currentTarget.value.trim(),
                category: selectedCategory || "other",
              });
              e.currentTarget.value = "";
            }
          }}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Check, X, Flame, Bell, Edit } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface HabitTrackerProps {
  habit: {
    id: string;
    name: string;
    target: string;
    category: string;
    reminder_time?: string;
    completed: boolean;
    streak: number;
  };
  onToggle: (habitId: string, completed: boolean) => Promise<void>;
}

export default function HabitTracker({ habit, onToggle }: HabitTrackerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(habit.completed);

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      const newState = !isCompleted;
      await onToggle(habit.id, newState);
      setIsCompleted(newState);
    } catch (error) {
      console.error("Error toggling habit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Map category to color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Health":
        return "text-blue-500";
      case "Fitness":
        return "text-green-500";
      case "Mindfulness":
        return "text-purple-500";
      case "Personal Development":
        return "text-yellow-500";
      case "Productivity":
        return "text-orange-500";
      default:
        return "text-primary";
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-all">
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all",
            isCompleted
              ? "bg-primary text-white"
              : "bg-secondary border border-border text-muted-foreground",
          )}
        >
          {isCompleted ? (
            <Check className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
        </button>
        <div>
          <h3
            className={cn(
              "font-medium",
              isCompleted ? "line-through text-muted-foreground" : "",
            )}
          >
            {habit.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {habit.target} • {habit.category}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium">{habit.streak} day streak</span>
        </div>
        <div className="flex gap-2">
          {habit.reminder_time && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Bell className="h-4 w-4" />
              {habit.reminder_time}
            </div>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <a href={`/dashboard/habits/${habit.id}`}>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

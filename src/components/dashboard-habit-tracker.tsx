"use client";

import { useState } from "react";
import { Check, X, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardHabitTrackerProps {
  habit: {
    id: string;
    name: string;
    target: string;
    category: string;
    completed: boolean;
    streak: number;
  };
  onToggle: (habitId: string, completed: boolean) => Promise<void>;
}

export default function DashboardHabitTracker({
  habit,
  onToggle,
}: DashboardHabitTrackerProps) {
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

  return (
    <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary/20 transition-all">
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
            isCompleted
              ? "bg-primary text-white"
              : "bg-secondary border border-border text-muted-foreground",
          )}
        >
          {isCompleted ? (
            <Check className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </button>
        <div>
          <h3
            className={cn(
              "font-medium text-sm",
              isCompleted ? "line-through text-muted-foreground" : "",
            )}
          >
            {habit.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Flame className="h-3 w-3 text-orange-500" />
            <span>{habit.streak} day streak</span>
          </div>
        </div>
      </div>
    </div>
  );
}

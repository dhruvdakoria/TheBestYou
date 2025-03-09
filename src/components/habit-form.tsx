"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Flame, Save, Bell } from "lucide-react";

interface HabitFormProps {
  onSave?: (habit: {
    name: string;
    target: string;
    category: string;
    reminderTime?: string;
  }) => void;
  initialData?: {
    name: string;
    target: string;
    category: string;
    reminderTime?: string;
  };
}

export default function HabitForm({ onSave, initialData }: HabitFormProps) {
  const [habitName, setHabitName] = useState(initialData?.name || "");
  const [habitTarget, setHabitTarget] = useState(initialData?.target || "");
  const [habitCategory, setHabitCategory] = useState(
    initialData?.category || "Health",
  );
  const [reminderTime, setReminderTime] = useState(
    initialData?.reminderTime || "",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        name: habitName,
        target: habitTarget,
        category: habitCategory,
        reminderTime: reminderTime || undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="habitName">Habit Name</Label>
          <Input
            id="habitName"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="e.g., Drink Water"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="habitTarget">Target/Goal</Label>
          <Input
            id="habitTarget"
            value={habitTarget}
            onChange={(e) => setHabitTarget(e.target.value)}
            placeholder="e.g., 8 glasses or 30 minutes"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="habitCategory">Category</Label>
          <select
            id="habitCategory"
            value={habitCategory}
            onChange={(e) => setHabitCategory(e.target.value)}
            className="w-full p-2 rounded-md border border-border bg-background"
            required
          >
            <option value="Health">Health</option>
            <option value="Fitness">Fitness</option>
            <option value="Mindfulness">Mindfulness</option>
            <option value="Personal Development">Personal Development</option>
            <option value="Productivity">Productivity</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reminderTime" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Reminder (Optional)
          </Label>
          <Input
            id="reminderTime"
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            placeholder="Set a daily reminder"
          />
        </div>
      </div>

      <Card className="border border-border bg-secondary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Flame className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Habit Streaks</p>
              <p className="text-xs text-muted-foreground">
                Complete your habit daily to build a streak and track your
                consistency
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full gap-2 bg-primary hover:bg-primary/90"
      >
        <Save className="h-4 w-4" /> Save Habit
      </Button>
    </form>
  );
}

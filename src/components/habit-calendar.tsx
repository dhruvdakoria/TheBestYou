"use client";

import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

interface HabitCalendarProps {
  habitName: string;
  completedDays: number[];
  daysInMonth: number;
  completionRate: number;
  categoryColor: string;
}

export default function HabitCalendar({
  habitName,
  completedDays,
  daysInMonth,
  completionRate,
  categoryColor,
}: HabitCalendarProps) {
  // Generate array of days for the month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Flame className={cn("h-4 w-4", categoryColor)} />
          </div>
          <span className="font-medium">{habitName}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {completionRate}% completion rate
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {days.map((day) => (
          <div
            key={day}
            className={cn(
              "w-7 h-7 rounded-md flex items-center justify-center text-xs",
              completedDays?.includes(day)
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground",
            )}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}

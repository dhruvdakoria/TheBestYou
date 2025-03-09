"use client";

import { Dumbbell } from "lucide-react";
import { useRouter } from "next/navigation";

interface WorkoutTemplateProps {
  id: string;
  name: string;
  exercises: number;
}

export default function WorkoutTemplateCard({
  id,
  name,
  exercises,
}: WorkoutTemplateProps) {
  const router = useRouter();

  return (
    <div
      key={id}
      className="p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-secondary/20 transition-all cursor-pointer"
      onClick={() => {
        router.push(`/dashboard/workouts/new?template=${id}`);
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Dumbbell className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-xs text-muted-foreground">{exercises} exercises</p>
        </div>
      </div>
    </div>
  );
}

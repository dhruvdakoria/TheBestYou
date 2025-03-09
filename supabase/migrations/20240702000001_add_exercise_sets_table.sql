-- Create exercise_sets table
CREATE TABLE IF NOT EXISTS exercise_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  reps TEXT NOT NULL,
  weight TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS exercise_sets_exercise_id_idx ON exercise_sets(exercise_id);

-- Enable RLS
ALTER TABLE exercise_sets ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for exercise_sets
CREATE POLICY "Users can manage their own exercise sets"
ON exercise_sets
FOR ALL
USING (
  exercise_id IN (
    SELECT id FROM exercises WHERE workout_id IN (
      SELECT id FROM workouts WHERE user_id = auth.uid()
    )
  )
);

-- Add publication for realtime
ALTER PUBLICATION supabase_realtime ADD TABLE exercise_sets;

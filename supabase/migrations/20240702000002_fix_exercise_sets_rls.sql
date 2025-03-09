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

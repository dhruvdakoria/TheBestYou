"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Utensils, Plus, Trash2, Save, Camera } from "lucide-react";

interface Food {
  id: string;
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealFormProps {
  onSave?: (meal: { type: string; time: string; foods: Food[] }) => void;
  initialData?: {
    type: string;
    time: string;
    foods: Food[];
  };
}

export default function MealForm({ onSave, initialData }: MealFormProps) {
  const [mealType, setMealType] = useState(initialData?.type || "Breakfast");
  const [mealTime, setMealTime] = useState(initialData?.time || "");
  const [foods, setFoods] = useState<Food[]>(initialData?.foods || []);

  const addFood = () => {
    setFoods([
      ...foods,
      {
        id: Date.now().toString(),
        name: "",
        portion: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    ]);
  };

  const updateFood = (id: string, field: keyof Food, value: any) => {
    setFoods(
      foods.map((food) =>
        food.id === id ? { ...food, [field]: value } : food,
      ),
    );
  };

  const removeFood = (id: string) => {
    setFoods(foods.filter((food) => food.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        type: mealType,
        time: mealTime,
        foods,
      });
    }
  };

  // Calculate total calories and macros
  const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
  const totalProtein = foods.reduce((sum, food) => sum + food.protein, 0);
  const totalCarbs = foods.reduce((sum, food) => sum + food.carbs, 0);
  const totalFat = foods.reduce((sum, food) => sum + food.fat, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mealType">Meal Type</Label>
          <select
            id="mealType"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full p-2 rounded-md border border-border bg-background"
            required
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="mealTime">Time</Label>
          <Input
            id="mealTime"
            value={mealTime}
            onChange={(e) => setMealTime(e.target.value)}
            placeholder="e.g., 7:30 AM"
            required
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Foods</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={addFood}
            variant="outline"
            size="sm"
            className="gap-1"
          >
            <Plus className="h-4 w-4" /> Add Food
          </Button>
          <Button type="button" variant="outline" size="sm" className="gap-1">
            <Camera className="h-4 w-4" /> Scan Food
          </Button>
        </div>
      </div>

      {foods.length === 0 ? (
        <Card className="border border-dashed border-border">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Utensils className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No foods added yet</p>
            <Button
              type="button"
              onClick={addFood}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Add Your First Food
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {foods.map((food) => (
            <Card key={food.id} className="border border-border">
              <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-center">
                  <Label htmlFor={`food-${food.id}-name`}>Food Item</Label>
                  <Button
                    type="button"
                    onClick={() => removeFood(food.id)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Input
                      id={`food-${food.id}-name`}
                      value={food.name}
                      onChange={(e) =>
                        updateFood(food.id, "name", e.target.value)
                      }
                      placeholder="Food name"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      id={`food-${food.id}-portion`}
                      value={food.portion}
                      onChange={(e) =>
                        updateFood(food.id, "portion", e.target.value)
                      }
                      placeholder="Portion (e.g., 1 cup)"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="flex flex-col space-y-1">
                      <Label
                        htmlFor={`food-${food.id}-calories`}
                        className="text-xs"
                      >
                        Calories
                      </Label>
                      <Input
                        id={`food-${food.id}-calories`}
                        type="number"
                        min="0"
                        value={food.calories}
                        onChange={(e) =>
                          updateFood(
                            food.id,
                            "calories",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col space-y-1">
                      <Label
                        htmlFor={`food-${food.id}-protein`}
                        className="text-xs"
                      >
                        Protein (g)
                      </Label>
                      <Input
                        id={`food-${food.id}-protein`}
                        type="number"
                        min="0"
                        value={food.protein}
                        onChange={(e) =>
                          updateFood(
                            food.id,
                            "protein",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col space-y-1">
                      <Label
                        htmlFor={`food-${food.id}-carbs`}
                        className="text-xs"
                      >
                        Carbs (g)
                      </Label>
                      <Input
                        id={`food-${food.id}-carbs`}
                        type="number"
                        min="0"
                        value={food.carbs}
                        onChange={(e) =>
                          updateFood(
                            food.id,
                            "carbs",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col space-y-1">
                      <Label
                        htmlFor={`food-${food.id}-fat`}
                        className="text-xs"
                      >
                        Fat (g)
                      </Label>
                      <Input
                        id={`food-${food.id}-fat`}
                        type="number"
                        min="0"
                        value={food.fat}
                        onChange={(e) =>
                          updateFood(
                            food.id,
                            "fat",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="border border-border bg-secondary/20">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Total Calories
                  </p>
                  <p className="font-bold">{totalCalories}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Protein</p>
                  <p className="font-bold">{totalProtein}g</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Carbs</p>
                  <p className="font-bold">{totalCarbs}g</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Fat</p>
                  <p className="font-bold">{totalFat}g</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Button
        type="submit"
        className="w-full gap-2 bg-primary hover:bg-primary/90"
      >
        <Save className="h-4 w-4" /> Save Meal
      </Button>
    </form>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useIngredients } from "@/app/context/IngredientsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

// Spoonacular API key
const SPOONACULAR_API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

// Dietary Restrictions and Meal Types
const DIETARY_RESTRICTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten Free",
  "Ketogenic",
  "Paleo",
  "Pescetarian",
];

const MEAL_TYPES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Appetizer",
  "Salad",
  "Dessert",
  "Snack",
];

// Define Recipe interface
interface Recipe {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: Array<{ name: string }>;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  ketogenic?: boolean;
  type?: string;
  dishTypes?: Array<String>;
}

export default function RecipesPage() {
  const { selectedIngredients } = useIngredients();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filtering states
  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] =
    useState<string[]>([]);
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);

  // Fetch recipes
  useEffect(() => {
    async function fetchRecipes() {
      if (selectedIngredients.length === 0) return;

      setIsLoading(true);
      try {
        const ingredientsQuery = selectedIngredients.join(",+");
        const response = await fetch(
          `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientsQuery}&number=20&apiKey=${SPOONACULAR_API_KEY}`
        );

        if (!response.ok) throw new Error("Failed to fetch recipes");

        const data: Recipe[] = await response.json();

        // Fetch additional recipe details to get dietary info
        const detailedRecipes = await Promise.all(
          data.map(async (recipe) => {
            const detailResponse = await fetch(
              `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${SPOONACULAR_API_KEY}`
            );
            return detailResponse.json();
          })
        );

        setRecipes(detailedRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecipes();
  }, [selectedIngredients]);

  // Filter recipes based on dietary restrictions and meal types
  const filteredRecipes = recipes.filter((recipe) => {
    // Dietary Restriction Filtering
    const meetsDietaryRestrictions =
      selectedDietaryRestrictions.length === 0 ||
      selectedDietaryRestrictions.every((restriction) => {
        switch (restriction) {
          case "Vegetarian":
            return recipe.vegetarian;
          case "Vegan":
            return recipe.vegan;
          case "Gluten Free":
            return recipe.glutenFree;
          // Add more dietary checks as needed
          default:
            return true;
        }
      });

    // Meal Type Filtering
    const meetsMealTypes =
      selectedMealTypes.length === 0 ||
      selectedMealTypes.some((type) =>
        recipe.dishTypes?.some((dishType) =>
          dishType.toLowerCase().includes(type.toLowerCase())
        )
      );

    return meetsDietaryRestrictions && meetsMealTypes;
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recipe Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Dietary Restrictions:
            </h3>
            <ToggleGroup
              type="multiple"
              variant="outline"
              className="flex flex-wrap gap-2"
            >
              {DIETARY_RESTRICTIONS.map((restriction) => (
                <ToggleGroupItem
                  key={restriction}
                  value={restriction}
                  aria-label={restriction}
                  onClick={() =>
                    setSelectedDietaryRestrictions((prev) =>
                      prev.includes(restriction)
                        ? prev.filter((r) => r !== restriction)
                        : [...prev, restriction]
                    )
                  }
                >
                  {restriction}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Meal Types:</h3>
            <ToggleGroup
              type="multiple"
              variant="outline"
              className="flex flex-wrap gap-2"
            >
              {MEAL_TYPES.map((mealType) => (
                <ToggleGroupItem
                  key={mealType}
                  value={mealType}
                  aria-label={mealType}
                  onClick={() =>
                    setSelectedMealTypes((prev) =>
                      prev.includes(mealType)
                        ? prev.filter((r) => r !== mealType)
                        : [...prev, mealType]
                    )
                  }
                >
                  {mealType}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recipes ({filteredRecipes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <Skeleton className="h-[200px] w-full rounded-md" />
                    <Skeleton className="h-4 w-3/4 mt-4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRecipes.map((recipe) => (
                  <Card key={recipe.id}>
                    <CardContent className="p-4">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                      <h3 className="text-lg font-semibold mb-2">
                        {recipe.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Used Ingredients: {recipe.usedIngredientCount} |
                        Missing: {recipe.missedIngredientCount}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recipe.vegetarian && (
                          <Badge variant="secondary">Vegetarian</Badge>
                        )}
                        {recipe.vegan && (
                          <Badge variant="secondary">Vegan</Badge>
                        )}
                        {recipe.glutenFree && (
                          <Badge variant="secondary">Gluten Free</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

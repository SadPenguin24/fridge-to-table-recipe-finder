"use client";

import React, { useState, useEffect } from "react";
import { useIngredients } from "@/app/context/IngredientsContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

// Spoonacular API key from environment variables
const SPOONACULAR_API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

interface AutocompleteIngredient {
  name: string;
  image: string;
}

export default function IngredientsMultiselect() {
  const [customIngredient, setCustomIngredient] = useState("");
  const [autocompleteResults, setAutocompleteResults] = useState<
    AutocompleteIngredient[]
  >([]);
  const {
    selectedIngredients,
    addIngredient,
    removeIngredient,
    clearIngredients,
  } = useIngredients();

  // Debounce to prevent too many API calls
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchAutocomplete = async () => {
      if (customIngredient.length < 2) {
        setAutocompleteResults([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.spoonacular.com/food/ingredients/autocomplete?query=${customIngredient}&number=5&apiKey=${SPOONACULAR_API_KEY}`
        );

        if (!response.ok)
          throw new Error("Failed to fetch autocomplete results");

        const data: AutocompleteIngredient[] = await response.json();
        setAutocompleteResults(data);
      } catch (error) {
        console.error("Autocomplete error:", error);
        setAutocompleteResults([]);
      }
    };

    // Debounce the API call
    if (customIngredient) {
      timeoutId = setTimeout(fetchAutocomplete, 300);
    } else {
      setAutocompleteResults([]);
    }

    // Cleanup function
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [customIngredient]);

  // Handler for adding an ingredient
  const handleAddIngredient = (ingredientName?: string) => {
    const nameToAdd = ingredientName || customIngredient;

    if (nameToAdd.trim()) {
      // Capitalize the first letter of each word
      const formattedIngredient = nameToAdd
        .trim()
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");

      // Only add if not already in the list
      if (!selectedIngredients.includes(formattedIngredient)) {
        addIngredient(formattedIngredient);
        setCustomIngredient("");
        setAutocompleteResults([]);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add Your Ingredients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Ingredient Input with Autocomplete */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter an ingredient"
              value={customIngredient}
              onChange={(e) => setCustomIngredient(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddIngredient()}
              className="pr-20"
            />

            <Button
              onClick={() => handleAddIngredient()}
              className="absolute right-0 top-0 rounded-l-none"
            >
              Add
            </Button>

            {/* Autocomplete Suggestions */}
            {autocompleteResults.length > 0 && (
              <Card className="absolute top-full left-0 w-full mt-1 z-10">
                <ScrollArea className="h-[200px]">
                  {autocompleteResults.map((ingredient) => (
                    <Button
                      key={ingredient.name}
                      variant="ghost"
                      onClick={() => handleAddIngredient(ingredient.name)}
                      className="w-full justify-start"
                    >
                      <img
                        src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`}
                        alt={ingredient.name}
                        className="w-8 h-8 mr-2 rounded-full"
                      />
                      {ingredient.name}
                    </Button>
                  ))}
                </ScrollArea>
              </Card>
            )}
          </div>

          {/* Selected Ingredients */}
          {selectedIngredients.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  Your Ingredients ({selectedIngredients.length}):
                </h3>
                <Button
                  onClick={clearIngredients}
                  variant="destructive"
                  size="sm"
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedIngredients.map((ingredient) => (
                  <Badge
                    key={ingredient}
                    variant="secondary"
                    className="text-sm"
                  >
                    {ingredient}
                    <Button
                      onClick={() => removeIngredient(ingredient)}
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

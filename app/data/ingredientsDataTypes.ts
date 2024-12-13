// Common ingredients list for multi-select
export const COMMON_INGREDIENTS = [
  "Chicken",
  "Beef",
  "Pork",
  "Fish",
  "Eggs",
  "Milk",
  "Cheese",
  "Tomatoes",
  "Onions",
  "Garlic",
  "Peppers",
  "Rice",
  "Pasta",
  "Bread",
  "Potatoes",
  "Carrots",
  "Broccoli",
  "Spinach",
  "Olive Oil",
  "Salt",
  "Pepper",
  "Flour",
  "Sugar",
  "Butter",
  "Cream",
];

// Recipe type for type safety
export interface Recipe {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: Array<{ name: string }>;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;

  // Optional properties for dish types
  dishTypes?: Array<string>;
}

// API response type
export interface RecipeSearchResponse {
  results: Recipe[];
}

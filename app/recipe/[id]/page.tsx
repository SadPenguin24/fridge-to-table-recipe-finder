'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

// Spoonacular API key (replace with your actual key)
const SPOONACULAR_API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

interface RecipeDetails {
  id: number;
  title: string;
  image: string;
  instructions: string;
  extendedIngredients: Array<{name: string, amount: number, unit: string}>;
}

export default function RecipeDetailPage() {
  const params = useParams();
  const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipeDetails() {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/${params.id}/information?apiKey=${SPOONACULAR_API_KEY}`
        );

        if (!response.ok) throw new Error('Failed to fetch recipe details');

        const data: RecipeDetails = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchRecipeDetails();
    }
  }, [params.id]);

  if (isLoading) return <div>Loading recipe details...</div>;
  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div>
      <h1>{recipe.title}</h1>
      <img
        src={recipe.image}
        alt={recipe.title}
        width={400}
        height={400}
      />
      <h2>Ingredients:</h2>
      <ul>
        {recipe.extendedIngredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.name} - {ingredient.amount} {ingredient.unit}
          </li>
        ))}
      </ul>
      <h2>Instructions:</h2>
      <div>{recipe.instructions}</div>
    </div>
  );
}

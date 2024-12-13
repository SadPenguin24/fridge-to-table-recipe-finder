"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// Define types for the context
interface IngredientsContextType {
  selectedIngredients: string[];
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;
}

// Create the context with a default value
const IngredientsContext = createContext<IngredientsContextType>({
  selectedIngredients: [],
  addIngredient: () => {},
  removeIngredient: () => {},
  clearIngredients: () => {},
});

// Provider component
export const IngredientsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const addIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients((prev) => [...prev, ingredient]);
    }
  };

  const removeIngredient = (ingredient: string) => {
    setSelectedIngredients((prev) =>
      prev.filter((item) => item !== ingredient)
    );
  };

  const clearIngredients = () => {
    setSelectedIngredients([]);
  };

  return (
    <IngredientsContext.Provider
      value={{
        selectedIngredients,
        addIngredient,
        removeIngredient,
        clearIngredients,
      }}
    >
      {children}
    </IngredientsContext.Provider>
  );
};

// Custom hook to use the context
export const useIngredients = () => useContext(IngredientsContext);

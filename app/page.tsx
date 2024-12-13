import Image from "next/image";
import IngredientsMultiselect from "./components/MultiSelectIngredients";
import ListRecipe from "./components/ListRecipes";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
    <main>
      <h1>Fridge-to-Table Recipe Finder</h1>
      <IngredientsMultiselect />
      <ListRecipe />
    </main>
  );
}

import { Ingredients } from "../enum/ingredients.enum";
import { PizzaServiceError } from "../error/pizza.exceptions";
import { PizzaDTO } from "../model/pizzaDTO";

export class PizzaService {
  constructor(
    private readonly ingredients = new Map<Ingredients, number>(),
    private readonly pizzaList = new Set<PizzaDTO>()
  ) {}
  addIngredient(ingredient: Ingredients, amount = 1): void {
    if (this.ingredients.has(ingredient)) {
      const oldAmount = this.ingredients.get(ingredient) || 0;
      this.ingredients.set(ingredient, oldAmount + amount);
      return;
    }
    this.ingredients.set(ingredient, amount);
  }
  addPizza(pizza: PizzaDTO): void {
    this.pizzaList.add(pizza);
  }
  delatePizza(pizza: PizzaDTO): void {
    this.pizzaList.delete(pizza);
  }

  updateIngredientsAfterOrder(pizzas: PizzaDTO[]): void {
    const orderIngredentsMap = this.getIngredientsMapOfOrder(pizzas);
    const reservedIngredients = new Map<Ingredients, number>();
    for (let [ingredient, amount] of orderIngredentsMap) {
      const currentAmount = this.ingredients.get(ingredient) || 0;

      if (currentAmount >= amount) {
        this.ingredients.set(ingredient, currentAmount - amount);
        reservedIngredients.set(ingredient, amount);
      } else {
        for (let [ingredient, amount] of reservedIngredients) {
          const currentAmount = this.ingredients.get(ingredient) || 0;
          this.ingredients.set(ingredient, currentAmount + amount);
        }
        throw new PizzaServiceError({
          name: "INGREDIENT_ERROR",
          message: "Insufficient amount of ingredients",
        });
      }
    }
  }
  private getIngredientsMapOfOrder(
    pizzas: PizzaDTO[]
  ): Map<Ingredients, number> {
    const allPizzasIngredientsMap = pizzas.reduce((accumulator, pizza) => {
      for (const ingredient of pizza.ingredients) {
        accumulator.set(ingredient, (accumulator.get(ingredient) || 0) + 1);
      }
      return accumulator;
    }, new Map<Ingredients, number>());
    return allPizzasIngredientsMap;
  }
}

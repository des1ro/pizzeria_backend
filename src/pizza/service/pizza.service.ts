import { PizzeriaError } from "../../exceptions/pizzeria.exceptions";
import { Ingredients } from "../enum/ingredients.enum";
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
  delatePizza(pizzaName: string): void {
    const pizza = this.findPizzaByName(pizzaName);
    this.pizzaList.delete(pizza);
  }
  getIngredientsMapOfOrder(pizzaNames: string[]) {
    const map = new Map(this.ingredients);
    for (const pizzaName of pizzaNames) {
      const pizza = this.findPizzaByName(pizzaName);
      if (pizza) {
        for (const ingredient of pizza.ingredients) {
          const value = map.get(ingredient);
          if (value === undefined || value <= 0) {
            throw new PizzeriaError({
              name: "PIZZA_SERVICE_ERROR",
              message: "Insufficient amount of ingredients",
            });
          }
          map.set(ingredient, value - 1);
        }
      }
    }
    return map;
  }
  updateIngredientsAfterOrder(map: Map<Ingredients, number>): void {
    this.ingredients.clear();
    map.forEach((value, key) => {
      this.ingredients.set(key, value);
    });
  }
  getPizzaFromNames(pizzaNames: string[]): PizzaDTO[] {
    const pizzas: PizzaDTO[] = [];
    pizzaNames.forEach((pizzaName) => {
      const pizza = this.findPizzaByName(pizzaName);
      pizzas.push(pizza);
    });
    return pizzas;
  }
  private findPizzaByName(pizzaName: string): PizzaDTO {
    const pizza = Array.from(this.pizzaList).find(
      (pizza) => pizza.name === pizzaName
    );
    if (pizza) {
      return pizza;
    }
    throw new PizzeriaError({
      name: "PIZZA_SERVICE_ERROR",
      message: "Pizza isn't on the list",
    });
  }
}

import { Ingredients } from "../enum/ingredients.enum";

export class PizzaDTO {
  constructor(
    readonly name: string,
    readonly price: number,
    readonly ingredients: Ingredients[]
  ) {}
}

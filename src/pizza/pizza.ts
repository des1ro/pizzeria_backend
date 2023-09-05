import { Ingredients } from "./ingredients.enum";

export class Pizza {
  constructor(
    readonly name: string,
    readonly value: number,
    readonly ingredients: Ingredients[]
  ) {}
}

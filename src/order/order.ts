import { Ingredients } from "../pizza/ingredients.enum";
import { Pizza } from "../pizza/pizza";

export class OrderDTO {
  constructor(
    readonly id: number,
    readonly discount: Discount,
    readonly products: Pizza[],
    readonly tableId?: number
  ) {}
}
const pizza = new Pizza("anal", 20, [Ingredients.cheese]);
const order = new OrderDTO(1, Discount.codeDiscountOne, [pizza]);

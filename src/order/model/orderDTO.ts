import { Discount } from "../../discounts/discount.enum";
import { PizzaDTO } from "../../pizza/model/pizzaDTO";

export class OrderDTO {
  constructor(
    readonly uuid: string,
    readonly discount: Discount,
    readonly products: PizzaDTO[],
    readonly tableId?: number
  ) {}
}

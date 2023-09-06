import { PizzaDTO } from "../../pizza/model/pizzaDTO";

export class OrderDTO {
  constructor(
    readonly id: number,
    readonly discount: Discount,
    readonly products: PizzaDTO[],
    readonly tableId?: number
  ) {}
}

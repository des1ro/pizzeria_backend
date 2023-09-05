import { PizzeriaError } from "../exceptions/pizzeria.exceptions";
import { OrderDTO } from "./order";

export class OrderService {
  constructor(
    private readonly completedOrders = new Set<OrderDTO>(),
    private readonly orderQueque = new Set<OrderDTO>(),
    private readonly orderInProgress = new Set<OrderDTO>()
  ) {}
  makeOrder() {
    //TODO
  }
  addOrderToQueque(order: OrderDTO) {
    if (this.orderQueque.has(order)) {
      throw new PizzeriaError({
        name: "ORDER_ERROR",
        message: "Order is already in queque",
      });
    }
    this.orderQueque.add(order);
  }
  makeOrderInProgress(order: OrderDTO) {
    if (this.orderQueque.delete(order)) {
      this.orderInProgress.add(order);
      return;
    }
    throw new PizzeriaError({
      name: "ORDER_ERROR",
      message: "There is no such as order in queque",
    });
  }
  compleateOrder(order: OrderDTO) {
    if (this.orderInProgress.delete(order)) {
      this.completedOrders.add(order);
      return;
    }
    throw new PizzeriaError({
      name: "ORDER_ERROR",
      message: "There is no order in order in progress",
    });
  }
  getCompletedOrders() {
    return this.completedOrders;
  }
}

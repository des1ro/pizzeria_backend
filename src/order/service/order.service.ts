import { EmployeeDTO } from "../../employee/model/employeeDTO";
import { PizzeriaError } from "../../exceptions/pizzeria.exceptions";
import { OrderDTO } from "../model/orderDTO";

export class OrderService {
  constructor(
    private readonly completedOrders = new Set<OrderDTO>(),
    private readonly orderQueque = new Set<OrderDTO>(),
    private readonly orderInProgress = new Map<OrderDTO, EmployeeDTO>()
  ) {}

  addOrderToQueque(order: OrderDTO): void {
    if (this.orderQueque.has(order)) {
      throw new PizzeriaError({
        name: "ORDER_ERROR",
        message: "Order is already in queque",
      });
    }
    this.orderQueque.add(order);
  }
  makeOrderInProgress(order: OrderDTO, cheff: EmployeeDTO) {
    if (this.orderQueque.delete(order)) {
      this.orderInProgress.set(order, cheff);
      return;
    }
    throw new PizzeriaError({
      name: "ORDER_ERROR",
      message: "There is no such as order in queque",
    });
  }
  completeOrderAndReturnCheff(order: OrderDTO): EmployeeDTO {
    const cheff = this.orderInProgress.get(order);
    if (this.orderInProgress.delete(order) && cheff) {
      this.completedOrders.add(order);
      return cheff;
    }
    throw new PizzeriaError({
      name: "ORDER_ERROR",
      message: "There is no order in order in progress",
    });
  }
  getCompletedOrders() {
    return this.completedOrders;
  }
  getOrderId(): number {
    return (
      this.orderInProgress.size +
      this.orderQueque.size +
      this.completedOrders.size +
      1
    );
  }
}
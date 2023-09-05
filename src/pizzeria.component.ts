import { ReservationService } from "./reservation/reservation.service";
import { OrderService } from "./order/order.service";
import { EmployeeService } from "./employee/employee.service";

export class Pizzeria {
  constructor(
    private readonly ingredients = new Map<string, number>(),
    private readonly revservationService = new ReservationService(),
    private readonly orderService = new OrderService(),
    private readonly employeeService = new EmployeeService()
  ) {}
  addIngredient(ingredient: string, amount = 1) {
    if (this.ingredients.has(ingredient)) {
      const oldAmount = this.ingredients.get(ingredient) || 0;
      this.ingredients.set(ingredient, oldAmount + amount);
      return;
    }
    this.ingredients.set(ingredient, amount);
  }
  orderTakeaway() {
    //TODO
  }
  makeReservation() {
    //TODO
  }
  getCompletedOrders() {
    return this.orderService.getCompletedOrders();
  }
}

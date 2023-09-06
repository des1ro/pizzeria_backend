import { ReservationService } from "../reservation/service/reservation.service";
import { OrderService } from "../order/service/order.service";
import { EmployeeService } from "../employee/service/employee.service";
import { OrderDTO } from "../order/model/orderDTO";
import { PizzaService } from "../pizza/service/pizza.service";

export class Pizzeria {
  constructor(
    private readonly revservationService = new ReservationService(),
    private readonly orderService = new OrderService(),
    private readonly employeeService = new EmployeeService(),
    private readonly pizzaService = new PizzaService()
  ) {}
  orderTakeaway(pizzaNames: string[], discount = Discount.none): void {
    const properties = this.getOrderProperties(pizzaNames);
    const order = new OrderDTO(properties.orderId, discount, properties.pizzas);
    this.orderService.addOrderToQueque(order);
  }
  orderInRestaurant(
    pizzaNames: string[],
    discount = Discount.none,
    seats: number
  ): void {
    const table = this.revservationService.getATable(seats);
    const properties = this.getOrderProperties(pizzaNames);
    this.revservationService.bookATable(table);
    const order = new OrderDTO(
      properties.orderId,
      discount,
      properties.pizzas,
      table.tableId
    );
    this.orderService.addOrderToQueque(order);
  }
  makeOrderInProgress(order: OrderDTO) {
    const cheff = this.employeeService.getCheffToOrder();
    this.orderService.makeOrderInProgress(order, cheff);
  }
  completeOrder(order: OrderDTO): void {
    const cheff = this.orderService.completeOrderAndReturnCheff(order);
    this.employeeService.relievedCheff(cheff);
  }
  setTableToAvailable(order: OrderDTO) {
    const tableId = order.tableId;
    this.revservationService.setTableToAvailable(tableId);
  }
  getCompletedOrders() {
    return this.orderService.getCompletedOrders();
  }
  private getOrderProperties(pizzaNames: string[]) {
    const orderId = this.orderService.getOrderId();
    const pizzas = this.pizzaService.getPizzaFromNames(pizzaNames);
    const ingredientsMap =
      this.pizzaService.getIngredientsMapOfOrder(pizzaNames);
    this.pizzaService.updateIngredientsAfterOrder(ingredientsMap);
    return { orderId, pizzas };
  }
}

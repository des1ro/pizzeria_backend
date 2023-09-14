import { ReservationService } from "../reservation/service/reservation.service";
import { OrderService } from "../order/service/order.service";
import { EmployeeService } from "../employee/service/employee.service";
import { OrderDTO } from "../order/model/orderDTO";
import { PizzaService } from "../pizza/service/pizza.service";
import { Discount } from "../discounts/discount.enum";
import { PizzaDTO } from "../pizza/model/pizzaDTO";

export class Pizzeria {
  constructor(
    private readonly revservationService = new ReservationService(),
    private readonly orderService = new OrderService(),
    private readonly employeeService = new EmployeeService(),
    private readonly pizzaService = new PizzaService()
  ) {}
  orderTakeawayAndGetRecipe(
    pizzaNames: string[],
    discount = Discount.none
  ): number {
    const properties = this.getOrderProperties(pizzaNames);
    const order = new OrderDTO(properties.orderId, discount, properties.pizzas);
    this.addOrderToRightQueque(order);
    return this.orderService.getOrderPrice(order);
  }
  orderInRestaurant(
    pizzaNames: string[],
    seats: number,
    discount = Discount.none
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
    this.addOrderToRightQueque(order);
  }
  makeOrderInProgress(order: OrderDTO) {
    const cheff = this.employeeService.getCheffToOrder();
    this.orderService.makeOrderInProgress(order, cheff);
  }
  completeOrderAndGetRecipe(order: OrderDTO): number {
    const cheff = this.orderService.completeOrderAndReturnCheff(order);
    this.employeeService.relievedCheff(cheff);
    return this.orderService.getOrderPrice(order);
  }
  setTableToAvailable(order: OrderDTO) {
    const tableId = order.tableId;
    this.revservationService.setTableToAvailable(tableId);
  }
  getCompletedOrdersArray(): OrderDTO[] {
    return this.orderService.getCompletedOrdersArray();
  }
  addCheffToCrew(name: string) {
    this.employeeService.addCheffToCrew(name);
  }
  private getOrderProperties(pizzaNames: string[]): {
    orderId: number;
    pizzas: PizzaDTO[];
  } {
    const orderId = this.orderService.getOrderId();
    const pizzas = this.pizzaService.getPizzaFromNames(pizzaNames);
    const ingredientsMap =
      this.pizzaService.getIngredientsMapOfOrder(pizzaNames);
    this.pizzaService.updateIngredientsAfterOrder(ingredientsMap);
    return { orderId, pizzas };
  }
  private addOrderToRightQueque(order: OrderDTO) {
    if (this.employeeService.isCheffAvailable()) {
      this.makeOrderInProgress(order);
      return;
    }
    this.orderService.addOrderToQueque(order);
  }
}

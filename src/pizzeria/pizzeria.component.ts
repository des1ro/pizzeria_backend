import { ReservationService } from "../reservation/service/reservation.service";
import { OrderService } from "../order/service/order.service";
import { EmployeeService } from "../employee/service/employee.service";
import { OrderDTO } from "../order/model/orderDTO";
import { PizzaService } from "../pizza/service/pizza.service";
import { Discount } from "../discounts/discount.enum";
import { PizzaDTO } from "../pizza/model/pizzaDTO";
import { randomUUID } from "crypto";

export class Pizzeria {
  constructor(
    private readonly revservationService = new ReservationService(),
    private readonly orderService = new OrderService(),
    private readonly employeeService = new EmployeeService(),
    private readonly pizzaService = new PizzaService()
  ) {}
  orderTakeawayAndGetRecipe(
    pizzas: PizzaDTO[],
    discount = Discount.NONE
  ): number {
    const uuid = this.getOrderUuidAndPrepareIngredients(pizzas);
    const order = new OrderDTO(uuid, discount, pizzas);
    this.addOrderToRightQueque(order);
    return this.orderService.getOrderPrice(order);
  }
  orderInRestaurant(
    pizzas: PizzaDTO[],
    seats: number,
    discount = Discount.NONE
  ): void {
    const table = this.revservationService.getATable(seats);
    const uuid = this.getOrderUuidAndPrepareIngredients(pizzas);
    this.revservationService.bookATable(table);
    const order = new OrderDTO(uuid, discount, pizzas, table.tableId);
    this.addOrderToRightQueque(order);
  }
  makeOrderInProgress(order: OrderDTO): void {
    const cheff = this.employeeService.getCheffToOrder();
    this.orderService.makeOrderInProgress(order, cheff);
  }
  completeOrderAndGetRecipe(order: OrderDTO): number {
    const cheff = this.orderService.completeOrderAndReturnCheff(order);
    this.employeeService.relievedCheff(cheff);
    return this.orderService.getOrderPrice(order);
  }
  setTableToAvailable(order: OrderDTO): void {
    const tableId = order.tableId;
    this.revservationService.setTableToAvailable(tableId);
  }
  getCompletedOrdersArray(): OrderDTO[] {
    return this.orderService.getCompletedOrdersArray();
  }
  addCheffToCrew(name: string) {
    this.employeeService.addCheffToCrew(name);
  }
  private getOrderUuidAndPrepareIngredients(pizzas: PizzaDTO[]): string {
    const orderUuid = randomUUID();
    this.pizzaService.updateIngredientsAfterOrder(pizzas);
    return orderUuid;
  }
  private addOrderToRightQueque(order: OrderDTO) {
    if (this.employeeService.isCheffAvailable()) {
      this.makeOrderInProgress(order);
      return;
    }
    this.orderService.addOrderToQueque(order);
  }
}

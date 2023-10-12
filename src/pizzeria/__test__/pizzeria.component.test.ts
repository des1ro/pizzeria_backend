import { Discount } from "../../discounts/discount.enum";
import { EmployeeRole } from "../../employee/enum/employee.enum";
import { EmployeeDTO } from "../../employee/model/employeeDTO";
import { EmployeeService } from "../../employee/service/employee.service";
import { OrderDTO } from "../../order/model/orderDTO";
import { OrderService } from "../../order/service/order.service";
import { PizzaDTO } from "../../pizza/model/pizzaDTO";
import { PizzaService } from "../../pizza/service/pizza.service";
import { ReservationService } from "../../reservation/service/reservation.service";
import { DinnerTableDTO } from "../../reservation/table/dinnerTableDTO";
import { Pizzeria } from "../pizzeria.component";
jest.mock("../../employee/service/employee.service", () => {
  return {
    EmployeeService: jest.fn().mockImplementation(() => {
      return {
        addCheffToCrew: jest.fn(),
        getCheffToOrder: jest.fn(),
        isCheffAvailable: jest.fn(),
        relievedCheff: jest.fn(),
      };
    }),
  };
});
jest.mock("../../pizza/service/pizza.service", () => {
  return {
    PizzaService: jest.fn().mockImplementation(() => {
      return {
        addIngredient: jest.fn(),
        updateIngredientsAfterOrder: jest.fn(),
        getPizzaFromNames: jest.fn(),
      };
    }),
  };
});
jest.mock("../../order/service/order.service", () => {
  return {
    OrderService: jest.fn().mockImplementation(() => {
      return {
        addOrderToQueque: jest.fn(),
        makeOrderInProgress: jest.fn(),
        completeOrderAndReturnCheff: jest.fn(),
        getOrderPrice: jest.fn(),
        getCompletedOrdersArray: jest.fn(),
      };
    }),
  };
});
jest.mock("../../reservation/service/reservation.service", () => {
  return {
    ReservationService: jest.fn().mockImplementation(() => {
      return {
        getATable: jest.fn(),
        bookATable: jest.fn(),
        setTableToAvailable: jest.fn(),
      };
    }),
  };
});
describe("Pizzeria component test suite", () => {
  let objectUnderTest: Pizzeria;
  let mockedPizza: PizzaDTO;
  let mockedCheff: EmployeeDTO;
  const mockedReservationService = new ReservationService();
  const mockedOrderService = new OrderService();
  const mockedEmploeeService = new EmployeeService();
  const mockedPizzaService = new PizzaService();
  beforeEach(() => {
    objectUnderTest = new Pizzeria(
      mockedReservationService,
      mockedOrderService,
      mockedEmploeeService,
      mockedPizzaService
    );
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  beforeAll(() => {
    mockedCheff = new EmployeeDTO("test cheff", EmployeeRole.Cheff);
    mockedPizza = new PizzaDTO("test pizza", 20, []);
  });
  describe("Order test suite", () => {
    afterAll(() => {
      jest.resetAllMocks();
    });
    it("Should make order and add to queque if cheff isn't avaliable ", () => {
      //Given
      jest
        .spyOn(mockedEmploeeService, "isCheffAvailable")
        .mockReturnValueOnce(false);
      jest
        .spyOn(mockedOrderService, "getOrderPrice")
        .mockReturnValueOnce(mockedPizza.price);
      //When
      const result = objectUnderTest.orderTakeawayAndGetRecipe([mockedPizza]);
      //Then
      expect(mockedPizzaService.updateIngredientsAfterOrder).toBeCalledTimes(1);
      expect(mockedEmploeeService.isCheffAvailable).toBeCalledTimes(1);
      expect(mockedOrderService.makeOrderInProgress).toBeCalledTimes(0);
      expect(mockedOrderService.addOrderToQueque).toBeCalledTimes(1);
      expect(result).toBe(mockedPizza.price);
    });
    it("Should use properies to make order and add to order in progress if cheff is avaliable ", () => {
      //Given
      jest
        .spyOn(mockedEmploeeService, "getCheffToOrder")
        .mockReturnValueOnce(mockedCheff);
      jest
        .spyOn(mockedEmploeeService, "isCheffAvailable")
        .mockReturnValueOnce(true);
      jest
        .spyOn(mockedOrderService, "getOrderPrice")
        .mockReturnValueOnce(mockedPizza.price);
      //When
      const result = objectUnderTest.orderTakeawayAndGetRecipe([mockedPizza]);
      //Then;
      expect(mockedPizzaService.updateIngredientsAfterOrder).toBeCalledTimes(1);
      expect(mockedEmploeeService.isCheffAvailable).toBeCalledTimes(1);
      expect(mockedOrderService.makeOrderInProgress).toBeCalledTimes(1);
      expect(mockedOrderService.addOrderToQueque).toBeCalledTimes(0);
      expect(result).toBe(mockedPizza.price);
    });
    it("Should book a table, make order and add to queque if there isn't cheff", () => {
      //Given
      const mockedTable = new DinnerTableDTO(1, 2);
      const mockedSeats = 2;
      jest
        .spyOn(mockedReservationService, "getATable")
        .mockReturnValueOnce(mockedTable);
      jest
        .spyOn(mockedEmploeeService, "getCheffToOrder")
        .mockReturnValueOnce(mockedCheff);
      jest
        .spyOn(mockedEmploeeService, "isCheffAvailable")
        .mockReturnValueOnce(false);
      jest
        .spyOn(mockedOrderService, "getOrderPrice")
        .mockReturnValueOnce(mockedPizza.price);
      //When
      objectUnderTest.orderInRestaurant([mockedPizza], mockedSeats);
      //Then
      expect(mockedPizzaService.updateIngredientsAfterOrder).toBeCalledTimes(1);
      expect(mockedEmploeeService.isCheffAvailable).toBeCalledTimes(1);
      expect(mockedOrderService.makeOrderInProgress).toBeCalledTimes(0);
      expect(mockedOrderService.addOrderToQueque).toBeCalledTimes(1);
    });
    it("Should book a table, make order and add make in progress if there is free cheff", () => {
      const mockedTable = new DinnerTableDTO(1, 2);
      const mockedSeats = 2;
      jest
        .spyOn(mockedReservationService, "getATable")
        .mockReturnValueOnce(mockedTable);
      jest
        .spyOn(mockedEmploeeService, "getCheffToOrder")
        .mockReturnValueOnce(mockedCheff);
      jest
        .spyOn(mockedEmploeeService, "isCheffAvailable")
        .mockReturnValueOnce(true);
      jest
        .spyOn(mockedOrderService, "getOrderPrice")
        .mockReturnValueOnce(mockedPizza.price);
      //When
      objectUnderTest.orderInRestaurant([mockedPizza], mockedSeats);
      //Then
      expect(mockedPizzaService.updateIngredientsAfterOrder).toBeCalledTimes(1);
      expect(mockedEmploeeService.isCheffAvailable).toBeCalledTimes(1);
      expect(mockedOrderService.makeOrderInProgress).toBeCalledTimes(1);
      expect(mockedOrderService.addOrderToQueque).toBeCalledTimes(0);
    });
  });
  it("Should make order in progress", () => {
    //Given
    const mockedOrder = new OrderDTO("test uuid", Discount.NONE, [mockedPizza]);
    jest
      .spyOn(mockedEmploeeService, "getCheffToOrder")
      .mockReturnValue(mockedCheff);
    //When
    objectUnderTest.makeOrderInProgress(mockedOrder);
    //Then
    expect(mockedOrderService.makeOrderInProgress).toBeCalledWith(
      mockedOrder,
      mockedCheff
    );
  });
  it("Should complete order and return recipe", () => {
    //Given
    const mockedOrder = new OrderDTO("test uuid", Discount.NONE, [mockedPizza]);
    jest
      .spyOn(mockedOrderService, "completeOrderAndReturnCheff")
      .mockReturnValueOnce(mockedCheff);
    jest
      .spyOn(mockedOrderService, "getOrderPrice")
      .mockReturnValue(mockedPizza.price);
    //When
    const result = objectUnderTest.completeOrderAndGetRecipe(mockedOrder);
    //Then
    expect(mockedEmploeeService.relievedCheff).toBeCalledTimes(1);
    expect(result).toBe(mockedPizza.price);
  });
  it("Should set table to be available", () => {
    //Given
    const mockedOrder = new OrderDTO(
      "test uuid",
      Discount.NONE,
      [mockedPizza],
      42
    );
    //When
    objectUnderTest.setTableToAvailable(mockedOrder);
    //Then
    expect(mockedReservationService.setTableToAvailable).toBeCalledWith(
      mockedOrder.tableId
    );
  });
  it("Should return completed orders Array", () => {
    //Given
    const mockedOrderDTOArray: OrderDTO[] = [];
    jest
      .spyOn(mockedOrderService, "getCompletedOrdersArray")
      .mockReturnValueOnce(mockedOrderDTOArray);
    //When
    const result = objectUnderTest.getCompletedOrdersArray();
    //Then
    expect(result).toBeInstanceOf(Array);
    expect(mockedOrderService.getCompletedOrdersArray).toBeCalledTimes(1);
  });
  it("Should add cheff to crew", () => {
    //Given
    const mockedName = "test name";
    //When
    objectUnderTest.addCheffToCrew(mockedName);
    //Then
    expect(mockedEmploeeService.addCheffToCrew).toBeCalledWith(mockedName);
  });
});

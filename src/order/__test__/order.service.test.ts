import { Discount } from "../../discounts/discount.enum";
import { EmployeeRole } from "../../employee/enum/employee.enum";
import { EmployeeDTO } from "../../employee/model/employeeDTO";
import { PizzaDTO } from "../../pizza/model/pizzaDTO";
import { OrderServiceError } from "../error/order.exceptions";
import { OrderDTO } from "../model/orderDTO";
import { OrderService } from "../service/order.service";
jest.mock("crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("test-uuid"),
}));
describe("Order service test suite", () => {
  let objectUnderTest: OrderService;
  let mockedOrderOne: OrderDTO;
  let mockedPizzas: PizzaDTO[];
  let mockedCheff: EmployeeDTO;
  beforeEach(() => {
    objectUnderTest = new OrderService();
  });
  beforeAll(() => {
    const mockedPizzaOne = new PizzaDTO("test pizza one", 20, []);
    const mockedPizzaTwo = new PizzaDTO("test pizza two", 50, []);
    mockedCheff = new EmployeeDTO("test employee", EmployeeRole.Cheff);
    mockedPizzas = [mockedPizzaOne, mockedPizzaTwo];
    mockedOrderOne = new OrderDTO("1", Discount.none, mockedPizzas);
  });
  it("Should add order to queque", () => {
    //When
    objectUnderTest.addOrderToQueque(mockedOrderOne);
    //Then
    expect(objectUnderTest).toMatchSnapshot();
  });
  it("Should throw OrderServiceError if order it's already in queque", () => {
    //When
    objectUnderTest.addOrderToQueque(mockedOrderOne);
    //Then
    expect(() => objectUnderTest.addOrderToQueque(mockedOrderOne)).toThrow(
      OrderServiceError
    );
  });
  describe("Make order in progress test suite", () => {
    it("Should add order to make in progress", () => {
      //When
      objectUnderTest.addOrderToQueque(mockedOrderOne);
      objectUnderTest.makeOrderInProgress(mockedOrderOne, mockedCheff);
      //Then
      expect(objectUnderTest).toMatchSnapshot();
    });
    it("Should throw OrderServiceError if order isn't in queque ", () => {
      //Then
      expect(() =>
        objectUnderTest.makeOrderInProgress(mockedOrderOne, mockedCheff)
      ).toThrow(OrderServiceError);
    });
  });
  describe("Complete order test suite", () => {
    it("Should complete order and return cheff", () => {
      //Given
      objectUnderTest.addOrderToQueque(mockedOrderOne);
      objectUnderTest.makeOrderInProgress(mockedOrderOne, mockedCheff);
      //When
      const result =
        objectUnderTest.completeOrderAndReturnCheff(mockedOrderOne);
      //Then
      expect(objectUnderTest).toMatchSnapshot();
      expect(result).toBe(mockedCheff);
    });
    it("Should throw OrderServiceError if order wasn't in order in progress", () => {
      //Then
      expect(objectUnderTest).toMatchSnapshot();
      expect(() =>
        objectUnderTest.completeOrderAndReturnCheff(mockedOrderOne)
      ).toThrow(OrderServiceError);
    });
  });
  it("Should count order price and return value", () => {
    //Given
    const mockedOrderTwo = new OrderDTO(
      "2",
      Discount.wednesdayForKidsDiscount,
      mockedPizzas
    );
    const expectedResultTwo = (20 + 50) * 0.9;
    //When
    const resultOne = objectUnderTest.getOrderPrice(mockedOrderOne);
    const expectedResultOne = 20 + 50;
    const resultTwo = objectUnderTest.getOrderPrice(mockedOrderTwo);
    //Then
    expect(resultOne).toBe(expectedResultOne);
    expect(resultTwo).toBe(expectedResultTwo);
  });
  it("Should get array of completed orders", () => {
    //Given
    const mockedOrderTwo = new OrderDTO(
      "2",
      Discount.studentThursdayDiscount,
      []
    );
    const mockedCompletedOrders = new Set<OrderDTO>();
    mockedCompletedOrders.add(mockedOrderOne).add(mockedOrderTwo);
    //When
    objectUnderTest = new OrderService(mockedCompletedOrders);
    const resutlt = objectUnderTest.getCompletedOrdersArray();
    //Then
    expect(objectUnderTest).toMatchSnapshot();
    expect(resutlt).toBeInstanceOf(Array);
    expect(resutlt.length).toBe(2);
  });
});

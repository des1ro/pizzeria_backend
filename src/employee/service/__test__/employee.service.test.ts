import { PizzeriaError } from "../../../exceptions/pizzeria.exceptions";
import { EmployeeRole } from "../../enum/employee.enum";
import { EmployeeDTO } from "../../model/employeeDTO";
import { EmployeeService } from "../employee.service";

describe("Employee service test suite", () => {
  let objectUnderTest: EmployeeService;
  let mockedEmployeeNameOne: string;
  let mockedEmployeeNameTwo: string;
  let mockedEmployeeNameThree: string;
  beforeAll(() => {
    mockedEmployeeNameOne = "test employee one";
    mockedEmployeeNameTwo = "test employee two";
    mockedEmployeeNameThree = "test employee three";
  });
  beforeEach(() => {
    objectUnderTest = new EmployeeService();
  });
  it("Should add cheff to crew", () => {
    //When
    objectUnderTest.addCheffToCrew(mockedEmployeeNameOne);
    //Then
    expect(objectUnderTest).toMatchSnapshot();
  });
  it("Should return which is firs on the list", () => {
    //Given
    objectUnderTest.addCheffToCrew(mockedEmployeeNameOne);
    objectUnderTest.addCheffToCrew(mockedEmployeeNameThree);
    objectUnderTest.addCheffToCrew(mockedEmployeeNameTwo);
    //When
    const resultOne = objectUnderTest.getCheffToOrder();
    const resultTwo = objectUnderTest.getCheffToOrder();
    const resultThree = objectUnderTest;
    //Then
    expect(resultOne).toMatchSnapshot();
    expect(resultTwo).toMatchSnapshot();
    expect(resultThree).toMatchSnapshot();
  });
  it("Should throw PizzeriaError if there isn't free cheff", () => {
    //Given
    objectUnderTest.addCheffToCrew(mockedEmployeeNameOne);
    //When
    const resultOne = objectUnderTest.getCheffToOrder();
    //Then
    expect(resultOne).toMatchSnapshot();
    expect(() => objectUnderTest.getCheffToOrder()).toThrow(PizzeriaError);
  });
  it("Should return true if cheff is available", () => {
    //Given
    objectUnderTest.addCheffToCrew(mockedEmployeeNameOne);
    //When
    const resultOne = objectUnderTest.isCheffAvailable();
    //Then
    expect(resultOne).toBe(true);
    expect(objectUnderTest).toMatchSnapshot();
  });
  it("Should return false if cheff isn't available", () => {
    //When
    const resultOne = objectUnderTest.isCheffAvailable();
    //Then
    expect(resultOne).toBe(false);
    expect(objectUnderTest).toMatchSnapshot();
  });
  it("Should relived cheff", () => {
    //Given
    objectUnderTest.addCheffToCrew(mockedEmployeeNameOne);
    //When
    const cheff = objectUnderTest.getCheffToOrder();
    objectUnderTest.relievedCheff(cheff);
    //Then
    expect(cheff).toMatchSnapshot();
    expect(objectUnderTest).toMatchSnapshot();
  });
  it("Should throw PizzeriaError if there is not cheff wasn't taken", () => {
    //Given
    objectUnderTest.addCheffToCrew(mockedEmployeeNameOne);
    const mockedCheff = new EmployeeDTO("test cheff", EmployeeRole.Cheff);
    //When
    const cheff = objectUnderTest.getCheffToOrder();
    objectUnderTest.relievedCheff(cheff);
    //Then
    expect(cheff).toMatchSnapshot();
    expect(objectUnderTest).toMatchSnapshot();
    expect(() => objectUnderTest.relievedCheff(mockedCheff)).toThrow(
      PizzeriaError
    );
  });
});

import { PizzeriaError } from "../../../pizzeria/error/pizzeria.exceptions";
import { DinnerTableDTO } from "../../table/dinnerTableDTO";
import { ReservationService } from "../reservation.service";

describe("Reservation service test suite", () => {
  let objectUnderTest: ReservationService;
  let mockedTableOne: DinnerTableDTO;
  let mockedTableTwo: DinnerTableDTO;
  let mockedTableThree: DinnerTableDTO;
  let mockedTables: Set<DinnerTableDTO>;
  beforeEach(() => {
    objectUnderTest = new ReservationService();
  });
  beforeAll(() => {
    mockedTableOne = new DinnerTableDTO(1, 2);
    mockedTableTwo = new DinnerTableDTO(2, 5);
    mockedTableThree = new DinnerTableDTO(3, 7);
  });
  beforeAll(() => {
    mockedTables = new Set<DinnerTableDTO>()
      .add(new DinnerTableDTO(1, 2))
      .add(new DinnerTableDTO(2, 5))
      .add(new DinnerTableDTO(3, 7))
      .add(new DinnerTableDTO(4, 7))
      .add(new DinnerTableDTO(5, 4))
      .add(new DinnerTableDTO(6, 6))
      .add(new DinnerTableDTO(7, 2))
      .add(new DinnerTableDTO(8, 8))
      .add(new DinnerTableDTO(9, 4))
      .add(new DinnerTableDTO(10, 6));
  });
  describe("Add table to service test suite", () => {
    it("Should add table to service", () => {
      //When
      objectUnderTest.addTable(mockedTableOne);
      objectUnderTest.addTable(mockedTableTwo);
      objectUnderTest.addTable(mockedTableThree);
      //Then
      expect(objectUnderTest).toMatchSnapshot();
    });
    it("Should throw pizzeriaError if table is already in service", () => {
      //When
      objectUnderTest.addTable(mockedTableOne);
      //Then
      expect(() => objectUnderTest.addTable(mockedTableOne)).toThrow(
        PizzeriaError
      );
    });
  });
  it("Should add table to taken and remove from freeTabeles", () => {
    //Given
    const freeTablesSet = new Set<DinnerTableDTO>();
    freeTablesSet.add(mockedTableOne).add(mockedTableTwo);
    objectUnderTest = new ReservationService(freeTablesSet);
    //When
    objectUnderTest.bookATable(mockedTableOne);
    //Then
    expect(objectUnderTest).toMatchSnapshot();
  });
  describe("Get a table test suite", () => {
    let freeTablesSet: Set<DinnerTableDTO>;
    beforeAll(() => {
      freeTablesSet = new Set<DinnerTableDTO>();
      freeTablesSet
        .add(mockedTableOne)
        .add(mockedTableTwo)
        .add(mockedTableThree);
    });
    beforeEach(() => {
      objectUnderTest = new ReservationService(freeTablesSet);
    });
    it("Should find table with right number of seats", () => {
      //When
      const resultOne = objectUnderTest.getATable(2);
      //Then
      expect(resultOne).toBe(mockedTableOne);
    });
    it("Should find most optimal table if there isn't table with exact number of places", () => {
      //When
      objectUnderTest = new ReservationService(mockedTables);
      const resultOne = objectUnderTest.getATable(3);
      //Then
      expect(resultOne.tableId).toBe(5);
    });
    it("Should throw error if there isn't place for so many people", () => {
      //Given
      objectUnderTest = new ReservationService(mockedTables);
      //Then
      expect(() => objectUnderTest.getATable(10)).toThrow(PizzeriaError);
    });
  });
  describe("Set table to available test suite", () => {
    it("Should find table by id and set to available", () => {
      //Given
      objectUnderTest = new ReservationService(
        new Set<DinnerTableDTO>(),
        mockedTables
      );
      const mockedTableId = 4;
      //When
      objectUnderTest.setTableToAvailable(mockedTableId);
      //Then
      expect(objectUnderTest).toMatchSnapshot();
    });
    it("Should throw error if tableId is undefined", () => {
      //Then
      expect(() => objectUnderTest.setTableToAvailable(undefined)).toThrow(
        PizzeriaError
      );
    });
    it("Should throw error if table isn't in service", () => {
      //Given
      objectUnderTest = new ReservationService(
        new Set<DinnerTableDTO>(),
        mockedTables
      );
      //Then
      expect(() => objectUnderTest.setTableToAvailable(11)).toThrow(
        PizzeriaError
      );
    });
  });
});

import { PizzeriaError } from "../../pizzeria/error/pizzeria.exceptions";
import { DinnerTableDTO } from "../table/dinnerTableDTO";

export class ReservationService {
  constructor(
    private readonly freeTables = new Set<DinnerTableDTO>(),
    private readonly takenTables = new Set<DinnerTableDTO>()
  ) {}
  addTable(table: DinnerTableDTO): void {
    if (!this.freeTables.has(table)) {
      this.freeTables.add(table);
      return;
    }

    throw new PizzeriaError({
      name: "RESERVATION_ERROR",
      message: "Table is already in service",
    });
  }
  getATable(seats: number) {
    let tableToFind: DinnerTableDTO | undefined = undefined;
    for (const table of this.freeTables) {
      if (table.seats === seats) {
        tableToFind = table;
        break;
      }
      if (table.seats > seats) {
        if (!tableToFind || table.seats < tableToFind.seats)
          tableToFind = table;
        //Most optimal table
      }
    }
    if (tableToFind) {
      return tableToFind;
    }
    throw new PizzeriaError({
      name: "RESERVATION_ERROR",
      message: "There is no table for so many people",
    });
  }
  bookATable(table: DinnerTableDTO): void {
    if (this.freeTables.delete(table)) this.takenTables.add(table);
  }
  setTableToAvailable(tableId: number | undefined) {
    if (tableId !== undefined) {
      const table = Array.from(this.takenTables).find(
        (table) => table.tableId === tableId
      );
      if (table) {
        this.takenTables.delete(table);
        this.freeTables.add(table);
        return;
      } else {
        throw new PizzeriaError({
          name: "RESERVATION_ERROR",
          message: "Table with the specified ID does not exist.",
        });
      }
    } else {
      throw new PizzeriaError({
        name: "RESERVATION_ERROR",
        message: "Table ID is undefined.",
      });
    }
  }
}

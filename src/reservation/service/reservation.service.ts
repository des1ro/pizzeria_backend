import { PizzeriaError } from "../../pizzeria/error/pizzeria.exceptions";
import { TableDTO } from "../table/tableDTO";

export class ReservationService {
  constructor(
    private readonly freeTables = new Set<TableDTO>(),
    private readonly takenTables = new Set<TableDTO>()
  ) {}
  addTable(table: TableDTO): void {
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
    let tableToFind: TableDTO | undefined = undefined;
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
  bookATable(table: TableDTO): void {
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

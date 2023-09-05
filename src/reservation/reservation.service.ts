import { PizzeriaError } from "../exceptions/pizzeria.exceptions";
import { TableDTO } from "../table";

export class ReservationService {
  constructor(
    private readonly freeTables = new Set<TableDTO>(),
    private readonly takenTables = new Set<TableDTO>()
  ) {}

  bookTableAndGetTableId(seats: number) {
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
      this.freeTables.delete(tableToFind);
      this.takenTables.add(tableToFind);
      return tableToFind.tableId;
    }
    throw new PizzeriaError({
      name: "TABLE_ERROR",
      message: "There is no table for so many people",
    });
  }
  setTableToAvailable(tableId: number) {
    const table = Array.from(this.takenTables).find(
      (table) => table.tableId === tableId
    );
    if (table) {
      this.takenTables.delete(table);
      this.freeTables.add(table);
      return;
    }
    throw new PizzeriaError({
      name: "TABLE_ERROR",
      message: "Wrong table id number",
    });
  }
}

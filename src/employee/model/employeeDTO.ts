import { EmployeeRole } from "../enum/employee.enum";

export class EmployeeDTO {
  constructor(readonly name: string, readonly role: EmployeeRole) {}
}

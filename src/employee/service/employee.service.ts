import { PizzeriaError } from "../../exceptions/pizzeria.exceptions";
import { EmployeeRole } from "../enum/employee.enum";
import { EmployeeDTO } from "../model/employeeDTO";

export class EmployeeService {
  private readonly takenCheffs = new Set<EmployeeDTO>();
  constructor(
    private readonly availableCheffs = new Set<EmployeeDTO>(),
    readonly availableWaiters = new Set<EmployeeDTO>()
  ) {}
  addCheffToCrew(name: string): void {
    const cheff = new EmployeeDTO(name, EmployeeRole.Cheff);
    this.availableCheffs.add(cheff);
  }
  getCheffToOrder(): EmployeeDTO {
    const cheff = Array.from(this.availableCheffs).reverse().pop();
    if (cheff) {
      this.takenCheffs.add(cheff);
      this.availableCheffs.delete(cheff);
      return cheff;
    }
    throw new PizzeriaError({
      name: "EMPLOYEE_ERROR",
      message: "There isn't free cheffs",
    });
  }
  isCheffAvailable(): boolean {
    return this.availableCheffs.size > 0 ? true : false;
  }
  relievedCheff(cheff: EmployeeDTO) {
    if (this.takenCheffs.delete(cheff)) {
      this.availableCheffs.add(cheff);
      return;
    }
    throw new PizzeriaError({
      name: "EMPLOYEE_ERROR",
      message: "This cheff wasn't taken",
    });
  }
}

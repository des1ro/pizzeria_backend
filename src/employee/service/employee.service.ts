import { EmployeeRole } from "../enum/employee.enum";
import { EmployeeDTO } from "../model/employeeDTO";
import { EmployeeServiceError } from "../error/employee.exception";

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
    throw new EmployeeServiceError({
      name: "EMPLOYEE_ERROR",
      message: "There isn't free cheffs",
    });
  }
  isCheffAvailable(): boolean {
    return this.availableCheffs.size > 0;
  }
  relievedCheff(cheff: EmployeeDTO) {
    if (this.takenCheffs.delete(cheff)) {
      this.availableCheffs.add(cheff);
      return;
    }
    throw new EmployeeServiceError({
      name: "EMPLOYEE_ERROR",
      message: "This cheff wasn't taken",
    });
  }
}

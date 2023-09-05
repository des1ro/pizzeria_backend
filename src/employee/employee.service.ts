import { PizzeriaError } from "../exceptions/pizzeria.exceptions";
import { Employee } from "./employee";

export class EmployeeService {
  private readonly takenCheffs = new Set<Employee>();
  constructor(
    private readonly availableCheffs = new Set<Employee>(),
    private readonly availableWaiters = new Set<Employee>()
  ) {}
  getCheff() {
    const cheff = Array.from(this.availableCheffs).reverse().pop();
    if (cheff) {
      this.takenCheffs.add(cheff);
      return;
    }
    throw new PizzeriaError({
      name: "EMPLOYEE_ERROR",
      message: "There isn't free cheffs",
    });
  }
  releaseCheff(cheff: Employee) {
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

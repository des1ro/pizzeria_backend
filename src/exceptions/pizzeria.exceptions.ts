type ErrorName =
  | "PERMISION_DENIED"
  | "RESERVATION_ERROR"
  | "ORDER_ERROR"
  | "EMPLOYEE_ERROR"
  | "PIZZA_SERVICE_ERROR";
export class PizzeriaError extends Error {
  name: string;
  message: string;
  constructor({ name, message }: { name: ErrorName; message: string }) {
    super(name);
    this.name = name;
    this.message = message;
  }
}

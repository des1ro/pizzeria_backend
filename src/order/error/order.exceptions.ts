type ErrorName = "PERMISION_DENIED" | "QUEQUE_ERROR";
export class OrderServiceError extends Error {
  name: string;
  message: string;
  constructor({ name, message }: { name: ErrorName; message: string }) {
    super(name);
    this.name = name;
    this.message = message;
  }
}

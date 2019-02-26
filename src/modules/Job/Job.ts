
export interface Job {
  getId(): string;
  getStatus(): string;
  setResult(result: any): void;
  getResult(): any;
  start(): void;
  complete(): void;
  error(): void;
}
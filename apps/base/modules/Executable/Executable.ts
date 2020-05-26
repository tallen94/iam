export interface Executable {
  getName(): string
  getUsername(): string
  getVisibility(): string
  run(data: any): Promise<any>
}
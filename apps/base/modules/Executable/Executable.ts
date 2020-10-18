import { AuthData } from "../Auth/AuthData";

export interface Executable {
  getName(): string
  getUsername(): string
  getVisibility(): string
  run(data: any, authData: AuthData): Promise<any>
}
export interface Node {
  getStatus(): Promise<string>;
  addCommand(name: string, command: string): Promise<any>;
  runCommand(name: string, args: string[]): Promise<any>;
  addProgram(name: string, command: string, filename: string, program: any): Promise<any>;
  runProgram(name: string, args: string[]): Promise<any>;
  update(pkg: any): Promise<any>;
}
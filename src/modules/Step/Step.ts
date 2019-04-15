export interface Step {
  execute(data: any): Promise<any>;
}
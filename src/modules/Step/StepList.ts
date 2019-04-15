import { Step } from "./Step";

export interface StepList extends Step {
  addStep(step: Step);
}
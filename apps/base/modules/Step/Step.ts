import { Process } from "../Process/Process";
import { RemoteProcess } from "../Process/RemoteProcess";
import { LocalProcess } from "../Process/LocalProcess";
import { QueryProcess } from "../Process/QueryProcess";

export interface Step {
  // spawn(): RemoteProcess | LocalProcess | QueryProcess;
  execute(data: any, local: boolean);
  // executeEach(data: any);
}
import { Process } from "../Process/Process";
import { RemoteProcess } from "../Process/RemoteProcess";
import { LocalProcess } from "../Process/LocalProcess";
import { QueryProcess } from "../Process/QueryProcess";
import { AuthData } from "../Auth/AuthData";

export interface Step {
  // spawn(): RemoteProcess | LocalProcess | QueryProcess;
  execute(data: any, authData: AuthData);
  // executeEach(data: any);
}
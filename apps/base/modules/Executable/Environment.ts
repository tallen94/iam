import { Executable } from "./Executable";
import { Function } from "./Function";
import { ShellCommunicator } from "../Communicator/ShellCommunicator";
import { FileSystem } from "../FileSystem/FileSystem";
import * as UUID from "uuid";
import { Functions } from "../Constants/Functions";

export class Environment implements Executable {

  constructor(
    private username: string,
    private name: string,
    private image: string,
    private kubernetes: string,
    private shellCommunicator: ShellCommunicator,
    private fileSystem: FileSystem
  ) {

  }

  public getUsername(): string {
    return this.username
  }

  public getName(): string {
    return this.name
  }

  public getVisibility(): string {
    return "auth";
  }

  public run(data: any): Promise<any> {
    const imagePath = UUID.v4()
    const kubernetesPath = UUID.v4()

    return Promise.all([
      this.fileSystem.put("/tmp", imagePath, this.image),
      this.fileSystem.put("/tmp", kubernetesPath, this.kubernetes)
    ]).then(() => {
      return this.shellCommunicator.exec(Functions.BUILD_IMAGE, "bash", "{tag} {imagePath}", {
        tag: data.tag,
        imagePath: "/tmp/" + imagePath,
      })
    }).then(() => {
      return this.shellCommunicator.exec(Functions.BUILD_KUBERNETES, "bash", "{kubernetesPath} {username}", {
        kubernetesPath: "/tmp/" + kubernetesPath,
        username: data.username
      })
    }).then(() => {
      return Promise.all([
        this.fileSystem.delete("/tmp/" + imagePath),
        this.fileSystem.delete("/tmp/" + kubernetesPath)
      ])
    })
  }
}
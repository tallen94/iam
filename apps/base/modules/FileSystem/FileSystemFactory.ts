import { ClientCommunicator } from "../Communicator/ClientCommunicator"
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator"

export class FileSystemFactory {

  public getUserFileSystem(username: string): FileSystemCommunicator {
    return this.getFileSystemCommunicator("iam-filesystem." + username, 80)
  }

  private getFileSystemCommunicator(host: string, port: number): FileSystemCommunicator {
    const client = new ClientCommunicator(host, port)
    return new FileSystemCommunicator(client)
  }
}
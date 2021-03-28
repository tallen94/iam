import {Socket} from "socket.io"

export class DataSocket {

  constructor(private socket: Socket) {

  }

  onData(data: any) {
    this.socket.emit("data", data)
  }

  onComplete(data: any) {
    this.socket.emit("complete", data)
  }
}
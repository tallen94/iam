import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { Queries } from "../Constants/Queries";
import * as Lodash from "lodash";
import * as uuid from "uuid";
import { FileSystem } from "../FileSystem/FileSystem";
import { ShellCommunicator } from "../Communicator/ShellCommunicator";
import { Functions } from "../Constants/Functions";

export class ImageManager {

  constructor(
    private fileSystem: FileSystem,
    private fileSystemCommunicator: FileSystemCommunicator,
    private databaseCommunicator: DatabaseCommunicator,
    private shellCommunicator: ShellCommunicator
  ) {

  }

  public addImage(data: any) {
    return this.getImage(data.username, data.name)
    .then((result) => {
      if (result == undefined) {
        return this.databaseCommunicator.execute(Queries.ADD_IMAGE, {
          username: data.username, 
          name: data.name,
          imageRepo: data.imageRepo,
          imageTag: "",
          description: data.description,
          state: data.state
        })
      }
      return this.databaseCommunicator.execute(Queries.UPDATE_IMAGE, { 
        username: data.username, 
        name: data.name,
        imageRepo: data.imageRepo,
        imageTag: data.imageTag,
        description: data.description,
        state: data.state
      })
    }).then(() => {
      return Promise.all([
        this.fileSystemCommunicator.putFile("images", {
          name: this.imageFullName(data.username, data.name),
          file: data.image
        })
      ])
    })
  }

  public getImage(username: string, name: string) {
    return this.databaseCommunicator.execute(Queries.GET_IMAGE, {username: username, name: name})
    .then((result: any[]) => {
      if (result.length > 0) {
        const item = result[0]
        return Promise.all([
          this.fileSystemCommunicator.getFile("images", this.imageFullName(username, name)),
          item.state != "BUILDING" ? this.fileSystemCommunicator.getFile(["image-builds", item.username, item.name].join("/"), "1") : Promise.resolve("")
        ]).then((result) => {
          item["image"] = result[0]
          item["buildResult"] = result[1]
          return item;
        })
      }
    })
  }

  public getImages(username: string) {
    return this.databaseCommunicator.execute(Queries.GET_IMAGE_FOR_USER, {username: username})
    .then((results) => {
      return Promise.all(Lodash.map(results, (item) => {
        return Promise.all([
          this.fileSystemCommunicator.getFile("images", this.imageFullName(username, item.name)),
          item.state != "BUILDING" ? this.fileSystemCommunicator.getFile(["image-builds", item.username, item.name].join("/"), "1") : Promise.resolve("")
        ])
        .then((result) => {
          item["image"] = result[0]
          item["buildResult"] = result[1]
          return item;
        })
      }))
    })
  }

  public deleteImage(username: string, name: string) {
    return this.databaseCommunicator.execute(Queries.DELETE_IMAGE, {username: username, name: name})
    .then((result) => {
      return this.fileSystemCommunicator.deleteFile("images", this.imageFullName(username, name))
    })
  }

  public buildImage(username: string, name: string) {
    // Get environment
    return this.getImage(username, name)
    .then((image) => {
    // Gen image tag
      const imageUid = uuid.v4()
      const imageTag = image.imageRepo + ":" + imageUid
      // Write img file to run dir
      return this.fileSystem.put("run", imageUid, image.image)
      .then(() => {
        // build image
        this.shellCommunicator.exec(Functions.BUILD_IMAGE, "bash", "{tag} {image}", { 
          tag: imageTag, 
          image: this.fileSystem.path("run/" + imageUid)
        }).then((result) => {

          let output = ""
          if (result.err) {
            output = result.err
            image.state = "BUILD_ERROR"
          } else {
            output = result
            image.state = "BUILD_SUCCESS"
            image.imageTag = imageTag
          }

          // Save Output
          const folder = ["image-builds", image.username, image.name].join("/")
          return this.fileSystemCommunicator.putFile(folder, {
            name: "1",
            file: output
          }).then(() => {
            // save environment
            return this.addImage(image).then(() => {
              // delete run file
              return this.fileSystem.delete(this.fileSystem.path("run/" + imageUid))
            })
          })
        })

        image.state = "BUILDING"
        return this.addImage(image).then(() => {
          return { image: image }
        })
      })
    })
  }

  private imageFullName(username: string, name: string) {
    return [username, name].join("-")
  }
}
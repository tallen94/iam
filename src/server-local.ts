import {
  Cluster
} from "./modules/modules";

const cluster = new Cluster(5);
cluster.startCluster().then(() => {
  console.log("Started");
});
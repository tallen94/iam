# Iam: Infinitely Scalable Customizable Execution Cluster

Iam is a space for collaborating and building. Use it to create instantly available, autoscaling data pipelines. Use it to share code snippets that are instantly available through an api and re-usable in other pipelines. 

A single interface provides all the tools to write and experiment with code on a highly scalable, highly available cluster. Machine Learning engineers need a way to minimize complexity in getting experimentation code into a production size computing environment. 

This tool enables the same freedom and iteration speed as developing locally with tools like Jupyter Notebook. Transitioning code from a notebook to a highly scalable platform requires no additional effort from the developer, other than copying it from one editor to another. Furthermore, the code they write does not have to implement how it should be run on the distributed system.

## Iam Cluster
An Iam cluster is deployed to Kubernetes. It allows you to create environments that comprise of a Dockerfile and Kubernetes object yaml files. It manages the repository for all your code, Dockerfile's and Kubernetes object files. Once you initialize the interactions can take place from within the user interface or through the `Executable` api.

#### Tutorials
Follow the [introduction](https://github.com/tallen94/iam/blob/master/tutorials/introduction.md) tutorial to learn about the main concepts of Iam.


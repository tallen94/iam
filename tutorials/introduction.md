# Introduction
Iam is a limitless tool for developing highly scalable code

This tutorial will introduce you to the main concepts. Once you feel comfortable with the information in this tutorial, move on to the next.

### Executable
Executables are the resources available on the cluster. You can:
- Add and executable
- Get and executable
- Get a list of executables for a user
- Run and executable

These operations are available as the `Executable Api`
- `/executable`
- `/executable/:username/:exe/:name`
- `/executable/:username/:exe`
- `/executable/:username/:exe/:name/run`

#### Environments
These are descriptions of Kubernetes scheduled objects and the container image to use. Each environment requires a `Dockerfile` and `kubernetes` yaml file. You can deploy any kubernetes object using environments. 

Environments that extend any image based off of `icanplayguitar/iam:base-*`, and implement the required pod definition for `executor` will have the executable and filesystem api available. This means they can be used to run any other `executable`.

Each `executable` must specify what environment it is run in. By default they run in the `base` environment. 

*Environments run in the `environment-builer` environment, which has kubectl and docker running.*

#### Function
Functions are pieces of code. Functions require a command and code to run that takes input from stdin and outputs to stdout.
Once you write a function, it is immediately accessible via the `Executable Api`. 

When running a `function`, they will be receive the body of the api request into their `stdin` pipe. All of the output into the `stdout` pipe will be returned in the response body of the api request. 

If specifying an additional set of arguments in the `args` field, use `{key}` as a way to inject values from requests with a json body.

#### Queries
Queries are SQL queries to communicate with the local database. Currently you can only access the cluster database through native `queries`.
It would be ideal to allow queries to specify what datasource they want, in the same way that functions can specify what `environment` they use.
For now, you can use functions to hook up a mysql client library in python for example.

#### Graphs 
Graphs are descriptions of the execution plan of a series of `functions` and `queries`. Steps can be linked in sequential and parallel patterns.

Graphs are Directed Acyclic Graphs. It can have as many starting and ending nodes, with any edges as long as no cycles are created.

There are a few different ways of specifying input into a graph. 
- Graphs with a single start node will be passed the whole body.
- Graphs with multiple start nodes will expect an `[]` of data where the objects at each index are passed to the corresponding start node.
- Using the `FOREACH` option will make a node expect an `[]` of data input and execute the node for each item in that dataset.


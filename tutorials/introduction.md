# Introduction
Iam is a limitless tool for developing highly scalable code

This tutorial will introduce you to the main concepts and describe some simple use cases. 
Once you feel comfortable with the information in this tutorial, move on to the next.

### Creating a User
The first step is to sign up on the first page. 

### The Navigator
On the left side of the screen you will see 4 sections: functions, queries, graphs, environments.

These are the 4 types of executables that can be created.

### Executable
The resources available on the cluster. You can:
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
These are descriptions of where executables can be run. Each environment requires a `Dockerfile` and `kubernetes` yaml file.
Running these runs a function to build the image and deploy the kubernetes objects to the cluster. 

They run the `build-environment` function, which takes in the image name.

#### Function
Functions are pieces of code that get executed in the `environment`. Functions require a command and code to run that takes input from stdin and outputs to stdout.
Once you write a function, it is accessible as a rest api. See that section for more details

#### Queries
Queries are SQL queries to communicate with the local database. Currently you can only access the cluster database through native `queries`.
It would be ideal to allow queries to specify what datasource they want, in the same way that functions can specify what `environment` they use.
For now, you can use functions to hook up a mysql client library in python for example.

#### Graphs 
Graphs are descriptions of the execution plan of a series of `functions` and `queries`. Steps can be linked in sequential and parallel patterns.

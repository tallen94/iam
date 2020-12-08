# Hello Iam


## Sign Up

Welcome to Iam. Please follow the onscreen prompts and come back to this tutorial after completing the form.

Select `New` if you are a new user.

## Home
The screen you are taken to is the `Home` screen. The navigation for the system is to the left, where you can create and select items. 

Selected items will appear in the middle of the page and allow you to edit their values.

You can navigate between recent visited items by using the arrow keys near the top.

### Clusters

- Create your first cluster by hitting the `+` next to the `Clusters` in the navigation. 
- Enter in a name, perhaps __main__, and click `Create`.


*Note: After clicking the `Create` button you need to save what was created by hitting the `edit` button, followed by the `save` button in the 
top right.*

Now you have a cluster created where you can add environments to it.

- Edit the description to something a little better, perhaps *"This is my first cluster and is for testing purposes"*


### Environments
An Environment describes a set of dependencies and resources for allocation in the Cluster.

- Create an Environment
  - Click the `+` button in the navigation bar or,
  - Click `Add Environment` when a __Cluster__ is selected in the editor.  
- Enter in a name, perhaps __base__, and click `Create`

*Note: After clicking the `Create` button you need to save what was created by hitting the `edit` button, followed by the `save` button in the 
top right.*

There is more information in an Environment than a Cluster. It starts with a good description though. 

- Click the `edit` button and edit the description, followed by the `save` button.

The __State__ informs you if the Environment is available for use. Currently, your environment is __Stopped__.

- To start the Environment, click `start` in the top right. The state should move to __Running__. 
- To stop the Environment, click `stop` in the top right. The state should move to __Stopped__.

Make sure your Environment is __Running__ before continuing.

### Functions
A Function is a script of code that you write. Your Function can run any command and reference a custom script in the **Environment** you choose. IAM takes your request payload and gives it to the Function through the `stdin` pipe and reads from the `stdout` and `stderr` pipes in the response.

- Create a Function
  - Click the `+` button in the navigation bar
- Enter in a name, perhaps __test__, and click `Create`

*Note: After clicking the `Create` button you need to save what was created by hitting the `edit` button, followed by the `save` button in the 
top right.*

#### Function Data
Function data includes the basic information like name, description but also has some unique attributes.

- **Input**: data type expected as input into the Function
- **Output**: data type expected as output from the Function
- **Command**: the command to run
- **Args**: arguments obtained from the **Input** data
- **Function** the script from you, make it count

For more information, see more about syntax

The default function template that gets provided to you is a simple `python` script that returns `{}`.

- Click the `edit` button to make a few updates. 
- Update **Input** to `{"result":""}`
- Update the **Function** to the following code snippet
```
import json

args = raw_input()
data = json.loads(args)
out={"data": data}
print json.dumps(out)
```
Now our Function returns an object like `{"data": data}`, which will be whatever we give it as input.

- Update **Output** to `{"data": {"result": ""}}`, to match our **Function's** output.
- Click `save` to save our changes.

#### Running the Function
We can run our function now through the UI and test it out.

- Click the `run` button to bring up the run window.
- Fill out the **Request Data** with:
```
{
  "result": "Success!"
}
```
- Click the `Run` button at the bottom of the run window.

You should see this output:
```
{
  "data": {
    "result": "Success!"
  }
}
```

This one method of running a function in IAM. Another method is using the REST api. 


# Appendix

## Syntax
There are a few input fields that allow use of special syntax to perform functionality during execution of an executable.

### Functions
#### Args: 
This takes arguments from the **Request Data** and passes them when running the **Command** for your function.

**Request Data**
```
{
  "type": "apples",
  "count": 10
}
```

**Args**
```
{count} {type}
```

**Command**
```
python
```

The resulting command would look like
```
python 10 apples function.py
```

#### Request Data
The data you pass into a function can be populated with things like secrets at runtime of your function so you can store it safely.

To use a secret use the `$secret` syntax like so: `{"mysecret": "$secret"}`. This will look for a secret under your user and hydrate the value before passing data to your executables.

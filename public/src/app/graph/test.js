testData = require("./test.json")
requireValidation = require("./test2.json")
Lodash = require("lodash");

function getNodes(stepJson, nodes) {
  switch (stepJson.exe) {
    case "foreach":
      nodes = nodes.concat(getNodes(stepJson.step, nodes))
    case "pipe":
    case "async": 
      Lodash.each(stepJson.steps, (step) => {
        nodes = nodes.concat(getNodes(step, nodes));
      });
      return nodes;
    default:
      stepJson.index = nodes.length
      return [stepJson]
  }
}

console.log(getNodes(testData, []))
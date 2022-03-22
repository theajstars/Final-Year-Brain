const getData = async () => {
  await axios.get("Assets/JSON/df50.json").then((res) => {
    console.log(res.data.data);
  });
};
getData();
console.log(true);
// const options = {
//   dataUrl: "Assets/JSON/df.json",
//   task: "classification",
//   inputs: ["fever", "bodyPain", "age", "runnyNose", "diffBreath"],
//   outputs: ["infectionProb"],
//   debug: true,
// };

// const nn = ml5.neuralNetwork(options, dataLoaded);

// function dataLoaded() {
//   const trainingOptions = {
//     epochs: 32,
//     batchSize: 12,
//   };

//   nn.train(trainingOptions, finishedTraining);
// }

// function finishedTraining() {
//   classify();
// }

// function classify() {
//   const input = {
//     fever: 102,
//     bodyPain: 0,
//     age: 97,
//     runnyNose: 0,
//     diffBreath: -1,
//   };
//   nn.classify(input, handleResults);
// }

// function handleResults(error, result) {
//   if (error) {
//     console.error(error);
//     return;
//   }
//   console.log(result);
// }

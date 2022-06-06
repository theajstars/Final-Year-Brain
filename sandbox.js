const options = {
  task: "classification",
  debug: true,
};

const nn = ml5.neuralNetwork(options);
nn.load("./Trained_New/Top_Half/model.json", () => {
  console.clear();
  console.log("Loaded Model is ready!");
  console.log(nn.neuralNetwork);
});

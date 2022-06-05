console.clear();
const baseURL = "http://127.0.0.1:8080/";

//Fetch top half of data data to train
axios
  .get(`${baseURL}datasets/new/tophalf`)
  .then((trainResultData) => {
    const trainResult = trainResultData.data.file;
    console.log(trainResult);
    const options = {
      task: "classification",
      debug: true,
    };

    const nn = ml5.neuralNetwork(options);
    trainResult.splice(0, 500).forEach((item) => {
      const inputs = {
        cough: item.cough,
        fever: item.fever,
        sore_throat: item.sore_throat,
        head_ache: item.head_ache,
        shortness_of_breath: item.shortness_of_breath,
        age_60_and_above: item.age_60_and_above === "Yes" ? 1 : 0,
        gender: item.gender === "male" ? 0 : 1,
      };
      const output = {
        corona_result: item.corona_result,
      };

      nn.addData(inputs, output);
    });

    nn.normalizeData();

    const trainingOptions = {
      epochs: 32,
      batchSize: 12,
    };

    nn.train(trainingOptions, () => {
      nn.save();
    });
  })
  .catch((err) => {
    console.error(err);
  });

console.clear();
const baseURL = "http://127.0.0.1:8080/";

//Fetch data data to train
axios
  .get(`${baseURL}datasets/new/tophalf`)
  .then((trainResultData) => {
    const trainResult = trainResultData.data.file;
    const options = {
      task: "classification",
      debug: true,
    };

    const nn = ml5.neuralNetwork(options);
    trainResult.forEach((item) => {
      const inputs = {
        // fever: item.fever,
        // bodyPain: item.bodyPain,
        // age: item.age,
        // runnyNose: item.runnyNose,
        // diffBreath: item.diffBreath,
        cough: item.cough,
        fever: item.fever,
        sore_throat: item.sore_throat,
        head_ache: item.head_ache,
        age_60_and_above: item.age_60_and_above,
        gender: item.gender,
      };
      const output = {
        // infectionProb: item.infectionProb.toString(),
        corona_result: item.corona_result,
      };

      nn.addData(inputs, output);
    });

    nn.normalizeData();

    const trainingOptions = {
      epochs: 64,
      batchSize: 12,
    };

    nn.train(trainingOptions, () => {
      nn.save();
    });
  })
  .catch((err) => {
    console.error(err);
  });

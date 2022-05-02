console.clear();
const baseURL = "http://127.0.0.1:8080/";

const options = {
  task: "classification",
  debug: true,
};
var correct = [];
var wrong = [];
const nn = ml5.neuralNetwork(options);
nn.load("./TrainedModels/TopHalfTrained/model.json", () => {
  console.log("Loaded model is readdy!");
  //Fetch  data to test after
  axios.get(`${baseURL}datasets/bottomhalf`).then((testingResult) => {
    console.clear();
    const testSegment = testingResult.data.file;
    testSegment.map((testRecord) => {
      const input = {
        fever: testRecord.fever,
        bodyPain: testRecord.bodyPain,
        age: testRecord.age,
        runnyNose: testRecord.runnyNose,
        diffBreath: testRecord.diffBreath,
      };

      const output = testRecord.infectionProb.toString();

      function classify() {
        nn.classify(input, (error, testResults) => {
          if (error) {
            console.error("Error: ", error);
          } else {
            const mapp = testResults.map((result, index) => {
              if (result.label === output) {
                if (result.confidence > 0.5) {
                  //Prediction is correct
                  const obj = {
                    prediction: true,
                    pos: testResults.indexOf(result),
                  };
                  // console.log("Prediction is correct!");
                  correct.push(obj);
                } else {
                  //Prediction is inaccurate
                  const obj = {
                    prediction: false,
                    pos: testResults.indexOf(result),
                  };
                  wrong.push(obj);
                  // console.log("Prediction is inaccurate!");
                }
                console.log(
                  `Label: ${result.label}, Confidence: ${result.confidence}`
                );
              }

              return {
                length: testResults.length,
                index,
              };
            });

            return Promise.all(mapp).then((e) => {
              console.clear();
              const wrongNum = wrong.length;
              const correctNum = correct.length;
              const total = wrongNum + correctNum;
              console.log(Math.floor((correctNum / total) * 100));
            });
          }
        });
      }
      classify();
    });
  });
});

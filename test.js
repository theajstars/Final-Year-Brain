console.clear();
const baseURL = "http://127.0.0.1:8080/";

const options = {
  task: "classification",
  debug: true,
};
const percentageSuccesses = [];
var correct = [];
var wrong = [];
const nn = ml5.neuralNetwork(options);
nn.load("./Trained_New/Top_Half/model.json", () => {
  console.log("Loaded model is readdy!");
  //Fetch  data to test after
  axios.get(`${baseURL}datasets/new/bottomhalf`).then((testingResult) => {
    console.clear();
    // const testSegment = testingResult.data.file;
    const testSegment = testingResult.data.file.splice(200000, 50000);
    console.log(testSegment);
    testSegment.map((testRecord) => {
      const input = {
        cough: testRecord.cough,
        fever: testRecord.fever,
        sore_throat: testRecord.sore_throat,
        head_ache: testRecord.head_ache,
        shortness_of_breath: testRecord.shortness_of_breath,
        age_60_and_above: testRecord.age_60_and_above === "Yes" ? 1 : 0,
        gender: testRecord.gender === "male" ? 0 : 1,
      };

      const output = testRecord.corona_result;

      function classify() {
        nn.classify(input, (error, testResults) => {
          if (error) {
            console.error("Error: ", error);
          } else {
            const mapp = testResults.map((result, index) => {
              console.log(result);
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
              }

              return {
                length: testResults.length,
                index,
              };
            });

            return Promise.all(mapp).then((e) => {
              // console.clear();
              const wrongNum = wrong.length;
              const correctNum = correct.length;
              const total = wrongNum + correctNum;
              const percentageSuccess = Math.floor((correctNum / total) * 100);
              percentageSuccesses.push(percentageSuccess);
            });
          }
        });
      }
      classify();
    });
  });
});
const showSuccess = () => {
  console.log(percentageSuccesses);
  const percentageAverage =
    percentageSuccesses.reduce((a, b) => a + b, 0) / percentageSuccesses.length;
  console.log(percentageAverage);
};

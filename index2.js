let data = [];
async function getData() {
  let data = await fetch("./Assets/JSON/df.json");
  data = await data.json();
  data = data.data;
  data = data.slice(data.length / 10);
  return data;
}

getData().then((res) => {
  data = res;
  const options = {
    task: "classification",
    debug: true,
  };

  const nn = ml5.neuralNetwork(options);
  console.clear();
  data.forEach((item) => {
    const inputs = {
      fever: item.fever,
      bodyPain: item.bodyPain,
      age: item.age,
      runnyNose: item.runnyNose,
      diffBreath: item.diffBreath,
    };
    const output = {
      infectionProb: item.infectionProb.toString(),
    };

    nn.addData(inputs, output);
  });

  nn.normalizeData();

  const trainingOptions = {
    epochs: 32,
    batchSize: 12,
  };

  const values0 = [];
  const values1 = [];
  const input = {
    fever: 102,
    bodyPain: 0,
    age: 97,
    runnyNose: 0,
    diffBreath: -1,
  };
  // nn.train(trainingOptions, finishedTraining);
  // nn.train(trainingOptions, finishedTraining);
  // nn.train(trainingOptions, finishedTraining);
  nn.train(trainingOptions, () => {
    nn.classify(input, (err, res) => {
      if (err) {
        console.error(err);
        return;
      } else {
        console.log(res);
        res.map((result) => {
          if (result.label === "0") {
            //Case Negative test
            values0.push(result.confidence);
          } else {
            //Case Positive Test
            values1.push(result.confidence);
          }
        });
      }
    });
    nn.train(trainingOptions, () => {
      nn.classify(input, (err, res) => {
        if (err) {
          console.error(err);
          return;
        } else {
          console.log(res);
          res.map((result) => {
            if (result.label === "0") {
              //Case Negative test
              values0.push(result.confidence);
            } else {
              //Case Positive Test
              values1.push(result.confidence);
            }
          });
        }
      });

      nn.train(trainingOptions, () => {
        nn.classify(input, (err, res) => {
          if (err) {
            console.error(err);
            return;
          } else {
            console.log(res);
            res.map((result) => {
              if (result.label === "0") {
                //Case Negative test
                values0.push(result.confidence);
              } else {
                //Case Positive Test
                values1.push(result.confidence);
              }
            });
            console.log(values0);
            console.log(values1);
            function reducer(index, accumulator) {
              return index + accumulator;
            }
            console.log(values0.reduce(reducer));
            console.log(values1.reduce(reducer));
          }
        });
      });
    });
  });
});

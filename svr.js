const tf = require('@tensorflow/tfjs-node');
const fs = require('fs')
let myModule = require('./dataset.js');
let testing = require('./testingData.js');
const smooth = require('array-smooth');

let trainingData = myModule.dataset;
let testingData = testing.testingData;

function smoothDataSet(data) {
  const allData = []
  for(const each of data) {
    const arr = each[0];
    allData.push([smooth(arr, 4),each[1]]) // 2 BEFORE
  }
  return allData
}

function maskData(array) {
  let newArr = smoothDataSet(array);
  const big = 236
  for(let each of newArr) {
    if(each[0].length < big) {
      for(let i=each[0].length; i<big; i++) {
        each[0].push(-10)
      }
    }
    if(each[0].length > big) {
      each[0] = each[0].slice(0,big)
    }
  }
  return newArr
}
// FOR LSTM MDOEL
function turnDataIntoArrays(array) {
  let newSeq = []
  for(let each of array) {
    arr = []
    for(let one of each[0]) {
      arr.push([Number(one.toFixed(2))])
    }
    newSeq.push([arr, each[1]])
  }
  return newSeq
}

const trainData = maskData(trainingData);
const testData = maskData(testingData);
// console.log(trainData);

let labels = []
let trainingSequences = [];
let testingSequences = [];
const dataTrain = turnDataIntoArrays(trainData)
const dataTest =  turnDataIntoArrays(testData)
for(const each of dataTrain) {
  trainingSequences.push(each[0])
  labels.push(each[1])
}
for(const each of dataTest) {
  testingSequences.push(each[0])
}

let xs = tf.tensor3d(trainingSequences);
const xsTest = tf.tensor3d(testingSequences);
console.log(xsTest);
const trainLabels = tf.tensor1d(labels, 'int32')
const ys = tf.oneHot(trainLabels, 4)
// xs = xs.reshape([1,24,236])
// console.log(displayHotEnc(ys));

////// DISPLAY ONE HOT ENCODING IN REAL ARRAYS
function displayHotEnc(hotEncoding) {
  const values = hotEncoding.dataSync();
  const array = Array.from(values);
  Array.prototype.chunk = function ( n ) {
    if ( !this.length ) {
      return [];
    }
    return [ this.slice( 0, n ) ].concat( this.slice(n).chunk(n) );
  };
  const res = array.chunk(4);
  return res
}
////////

async function train() {
  // Define the topology of the model.
  const model = tf.sequential();

  const lstm = tf.layers.lstm({
    units: 48,
    activation: 'sigmoid',
    batchInputShape: [24,236,1]
  })
  const output = tf.layers.dense({
    units: 4,
    activation: 'softmax'
  })

  // const hidden = tf.layers.dense({
  //   units: 24,
  //   activation: 'sigmoid'
  // });
  // model.add(tf.layers.masking())
  // model.add(tf.layers.lstm({units: 8, inputShape: [24, 236]}));
  model.add(lstm)
  // model.add(hidden);
  model.add(output);

  // Compile model to prepare for training.
  const learningRate = 0.15;
  const optimizer = tf.train.sgd(learningRate);
  model.compile({
    loss: 'categoricalCrossentropy',
    optimizer: optimizer
  });


  // Generate a number of examples for training.
  const numTrainExamples = 24;
  console.log('Generating training data...');
  console.log('Training model...');
  const fitOutput = await model.fit(
      xs, ys, {
        epochs: 10000,
        validationSplit: 0.1,
        shuffle:true,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            // Update the UI to display the current loss and accuracy values.
            console.log('Epoch: ' + (parseInt(epoch) + 1))
            console.log('Training loss: ' + logs.loss)
            // console.log('Training accuracy: ' + logs.acc)
            // console.log('Validation loss: ' + logs.val_loss)
            // console.log('Validation accuracy: ' + logs.val_acc)
            // console.log('Example Sequence: ' + xs)
            // console.log('Example Label for each group of ten above: ' + ys)
            console.log('-----------------------------');
          },
        }
      });
      await model.save('file://./model-1a')
      // let results = model.predict(xsTest);
      // results.print()
      // console.log(res[0],res[6], res[12],res[18]);
      // Memory clean up: Dispose the training data.
      xs.dispose();
      ys.dispose();
}
// train()
testModel()

async function testModel() {
  const model = await tf.loadLayersModel('file://./model-1a/model.json')
  let results = model.predict(xsTest);
  const percentage = [];
  // console.log(results);
  const resultsInChunks = displayHotEnc(results)
  testData.forEach((item, i) => {
    const tot = showResults(resultsInChunks[i]);
    console.log('ML: ' + tot, 'Expected: '+ item[1]);
    percentage.push(tot + '' +  item[1])
  });
  const success = showPercentage(percentage);
  console.log(success);
}


function showResults(res) {
  const result = res.map(each => each * 100);
  const max = Math.max(...result)
  return result.indexOf(max)
}

function showPercentage(perc) {
  let counter = 0;
  for(const each of perc) {
    if(each[0] == each[1]) {counter++};
  }
  return (counter/testingData.length) * 100
}

// const brain = require('brain.js');
// const fs = require('fs')
// let myModule = require('./dataset.js');
// const smooth = require('array-smooth');
// let trainingData = myModule.dataset;
// let leftCurve = myModule.leftCurve
//
// function smoothDataSet(data) {
//   const allData = []
//   for(const each of data) {
//     const arr = each.input;
//     allData.push({input: smooth(arr, 2), output: each.output})
//   }
//   return allData
// }
// const dataset = smoothDataSet(trainingData)
// for(const each of dataset) {
//   each.input = [Number(each.input.reduce((a,b) => {
//     return a + b
//   },0).toFixed(2))]
// }
// console.log(dataset);
// // const data = [
// //   {input: [0.8,0.7,0.8,0.6,0.7,0.8], output: [0.1]},
// //   {input: [0.1,0.2,0.1,0.3,0.1,0.3], output: [0]},
// //   {input: [0.1,0.3,0.2,0.2,0.1,0.3], output: [0]},
// //   {input: [0.8,0.8,0.7,0.8,0.7,0.7], output: [0.1]},
// //   {input: [0.11,0.14,0.12,0.13,0.11,0.14], output: [0.2]},
// //   {input: [0.11,0.13,0.14,0.11,0.12,0.11], output: [0.2]},
// // ]
// const test = [.0]
// const net = new brain.recurrent.LSTM();
//
// /////////////////////////
// // net.train(dataset, {
// //   iterations: 10000,
// //   log: true, // true to use console.log, when a function is supplied it is used --> Either true or a function
// // });
// // const output = net.run(test)
// // console.log(output);
// // const model = net.toJSON();
// //     fs.writeFile('./model.json', JSON.stringify(model), 'utf8', () => console.log('model has been written'));
// /////////////////////////
// const runModel = JSON.parse(fs.readFileSync('./model.json', 'utf8'));
// const saved = net.fromJSON(runModel);
// saved.maxPredictionLength = 1000000000;
// // console.log(saved);
// const output = saved.run(test)
// console.log(output);

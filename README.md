# LSTM
- This repository has been used to train Long-Short-Term-Memory model on driving behaviour dataset. The model was tranied on 50% training dataset in file ```dataset.js``` and tested on dataset in file ```testingData.js```. 
- The outcome of this model is utilised in the following project. (https://github.com/UP941594/FYP)

## ```model-1a folder```
- This folder contains tranied LSTM model which has achieved an accuracy of 82% on testing data (unseen data).

## ```brainExam.js```
- This file has funcitonallity of ```brain.js``` machine learning library which was intially used to train on driving dataset. However, this library did not work with sequences of data therefore it was not used thereafter. (This file can be ignored)

## ```dataset.js```
- This file contains all training samples (24 driving events, each in an array) with a label in numbers (0 for aggressive left turn,  1 for aggrressive right turn, 2 for non-aggressive events and 3 for harsh braking events). 
- Each driving event is a collection of one-axis of gyroscope sensor.

## ```testingData.js```
- This files has testing samples with a same structure as ```dataset.js```. 

## ```svr.js```
- The main server file that utilises ```@tensorflow/tfjs-node``` to train LSTM model. 
- Imports relevant modules such as ```array-smooth``` to smoothen training dataset to remove noisy data. 
- Masks dataset to have all training samples with equal length. 
- Turns boths training and testing samples into tensors. 
- Trains the LSTM model on data imported from ```dataset.js``` with relevant number of layers, activation functions and output layers. 
- The models gets saved into ```model-1a``` after trainig. 
- ```testModel``` functions imports the folder to test its accuracy on testing dataset. 
- Additional functions such as ```showResuls()``` and ```showPercentage()``` shows the results. 

const datagen = require('../dataGen/datagen.js');
const cities = require('../dataGen/cities.js');
const AWS = require('aws-sdk');
const path = require('path');
const cron = require('node-cron');


AWS.config.loadFromPath(path.resolve(__dirname, '../config.json'));


let sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const queue = {
  ridematching: 'https://sqs.us-west-1.amazonaws.com/278687533626/ridematching', 
  pricinginbox: 'https://sqs.us-west-1.amazonaws.com/278687533626/eventlogger', 
  driverinbox: 'https://sqs.us-west-1.amazonaws.com/278687533626/drivers', 
  pricingoutbox: 'https://sqs.us-west-1.amazonaws.com/278687533626/pricingoutbox'
}


let sendMessage = (messageBody, queueUrl) => {
  let params = {
    MessageBody: JSON.stringify(messageBody), 
    QueueUrl: queueUrl, 
    DelaySeconds: 0
  }
  return new Promise((resolve, reject) => {
    sqs.sendMessage(params, (err, data) => {
      if (err) { 
        reject(err)
      } else { 
        resolve(data);
      };
    });
  })
};


let simulateLoad = () => {
  let log = datagen.generateRandomPricingLog();
  sendMessage(log, queue.pricinginbox);
  
  let chanceOfConversion = Math.random();

  if(chanceOfConversion > .35) {
    let ridematchingLog = {
      userId: log.userId, 
      city: log.city, 
      priceTimestamp: log.priceTimestamp, 
      timeInterval: log.timeInterval, 
      day: log.day
    }
    sendMessage(log, queue.ridematching);
  }
}

// Uncomment for Pricing and Ride Matching Load Sim
setInterval(() => {
  console.log('User Journey Started');
  simulateLoad();
}, 10);

let averageDriversSim = () => {
  let log = datagen.generateRandomDriverLog();
  sendMessage(log, queue.driverinbox);
}

setInterval(() => {
  console.log('Sending a message to Drivers Inbox');
  averageDriversSim()
}, 5000)

cron.schedule('* */1 * * *', () => {
  console.log('Sending a message to Drivers Inbox');
  averageDriversSim();
})

// Simple Testing Query for Loading Messagebox
//   let populateInbox = () => {
//   var test = data.generateRandomPricingLog();
//   sendMessage(test, queue.pricinginbox);
// }

// cron.schedule('*/1 * * * * *', () => {
//   console.log('generating random pricing log');
//   populateInbox();
// })
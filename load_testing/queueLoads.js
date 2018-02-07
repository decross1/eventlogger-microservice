const datagen = require('../dataGen/datagen.js');
const cities = require('../dataGen/cities.js');
const AWS = require('aws-sdk');
const path = require('path');


AWS.config.loadFromPath(path.resolve(__dirname, '../config.json'));


let sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const queue = {
  ridematching: 'https://sqs.us-west-1.amazonaws.com/278687533626/ridematching', 
  pricinginbox: 'https://sqs.us-west-1.amazonaws.com/278687533626/eventlogger', 
  pricingoutbox: 'https://sqs.us-west-1.amazonaws.com/278687533626/eventlogger'
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

setInterval(() => {
  console.log('User Journey Started');
  simulateLoad();
}, 100);


// Simple Testing Query for Loading Messagebox
// let populateInbox = () => {
//   var test = data.generateRandomPricingLog();
//   sendMessage(test, queue.pricinginbox);
// }

// cron.schedule('*/1 * * * * *', () => {
//   console.log('generating random pricing log');
//   populateInbox();
// })
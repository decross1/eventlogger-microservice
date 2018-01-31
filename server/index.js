// require('babel-core/register');  // May or may not need this?
const Koa = require('koa');
const app = new Koa();
const AWS = require('aws-sdk');
const path = require('path');
const queueUrl = 'https://sqs.us-west-1.amazonaws.com/278687533626/eventlogger';
const faker = require('faker');

console.log(__dirname);

const port = process.env.PORT || 3000;
AWS.config.loadFromPath(path.resolve(__dirname, '../config.json'));

// Logic for Creating a new queue;
let sqs = new AWS.SQS({
    apiVersion: '2012-11-05'
});

// let params = {
//     QueueName: 'eventlogger', 
//     Attributes: {
//         'DelaySeconds': 0, 
//         'MessageRetentionPeriod': 345600
//     }
// }

// sqs.createQueue(params, (err, data) => {
//     if(err) { console.log('Error Creating Queue, ', err) }
//     console.log('Queue creation successful') 
// });

// Logic for Sending a message
let sendMessage = (messageBody, queueUrl) => {
  let params = {
    MessageBody: JSON.stringify(messageBody), 
    QueueUrl: queueUrl, 
    DelaySeconds: 0
  }
  return new Promise((resolve, reject) => {
    sqs.sendMessage(params, (err, data) => {
      if (err) { 
        console.log('Error sending message', err) 
        reject(err)
      } else { 
        console.log('Message send success, ', data)
        resolve(data);
      };
    });
  })
};

// let testMessage = {
//   dropOffLocationLat: 37.74086463144683,
//   dropOffLocationLong: -122.49291176761801,
//   pickupLocationLat: 37.75482926359066,
//   pickupLocationLong: -122.46571235616491,
//   price: "11.28",
//   priceTimestamp: "2017-10-18 08:38:05-07:00",
//   surgeMultiplier: 2.9,
//   userId: 62882
// }

// sendMessage(testMessage, queueUrl).then(data => console.log(data));

const server = app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
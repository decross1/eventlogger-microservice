const Koa = require('koa');
const bodyParser = require('koa-bodyparser')
const app = new Koa();
const AWS = require('aws-sdk');
const path = require('path');
const queueUrl = 'https://sqs.us-west-1.amazonaws.com/278687533626/eventlogger';
const faker = require('faker');
const db = require('../database/index.js');
const cities = require('../dataGen/cities.js');


const port = process.env.PORT || 3000;
AWS.config.loadFromPath(path.resolve(__dirname, '../config.json'));

// Turn on Body Parsing
app.use(bodyParser());

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
        reject(err)
      } else { 
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
//   price: "112.21",
//   priceTimestamp: "2017-10-18 08:38:05-07:00",
//   surgeMultiplier: 1.2,
//   userId: 218763
// }

// sendMessage(testMessage, queueUrl).then(data => console.log(data));

// Logic to receive messages from the queue
let receiveMessage = (queueUrl) => {
  let params = {
    QueueUrl: queueUrl, 
    VisibilityTimeout: 60
  }

  return new Promise((resolve, reject) => {
    sqs.receiveMessage(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// receiveMessage(queueUrl).then(data => console.log(data.Messages[0]));

let deleteMessage = (receiptId, queueUrl) => {
  let params = {
    QueueUrl: queueUrl, 
    ReceiptHandle: receiptId
  }
  
  return new Promise((resolve, reject) => {
    sqs.deleteMessage(params, (err, data) => {
      if(err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// receiveMessage(queueUrl)
//   .then((data) => {
//     var messageBody = JSON.parse(data.Messages[0].Body);
//     var receiptId = data.Messages[0].ReceiptHandle;
//     deleteMessage(receiptId, queueUrl);
//   });


const server = app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

// to map a single object to send to pricing. 
// db.getAvgSurge(cities.cities).then(results => { 
//   var test = results.map((obj) => obj.rows[0]);
//   console.log(test);
// });

db.insertAvgSurge();
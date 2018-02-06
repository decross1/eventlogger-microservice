require('newrelic');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const router = require('./router.js');
const AWS = require('aws-sdk');
const path = require('path');
const db = require('../database/index.js');
const cities = require('../dataGen/cities.js');
const data = require('../dataGen/datagen.js');


const port = process.env.PORT || 3000;
AWS.config.loadFromPath(path.resolve(__dirname, '../config.json'));

// Turn on Body Parsing
app.use(bodyParser());

// Allow routes 
app.use(router.routes()).use(router.allowedMethods());

const server = app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

// Logic for Creating a new queue;
let sqs = new AWS.SQS({
  apiVersion: '2012-11-05'
});

const queue = {
  ridematching: 'https://sqs.us-west-1.amazonaws.com/278687533626/eventlogger', 
  pricinginbox: 'https://sqs.us-west-1.amazonaws.com/278687533626/eventlogger', 
  pricingoutbox: 'https://sqs.us-west-1.amazonaws.com/278687533626/eventlogger'
}

let calculateConversionRatio = async () => {
  let results = {};
  let cityUsers =  await db.getUserCount();
  let matchedUsers = await db.getMatchedCount();
  
  cityUsers.rows.forEach(city => {
    results[city.city] = {
      totalusers: city.totalusers.low
    }
  })

  matchedUsers.rows.forEach(city => {
    Object.assign(results[city.city], {
      matchedrides: city.matchrides.low,
      conversionRatio: city.matchrides.low / results[city.city].totalusers
    })
  })

  console.log(results);
}

calculateConversionRatio();

// let receivePricingData = () => {
//   let message = await receiveMessage(queue.pricinginbox);
  
// }
// to map a single object to send to pricing. 
// db.getAvgSurge(cities.cities).then(results => { 
//   var test = results.map((obj) => obj.rows[0]);
//   console.log(test);
// });

// db.insertAvgSurge();

// var test = data.generateRandomPricingLog();
// console.log(test);
// db.insertPricingLogs(test.userId, test.city, test.surgeMultiplier, test.price, test.priceTimestamp);




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

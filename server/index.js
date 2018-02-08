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
const cron = require('node-cron');
const Consumer = require('sqs-consumer');


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
let sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const queue = {
  ridematching: 'https://sqs.us-west-1.amazonaws.com/278687533626/ridematching', 
  pricinginbox: 'https://sqs.us-west-1.amazonaws.com/278687533626/eventlogger', 
  driverinbox: 'https://sqs.us-west-1.amazonaws.com/278687533626/drivers', 
  pricingoutbox: 'https://sqs.us-west-1.amazonaws.com/278687533626/pricingoutbox'
}

// Logic for starting the consumer
const pricingInbox = Consumer.create({
  queueUrl: queue.pricinginbox, 
  batchSize: 10, 
  handleMessage: (message, done) => {
    if(JSON.parse(message.Body)) {
      let log = JSON.parse(message.Body);
      db.insertPricingLogs(log.userId, log.city, log.surgeMultiplier, log.price, log.priceTimestamp)
        .then(results => console.log('Pricing log insert completed'));
    }
    done();
  }, 
  sqs: sqs
});

pricingInbox.on('error', (err) => {
  console.log('Pricing Queue Error: ', err);
});

pricingInbox.on('empty', () => {
  console.log('Pricing Queue Emptied')
})

pricingInbox.start();

const rideMatchingInbox = Consumer.create({
  queueUrl: queue.ridematching, 
  batchSize: 10, 
  handleMessage: (message, done) => {
    if(JSON.parse(message.Body)) {
      let log = JSON.parse(message.Body);
      db.insertDriverLogs(log.userId, log.city, log.priceTimestamp)
       .then(results => {
        console.log('Ridematching insert completed')
        // calculateConversionRatio();
        });
    }
    done();
  }, 
  sqs: sqs
});

rideMatchingInbox.on('error', (err) => {
  console.log('RideMatching Queue Error: ', err);
});

rideMatchingInbox.on('empty', () => {
  console.log('RideMatching Queue Emptied')
})

rideMatchingInbox.start();

const driverInbox = Consumer.create({
  queueUrl: queue.driverinbox, 
  batchSize: 10, 
  handleMessage: (message, done) => {
    if(JSON.parse(message.Body)) {
      let log = JSON.parse(message.Body);
      db.insertAvgDrivers(log);
    }
    done();
  }, 
  sqs: sqs
});

driverInbox.on('error', (err) => {
  console.log('Pricing Queue Error: ', err);
});

driverInbox.on('empty', () => {
  console.log('Pricing Queue Emptied')
})

driverInbox.start();


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

let calculateConversionRatio = async () => {
  console.log('Ratio Calculation Started');
  let results = {};
  let cityUsers =  await db.getUserCount();
  let matchedUsers = await db.getMatchedCount();
  
  cityUsers.rows.forEach(city => {
    results[city.city] = {
      totalusers: city.totalusers.low,
      day: city.day, 
      timeinterval: city.timeinterval
    }
  })

  matchedUsers.rows.forEach(city => {
    Object.assign(results[city.city], {
      matchedrides: city.matchrides.low,
      conversionRatio: city.matchrides.low / results[city.city].totalusers
    })
  })

  for(city in results) {
    let day = results[city].day;
    let timeinterval = results[city].timeinterval;
    let conversionRatio = results[city].conversionRatio || 0;
    db.insertConversionRatio(day, city, timeinterval, conversionRatio)
     .then(results => console.log('Ratio Calculation Done'));
  }
}
// cron.schedule('*/1 * * * *', () => {
//   console.log('Running calculate conversion ratio')
//   calculateConversionRatio();
// });


// to map a single object to send to pricing. 
// db.getAvgSurge(cities.cities).then(results => { 
//   var test = results.map((obj) => obj.rows[0]);
//   console.log(test);
// });

// db.insertAvgSurge();


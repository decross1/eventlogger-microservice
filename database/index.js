const cassandra = require('cassandra-driver');
const fs = require('fs');

const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'], 
    keyspace: 'eventlogger'
});

client.connect((err) => {
    if(err) {
        console.log('Error connecting to Cassandra', err);
    }
    console.log('Connection to Cassandra successful');
});

// let eventLogTypeOneQuery = `INSERT INTO eventlogger.pricing_service_logs (userId, pickUpLocationLat, pickUpLocationLong, dropOffLocationLat, dropOffLocationLong, surgeMultiplier, price, priceTimeStamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

// let params = [ fakeData.sanFrancisco[0].userId, fakeData.sanFrancisco[0].pickupLocation[0], 
//             fakeData.sanFrancisco[0].pickupLocation[1], fakeData.sanFrancisco[0].dropOffLocation[0],                        
//             fakeData.sanFrancisco[0].dropOffLocation[1], fakeData.sanFrancisco[0].surgeMultiplier, 
//             fakeData.sanFrancisco[0].price, fakeData.sanFrancisco[0].timeStamp];


client.execute(eventLogTypeOneQuery, params, { prepare: true }, (err) => {
    if(err) { console.log('Error', err); }
    console.log('Insert Successful');
});

let getAvgSurge = (cityArray) => {
    let data = {};
    let timeInterval = moment().format('HH');
    let day = moment().format("YYYY-MM-DD");
    let query = `SELECT * FROM avg_surge_by_city where day = ${day} and city = ${city}`
    client.execute()
}

select city, avg(avgDrivers) from avg_drivers_by_city_vw where timeinterval = 1 
and city = 'Bath' and day > '2016-07-27' and day < '2016-08-01' group by city
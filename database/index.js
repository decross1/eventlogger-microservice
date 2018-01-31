const cassandra = require('cassandra-driver');
const fs = require('fs');
let fakeData = require('../dataGen/fakeData.json');

const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'], 
    keyspace: 'test'
});

client.connect((err) => {
    if(err) {
        console.log('Error connecting to Cassandra', err);
    }
    console.log('Connection to Cassandra successful');
});

let eventLogTypeOneQuery = `INSERT INTO eventlogger.pricing_service_logs (userId, pickUpLocationLat, pickUpLocationLong, dropOffLocationLat, dropOffLocationLong, surgeMultiplier, price, priceTimeStamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

let params = [ fakeData.sanFrancisco[0].userId, fakeData.sanFrancisco[0].pickupLocation[0], 
            fakeData.sanFrancisco[0].pickupLocation[1], fakeData.sanFrancisco[0].dropOffLocation[0],                        
            fakeData.sanFrancisco[0].dropOffLocation[1], fakeData.sanFrancisco[0].surgeMultiplier, 
            fakeData.sanFrancisco[0].price, fakeData.sanFrancisco[0].timeStamp];


client.execute(eventLogTypeOneQuery, params, { prepare: true }, (err) => {
    if(err) { console.log('Error', err); }
    console.log('Insert Successful');
});



// let queries = [];

// for (var cities in fakeData) {
//     var city = fakeData[cities];

//     for(var i = 0; i < city.length; i++) {
//         var event = city[i];
//         queries.push({ query: eventLogTypeOneQuery , params: [
//             cassandra.types.timeuuid(), 
//             event.userId, 
//             event.pickupLocation[0], 
//             event.pickupLocation[1], 
//             event.dropOffLocation[0], 
//             event.dropOffLocation[1], 
//             event.surgeMultiplier, 
//             parseFloat(event.price).toFixed(2), 
//             event.priceTimeStamp
//         ]})
//     }
// }
// const queryOptions = { prepare: true, consistency: cassandra.types.consistencies.quorum };
// client.batch(queries, queryOptions, (err) => {
//     if(err) { console.log('Error', err); }

//     console.log('Data updated on cluster');
// })

console.log('Completed Batch Writes');

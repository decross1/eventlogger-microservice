const cassandra = require('cassandra-driver');
const fs = require('fs');
const moment = require('moment');
const cities = require('../dataGen/cities.js');

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

let getAvgSurge = (cityArray) => { 
    return Promise.all(cityArray.map(city => {
        let query = 'SELECT * FROM avg_surge_by_city where day = ? and city = ? and timeinterval = ?'
        // let day = moment().format("YYYY-MM-DD");
        let day = '2016-11-23';
        let timeInterval = moment().format('HH');
        let params = [day, city, timeInterval];
        return client.execute(query, params, { prepare: true })
    }));
}

let getAvgDrivers = (cityArray) => {
    return Promise.all(cityArray.map(city => {
        let query = 'SELECT * FROM avg_drivers_by_city where day = ? and city = ? and timeinterval = ?';
        // let day = moment().format("YYYY-MM-DD");
        let day = '2018-02-02';
        let timeInterval = moment().format('HH');
        let params = [day, city, timeInterval];
        return client.execute(query, params, { prepare: true })
    }));
}

let aggregateAvgSurge = () => {
    let query = 'select city, avg(surgeMultiplier) as surgeMultipler from pricing_service_logs where day = ? and timeinterval = ? group by city';
    let day = '2018-02-02';
    let timeInterval = moment().format('HH');
    let params = [day, timeInterval];
    return client.execute(query, params, { prepare: true });
}

let insertAvgSurge = () => {
    aggregateAvgSurge()
        .then(data => {
            data.rows.forEach((cityObject) => {
                let query = 'INSERT INTO avg_surge_by_city (city, day, timeinterval, surgeMultiplier) values (?, ?, ?, ?)';
                let city = cityObject.city;
                let surgeMultipler = cityObject.surgemultipler;
                let day = moment().format("YYYY-MM-DD");
                let timeInterval = moment().format('HH');
                let params = [city, day, timeInterval, surgeMultipler];

                client.execute(query, params, { prepare: true });
            })
        })
}


module.exports = {
    getAvgSurge, 
    getAvgDrivers, 
    aggregateAvgSurge, 
    insertAvgSurge
}

var faker = require('faker');
var randomWorld = require('random-world');
var moment = require('moment');
const fs = require('fs');
const json2csv = require('json2csv');
const cities = require('./cities.js');

// Step 1: calculate distance using getDistanceFromLatLonInKm
// Step 2: calculate rideFare using calculateRidefare
// Note: fare doesn't include surge multiplier

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var radius = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = radius * c; // Distance in km
    return d.toFixed(2);
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }
  
  
  function calculateRidefare(distance) {
    var baseFare = 5;
    var fare = 0;
    if (distance <= 1) {
      return baseFare;
    } else if (distance > 1 && distance < 4) {
      fare = baseFare + 2 * distance; // $2/km 
    } else if (distance >=4 && distance < 8) {
      fare = baseFare + 1.8 * distance; // $1.7/km 
    } else if (distance >=8 && distance < 15) {
      fare = baseFare + 1.65 * distance; // $1.5/km 
    } else if (distance >=15 && distance < 25) {
      fare = baseFare + 1.4 * distance; // $1.7/km 
    } else if (distance >= 25) {
      fare = baseFare + 1.2 * distance; // $1.7/km 
    }
    return fare.toFixed(2);
  }

  let coordinates = {
  sanFrancisco: {
    latitude: [37.788164, 37.722025],
    longitude: [-122.508212, -122.370385]
  },
  seattle: {
    latitude: [47.732895, 47.553408],
    longitude: [-122.425989, -122.266016]
  },
  omaha: {
    latitude: [41.310582, 41.202976],
    longitude: [-96.117089, -95.939122]
  },
  lasVegas: {
    latitude: [36.189783, 36.145853],
    longitude: [-115.240241, -115.105658]
  },
  newYork: {
    latitude: [40.866646, 40.595648],
    longitude: [-74.211799, -73.73899]
  },
  portland: {
    latitude: [45.626458, 45.43942],
    longitude: [-122.828151, -122.523324]
  },
  austin: {
    latitude: [30.318942, 30.19113],
    longitude: [-97.819412, -97.620285]
  },
  losAngeles: {
    latitude: [34.25772, 33.959813],
    longitude: [-118.627374, -118.171441]
  },
  chicago: {
    latitude: [42.01093, 41.646129],
    longitude: [-87.865181, -87.524605]
  },
  phoenix: {
    latitude: [33.713689, 33.295646],
    longitude: [-112.335199, -111.820495]
  },
  philadelphia: {
    latitude: [40.072859, 39.918999],
    longitude: [-75.275969, -74.998564]
  },
  sanAntonio: {
    latitude: [29.662686, 29.292979],
    longitude: [-98.749273, -98.294027]
  },
  sanDiego: {
    latitude: [33.058199, 32.670338],
    longitude: [-117.272435, -117.017003]
  },
  dallas: {
    latitude: [32.951477, 32.65078],
    longitude: [-96.980117, -96.602462]
  },
  sanJose: {
    latitude: [37.396827, 37.248854],
    longitude: [-122.026161, -121.795448]
  },
  jacksonville: {
    latitude: [30.445009, 30.19518],
    longitude: [-81.7559, -81.518321]
  },
  columbus: {
    latitude: [40.087487, 39.873479],
    longitude: [-83.143272, -82.851104]
  },
  indianapolis: {
    latitude: [39.895695, 39.706052],
    longitude: [-86.312659, -86.043494]
  },
  fortWorth: {
    latitude: [32.952743, 32.588705],
    longitude: [-97.492601, -97.153605]
  },
  charlotte: {
    latitude: [35.335937, 35.098933],
    longitude: [-80.977853, -80.693582]
  },
  denver: {
    latitude: [39.792587, 39.650654],
    longitude: [-105.058574, -104.8567]
  },
  elPaso: {
    latitude: [31.984195, 31.660687],
    longitude: [-106.631893, -106.285137]
  },
  washingtonDC: {
    latitude: [38.980633, 38.820774],
    longitude: [-77.134054, -76.937959]
  },
  boston: {
    latitude: [42.36299, 42.259027],
    longitude: [-71.186585, -71.007714]
  },
  detroit: {
    latitude: [42.430407, 42.32719],
    longitude: [-83.285975, -82.92068]
  },
  nashville: {
    latitude: [36.360988, 36.080279],
    longitude: [-86.972129, -86.661422]
  },
  memphis: {
    latitude: [35.207688, 35.018122],
    longitude: [-90.075166, -89.813554]
  },
  oklahomaCity: {
    latitude: [35.626135, 35.313817],
    longitude: [-97.793003, -97.222401]
  },
  louisville: {
    latitude: [38.271786, 38.123124],
    longitude: [-85.870413, -85.471472]
  },
  baltimore: {
    latitude: [39.320816, 39.260636],
    longitude: [-76.708722, -76.552853]
  }
}

let randomCoordinates = (city) => {
  return [city.latitude[0] - Math.random() * (city.latitude[0] - city.latitude[1]), city.longitude[0] - Math.random() * (city.longitude[0] - city.longitude[1])]
}


let randomTimeBetween = (start, end, daysAgo) => {
    return moment(faker.date.between(moment().startOf('day').subtract(daysAgo, 'days').add(start, 'hour').format('YYYY-MM-DD HH:mm:ssZ'), moment().startOf('day').subtract(daysAgo, 'days').add(end, 'hour'))).format('YYYY-MM-DD HH:mm:ssZ');
  }

let timeIntervalsVolume = () => {
  let result = {};
  let peakTimes = [7, 8, 9, 11, 12, 13, 16, 17, 18];
  for (var i = 0; i < 24; i++) {
    result[i] = null;
  }

  for (var keys in result) {
    if(peakTimes.indexOf(parseInt(keys)) !== -1) {
      result[keys] = Math.ceil(Math.random() * (13000 - 5000) + 5000)
    } else {
      result[keys] = Math.ceil(Math.random() * (4000 - 2000) + 2000)
    }
  }

  return result;
 }


let generateRandomUserRides = (cityCoordinates) => {
  let cityArray = Object.keys(cityCoordinates);
  let bulk = [];
    
    for (var daysAgo = 15; daysAgo > 0; daysAgo--) {
      let timeIntervals = timeIntervalsVolume()

      for(var times in timeIntervals) {
        let time = parseInt(times);
        let rideVolume = timeIntervals[times];

        for (var i = 0; i <= rideVolume; i++) {
          let curCity = cityArray[Math.floor(Math.random() * cityArray.length)];
          let curLocation = randomCoordinates(cityCoordinates[curCity]);
          let destLocation = randomCoordinates(cityCoordinates[curCity])
          let distance = getDistanceFromLatLonInKm(curLocation[1], curLocation[0], destLocation[1], destLocation[0]);
          let priceCalc = calculateRidefare(distance);

          bulk.push({
            userId: faker.random.number() + faker.random.number(), 
            city: curCity, 
            // pickupLocationLat: curLocation[0],
            // pickupLocationLong: curLocation[1],
            // dropOffLocationLat: destLocation[0], 
            // dropOffLocationLong: destLocation[1], 
            surgeMultiplier: parseFloat((Math.random() * (3.0 - 1.0) + 1.0).toFixed(1)), 
            price: priceCalc, 
            timeInterval: time,
            day: moment(randomTimeBetween(time, time + 1, daysAgo)).format("YYYY-MM-DD"),
            priceTimestamp: randomTimeBetween(time, time + 1, daysAgo)
          })
        }
      }
    }
  return bulk;
}

// var fields = ['userId', 'city', /*'pickupLocationLat', 'pickupLocationLong', 'dropOffLocationLat', 'dropOffLocationLong', */
//               'surgeMultiplier', 'price', 'timeInterval', 'day', 'priceTimestamp']

// // To convert into CSV format
// var csv = json2csv({data: inserts, fields: fields });

// // Write the converted CSV to file
// fs.writeFile('./fakeData6.csv', csv, (err) => {
//   if (err) { console.log('Error', err )};
//   console.log('Successful CSV Write');
// })

let generateRandomPricingLog = () => {
  return {
    userId: faker.random.number() + faker.random.number(), 
    city: cities.cities[Math.ceil(Math.random() * cities.cities.length - 1)], 
    surgeMultiplier: parseFloat((Math.random() * (3.0 - 1.0) + 1.0).toFixed(1)), 
    price: (Math.random() * (35.00 - 3.00) + 3.00).toFixed(2), 
    priceTimestamp: moment().format('YYYY-MM-DD HH:mm:ssZ')
  }
}


let generateNumLogs = (num) => {
  let tests = [];

  for (var i = 0; i < num; i++) {
    let insert = generateRandomPricingLog();
    tests.push(insert);
  }

  return tests;
}

// var inserts = generateNumLogs(1000);
// var fields = ['userId', 'city', 'surgeMultiplier', 'price', 'priceTimestamp'];

// // To convert into CSV format
// var csv = json2csv({data: inserts, fields: fields });

// // Write the converted CSV to file
// fs.writeFile('./1000logs.csv', csv, (err) => {
//   if (err) { console.log('Error', err )};
//   console.log('Successful CSV Write');
// })


// var inserts = generateNumLogs(100000);
// var fields = ['userId', 'city', 'surgeMultiplier', 'price', 'priceTimestamp'];

// // To convert into CSV format
// var csv = json2csv({data: inserts, fields: fields });

// // Write the converted CSV to file
// fs.writeFile('./100000logs.csv', csv, (err) => {
//   if (err) { console.log('Error', err )};
//   console.log('Successful CSV Write');
// })

// var inserts = generateNumLogs(1000000);
// var fields = ['userId', 'city', 'surgeMultiplier', 'price', 'priceTimestamp'];

// // To convert into CSV format
// var csv = json2csv({data: inserts, fields: fields });

// // Write the converted CSV to file
// fs.writeFile('./1000000logs.csv', csv, (err) => {
//   if (err) { console.log('Error', err )};
//   console.log('Successful CSV Write');
// })

let generateRandomAvgSurgebyCity = () => {
  let cityArray = cities.cities;
  let bulk = [];
  cityArray.forEach((city) => {

    for (var daysAgo = 500; daysAgo > 250; daysAgo--) {
      let timeIntervals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
      timeIntervals.forEach((interval) => {
        bulk.push({
          city: city, 
          day: moment(randomTimeBetween(interval, interval + 1, daysAgo)).format("YYYY-MM-DD"),
          timeInterval: interval, 
          surgeMultiplier: parseFloat(parseFloat((Math.random() * (3.0 - 1.0) + 1.0).toFixed(1)))
        })
      })
    }
  })

  return bulk;
}

// let test = generateRandomAvgSurgebyCity();
// var fields = ['city', 'day', 'timeInterval', 'surgeMultiplier'];

// // To convert into CSV format
// var csv = json2csv({data: test, fields: fields });

// // Write the converted CSV to file
// fs.writeFile('./fakeAvgSurge1.csv', csv, (err) => {
//     if (err) { console.log('Error', err )};
//     console.log('Successful CSV Write');
//   })
  


let generateRandomDriversByCity = () => {
  let cityArray = cities.cities;
  let bulk = [];
  cityArray.forEach((city) => {
    let timeIntervals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    for(var daysAgo = 250; daysAgo > 0; daysAgo--) {
      timeIntervals.forEach((interval) => {
        bulk.push({
          city: city, 
          day: moment(randomTimeBetween(interval, interval + 1, daysAgo)).format("YYYY-MM-DD"),
          timeInterval: interval, 
          avgDrivers:  Math.ceil(Math.random() * (4500 - 500) + 500)
        })
      })
    }
  })
  return bulk;
}

// for (var i = 0; i < 1000; i++) { console.log(randomWorld.city({country: 'United States'}))};

// let test = generateRandomDriversByCity();
// var fields = ['city', 'day', 'timeInterval', 'avgDrivers'];

// // To convert into CSV format
// var csv = json2csv({data: test, fields: fields });

// // Write the converted CSV to file
// fs.writeFile('./fakeAvgDrivers2.csv', csv, (err) => {
//     if (err) { console.log('Error', err )};
//     console.log('Successful CSV Write');
//   })


let generateRandomRidesMatched = (cityCoordinates) => {
  let cityArray = Object.keys(cityCoordinates);
  let bulk = [];
    
    for (var daysAgo = 15; daysAgo > 0; daysAgo--) {
      let timeIntervals = timeIntervalsVolume()

      for(var times in timeIntervals) {
        let time = parseInt(times);
        let rideVolume = timeIntervals[times] * Math.random();

        for (var i = 0; i <= rideVolume; i++) {
          let curCity = cityArray[Math.floor(Math.random() * cityArray.length)];
 
          bulk.push({
            userId: faker.random.number() + faker.random.number(), 
            city: curCity, 
            timeInterval: time,
            day: moment(randomTimeBetween(time, time + 1, daysAgo)).format("YYYY-MM-DD"),
            priceTimestamp: randomTimeBetween(time, time + 1, daysAgo)
          })
        }
      }
    }
  return bulk;
}
// var inserts = generateRandomRidesMatched(coordinates);
// var fields = ['userId', 'city', 'timeInterval', 'day', 'priceTimestamp']

// // To convert into CSV format
// var csv = json2csv({data: inserts, fields: fields });

// // Write the converted CSV to file
// fs.writeFile('./ridematchinglogs.csv', csv, (err) => {
//   if (err) { console.log('Error', err )};
//   console.log('Successful CSV Write');
// })

module.exports = {
  generateRandomPricingLog
}
/* make sure you 
  * 1. keep the naming convention for this file of ______.test.js
  * 2. npm install jest
  * 3. organize into specific test suites (describe (test, test, test) etc.)
  * Matchers reference can be found here (.toBe, .not.toEqual, etc) 
  * https://facebook.github.io/jest/docs/en/using-matchers.html
use these if needed
beforeEach(() => {});
afterEach(() => {});
beforeAll(() => {});
afterAll(() => {});
*/

// ================= Tests for Database Functions  ==================
let db = require('../database/index.js');
let cities = require('../dataGen/cities.js');

test('Successful Query for Average Surge should return an array', () => {
    expect.assertions(1)

    return expect(typeof db.getAvgSurge(cities.cities)).toBe('object');
})

test('Average surge query should successfully return city, timeinterval, surge, and a timeStamp', () => {
    expect.assertions(4)

    return db.getAvgSurge(cities.cities).then(data => { 
        expect(data[0].rows[0].city).not.toBeUndefined()
        expect(data[0].rows[0].timeinterval).not.toBeUndefined()
        expect(data[0].rows[0].surgemultiplier).not.toBeUndefined()
        expect(data[0].rows[0].day).not.toBeUndefined()
    });
});

test('Successful Query for Average drivers should return an array', () => {
    expect.assertions(1);

    return expect(typeof db.getAvgDrivers(cities.cities)).toBe('object');
})

test('Successful Query for Aggregate Average Surge should return an array', () => {
    expect.assertions(1);

    return expect(typeof db.aggregateAvgSurge()).toBe('object');
})

test('Successful Query for number of users should return an array', () => {
    expect.assertions(1);

    return expect(typeof db.getUserCount()).toBe('object');
})

test('Successful Query for number of drivers should return an array', () => {
    expect.assertions(1);

    return expect(typeof db.getMatchedCount()).toBe('object');
})

test('Successful Query for conversion ratio should return an array', () => {
    expect.assertions(1);

    return expect(typeof db.getConversionRatio()).toBe('object');
})
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
let cities = require('../dataGen/cities.js');
let server = require('../server/index.js');
let moment = require('moment');

afterEach(() => {
  server.server.close();
})

test('this will be some test');
// test('SQS should contain all of the appropriate queues', () => {
//     expect.assertions(1);
//     const params = {
//         QueueName: 'https://sqs.us-west-1.amazonaws.com/278687533626/ridematching'
//     }
//     server.sqs.getQueueUrl(params, (err, data) => {
//         if (err) console.log('Error')
//         expect(data.not.toBeUndefined());
//         done();
//     })
// })
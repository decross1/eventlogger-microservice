// require('babel-core/register');  // May or may not need this?
const Koa = require('koa');
const app = new Koa();
const dataGen = require('../dataGen/datagen.js');

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Server listening on ${port}`);
})


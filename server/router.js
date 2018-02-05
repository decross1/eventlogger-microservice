const Router = require('koa-router');
const router = new Router();
const db = require('../database/index.js');

router.post('/pricinglogs', async (ctx) => {
    try {
        let { userId, city, price, priceTimestamp } = ctx.request.body;
        let surgeMultiplier = parseFloat(ctx.request.body.surgeMultiplier); 
        let pricinglog = await db.insertPricingLogs(userId, city, surgeMultiplier, price, priceTimestamp);
        if (pricinglog) {
            ctx.status = 201;
            ctx.body = {
                status: 'Successful Insert'
            };
        } else {
            ctx.status = 400;
            ctx.body = {
                status: 'Insert Error', 
                message: 'Failure on insert'
            }
        }
    }
    catch (err) {
        ctx.status = 400;
        ctx.body = {
          status: 'error',
          message: err.message || 'Sorry, an error on insert has occurred.'
        }
    }
})

module.exports = router;
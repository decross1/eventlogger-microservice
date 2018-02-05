const Router = require('koa-router');
const router = new Router();
const db = require('../database/index.js');

router.post('/pricinglogs', async ctx => {
    try {
        let userId = ctx.request.body.userId;
        let city = ctx.request.body.city; 
        let surgeMultiplier = parseFloat(ctx.request.body.surgeMultiplier); 
        let price = ctx.request.body.price;
        let priceTimestamp = ctx.request.body.priceTimestamp;
        let pricinglog = await db.insertPricingLogs(userId, city, surgeMultiplier, price, priceTimestamp)
        if (pricinglog.length) {
            ctx.status = 201;
            ctx.body = {
                status: 'Successful Insert', 
                data: pricinglog
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
        console.log('Error', err);
    }
})

module.exports = router;
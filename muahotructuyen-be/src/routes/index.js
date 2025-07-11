const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const OrderRouter = require('./OrderRouter')
const RequestPurchaseRouter = require('./RequestPurchaseRouter')
const routes = (app)=>{
    app.use('/api/user',UserRouter)
    app.use('/api/product',ProductRouter)
    app.use('/api/order',OrderRouter)
    app.use('/api/request-purchase',RequestPurchaseRouter)
}

module.exports = routes
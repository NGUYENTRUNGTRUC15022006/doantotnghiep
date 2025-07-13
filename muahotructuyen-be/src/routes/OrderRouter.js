const express = require("express");
const router = express.Router();
const OrderController = require('../controllers/OrderController')
const { authUserMiddleWare, authMiddleWare } = require("../middleware/authMiddleware");

router.post("/create", OrderController.createOrder);
router.get("/get-details-all/:id",authUserMiddleWare, OrderController.getDetailsAllOrder);
router.get("/get-details/:id",authUserMiddleWare, OrderController.getDetailsOrder);
router.delete("/cancle-order/:id", OrderController.cancleOrder);
router.get("/get-all-order", OrderController.getAllOrder);
router.put('/update-status/:id', authMiddleWare, OrderController.updateOrderStatus);

module.exports = router;

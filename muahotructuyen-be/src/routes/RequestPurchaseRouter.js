const express = require("express");
const RequestPurchaseController = require("../controllers/RequestPurchaseController");
const { authUserMiddleWare, authMiddleWare } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create",  RequestPurchaseController.createrequest);
router.get("/all", RequestPurchaseController.getAllRequests);
router.put("/update/:id", RequestPurchaseController.updateRequest);
router.delete("/delete/:id",  RequestPurchaseController.deleteRequest);

module.exports = router;
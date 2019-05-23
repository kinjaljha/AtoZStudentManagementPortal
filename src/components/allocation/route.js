const express = require("express");
const router = express.Router();
const auth = require("../../_helpers/auth");

const allocation_controller = require("./controller");

router.post("/", auth.authenticate, allocation_controller.allocate);
router.get("/", auth.authenticate, allocation_controller.getAllocations);
router.get("/:id", auth.authenticate, allocation_controller.getAllocation);
router.put("/:id", auth.authenticate, allocation_controller.updateAllocation);
router.delete(
    "/:id",
    auth.authenticate,
    allocation_controller.deleteAllocation
);

module.exports = router;

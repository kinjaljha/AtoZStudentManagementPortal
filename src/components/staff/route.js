const express = require("express");
const router = express.Router();
const auth = require("../../_helpers/auth");
const staff_controller = require("./controller");

router.get("/", auth.authenticate, staff_controller.getStaffs);
router.post("/", auth.authenticate, staff_controller.createStaff);
router.get("/:id", auth.authenticate, staff_controller.getStaff);
router.put("/:id", auth.authenticate, staff_controller.updateStaff);
router.delete("/:id", auth.authenticate, staff_controller.deleteStaff);

module.exports = router;

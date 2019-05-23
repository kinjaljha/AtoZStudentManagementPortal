const express = require("express");
const router = express.Router();
const auth = require("../../_helpers/auth");

const class_controller = require("./controller");

router.get("/", auth.authenticate, class_controller.getClasses);
router.post("/", auth.authenticate, class_controller.createClass);
router.get("/:id", auth.authenticate, class_controller.getClass);
router.put("/:id", auth.authenticate, class_controller.updateClass);
router.delete("/:id", auth.authenticate, class_controller.deleteClass);

module.exports = router;

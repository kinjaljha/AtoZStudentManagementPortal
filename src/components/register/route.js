const express = require("express");
const router = express.Router();
const auth = require("../../_helpers/auth");

const register_controller = require("./controller");

router.post("/register", register_controller.registerUser);
router.post("/login", register_controller.login);
router.get("/", auth.authenticate, register_controller.getUsers);
router.get("/:id", auth.authenticate, register_controller.getUser);
router.delete("/:id", auth.authenticate, register_controller.deleteUser);
router.put("/:id", auth.authenticate, register_controller.updateUser);

module.exports = router;

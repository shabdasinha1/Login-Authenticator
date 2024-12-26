const express = require("express");
const router = express.Router();
const auth = require("./../middleware/auth");
const appController = require("./../controllers/appController");


router.post("/register",appController.register);
router.post("/login",appController.login);
router.put("/update",auth.Auth,appController.updateProfile);
router.get("/get-user",auth.Auth,appController.getUser);
router.post("/send-otp",appController.sendOtp);
router.post("/verify-otp",appController.verifyOtp);
router.post("/reset-password",appController.reset);


module.exports = router;

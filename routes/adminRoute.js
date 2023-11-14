const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.post("/newuser", adminController.createNewUser);

router.get("/:adminId", adminController.getAllUsers);

// router.get("/fetch/:tid", serverController.findTicketbyId);

router.post("/auth", adminController.loginAdmin);



module.exports = router;

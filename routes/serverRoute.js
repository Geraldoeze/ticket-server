const express = require("express");
const serverController = require("../controllers/serverController");

const router = express.Router();

router.post("/auth", serverController.loginUser)

router.get("/", serverController.getAllTickets);

router.get("/fetch/:tid", serverController.findTicketbyId);

router.post("/add", serverController.addNewTicket);

router.patch("status/:tid", serverController.updateStatus);

router.delete("/delete/:tid", serverController.deleteTicket);

router.get("/create/:uid", serverController.createMessage);

router.post("/fetch", serverController.createMessage);

module.exports = router;

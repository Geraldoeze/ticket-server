const express = require("express");
const serverController = require("../controllers/serverController");

const router = express.Router();

router.post("/auth", serverController.loginUser)

router.get("/", serverController.getAllTickets);

router.get("/fetch/:tid", serverController.findTicketbyId);

router.post("/add", serverController.addNewTicket);

router.patch("status/:tid", serverController.updateStatus);

router.delete("/delete/:tid", serverController.deleteTicket);

router.post("/create/", serverController.createMessage);

router.get("/message/:userId", serverController.getMessages);

module.exports = router;

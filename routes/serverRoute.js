const express = require("express");
const serverController = require("../controllers/serverController");

const router = express.Router();

router.post("/auth", serverController.loginUser);

router.get("/:userId", serverController.getUserTickets);

router.get("/fetch/:tid", serverController.findTicketbyId);

router.post("/add", serverController.addNewTicket);

router.put("/status/:userId", serverController.updateStatus);

router.delete("/delete/:tid", serverController.deleteTicket);

router.post("/create/", serverController.createMessage);

router.get("/message/:ticketId", serverController.getMessages);

module.exports = router;

const express = require('express');
const serverController = require('../../controllers/user/user-controllers');
const { validateUserUpdate } = require('../../middleware/userValidation')

const router = express.Router();

router.get("/", serverController.getAllTickets);

router.get("/fetch/:tid", serverController.findTicketbyId);

router.post("/add", serverController.addNewTicket);

router.patch("/update", serverController.updateTicket)

router.delete("/delete", serverController.deleteTicket);
    



 
module.exports = router;
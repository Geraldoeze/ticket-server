const express = require('express');
const serverController = require('../controllers/serverController');


const router = express.Router();

router.get("/", serverController.getAllTickets);

router.get("/fetch/:tid", serverController.findTicketbyId);

router.post("/add", serverController.addNewTicket);

router.patch("/update", serverController.updateTicket)

router.delete("/delete/:tid", serverController.deleteTicket);
    



  
module.exports = router;
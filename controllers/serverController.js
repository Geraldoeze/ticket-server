const { getDb } = require("../database/mongoConnect");

require("dotenv").config();
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const User = require("../models/user");

exports.getUserTickets = async (req, res, next) => {
  const userId = req.params.userId;
  const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter (default to 1)
  const pageSize = parseInt(req.query.pageSize) || 5; // Define the number of items per page (default to 10)

  const db = await getDb();

  try {
    // Count the total number of tickets created by the user
    const totalTicketsCount = await db
      .collection("ticket")
      .estimatedDocumentCount({ userId: userId });

    // Calculate the number of pages available
    const numberOfPages = Math.ceil(totalTicketsCount / pageSize);

    // Skip the specified number of documents
    const tickets = await db
      .collection("ticket")
      .find({ userId: userId })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    if (tickets.length === 0) {
      return res.status(200).json({
        message: "No tickets created by this user",
        response: tickets,
        numberOfPages: numberOfPages,
      });
    }

    res.status(200).json({
      message: "Tickets created by this user",
      response: tickets,
      numberOfPages: numberOfPages,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fetching tickets failed", error: err.message });
  }
};

exports.findTicketbyId = async (req, res) => {
  const ticketId = req.params.tid;
  if (!ticketId) {
    return res.status(404).json({ message: "Ticked Id not found" });
  }
  try {
    // find ticket from db
    const ticket = await User.findById(ticketId);
    res.status(200).json({ message: "Ticket gotten", response: ticket });
  } catch (err) {
    res.status(501).json({ message: "Getting Ticket Failed.!! " });
  }
};

exports.addNewTicket = async (req, res) => {
  const db = await getDb();
  // const RandomId = 100000 + Math.floor(Math.random() * 900000);
  try {
    const {
      status,
      customer_name,
      phone_number,
      country,
      state,
      city,
      communication_mode,
      transfer_mode,
      action_request,
      description,
      date,
      customer_request,
      userId,
    } = req.body;

    const UserData = new User(
      status,
      customer_name,
      phone_number,
      country,
      state,
      city,
      communication_mode,
      transfer_mode,
      action_request,
      description,
      date,
      customer_request,
      userId
    );

    const saveUserData = await UserData.saveToDB();

    res.status(201).json({ message: "Ticket Created", response: saveUserData });
  } catch (err) {
    console.log(err);
  }
};

exports.updateStatus = async (req, res) => {
  const db = getDb();
  const { status } = req.body;
  const userNumber = req.params.userId;

  try {
    // Request Validation
    if (!status) {
      return res.status(400).json({ message: "Status field is required" });
    }

    const userId = new mongodb.ObjectId(userNumber);
    console.log(status, userId);
    const filter = { _id: userId };
    const update = { $set: { status: status } };

    const result = await db.collection("ticket").updateOne(filter, update);
    console.log(result);
    if (result.modifiedCount === 1) {
      return res.status(201).json({ message: "Updated Status" });
    } else {
      return res
        .status(404)
        .json({ message: "Ticket not found or status not updated" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteTicket = async (req, res) => {
  const tid = req.params.tid;
  console.log(tid);
  const db = getDb();
  if (!tid) {
    return res.status(404).json({ message: "Provide Id " });
  }
  try {
    await db.collection("ticket").deleteOne({ _id: new ObjectId(tid) });
    res.status(200).json({ message: "Ticket deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Delete Ticket Error", statusId: "SERVER ERROR" });
  }
};

// login handler
exports.loginUser = async (req, res) => {
  const db = getDb();

  try {
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      return res.status(400).json({ message: "All input is required" });
    }
    const authDetails = await db
      .collection("auth")
      .findOne({ username: username });
    console.log(authDetails);
    if (!authDetails) {
      return res.status(400).json({
        message: "Incorrect email or password.",
      });
    }

    // Simple password check
    if (authDetails.password !== password) {
      return res.status(400).json({
        message: "Incorrect Password!!",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      statusId: "SUCCESS!",
      userDetails: authDetails,
    });
  } catch (err) {
    console.log(err);
  }
};

// POST /messages
exports.createMessage = async (req, res) => {
  const db = getDb();
  const { ticketId, message } = req.body;
  console.log(ticketId)
  // Validate user input
  if (!ticketId || !message) {
    return res.status(400).json({ message: "All parameters are required" });
  }
  try {
    const existingTicket = await db
      .collection("messages")
      .findOne({ ticketId: ticketId });

    if (existingTicket) {
      // ticket exists already in the database, so update the message array
      await db.collection("messages").updateOne(
        { _id: new mongodb.ObjectId(existingTicket?._id) },
        {
          $push: {
            message: { comment: message?.comment, date: message?.date },
          },
        }
      );
      res.status(201).json({ message: "Updated User message" });
    } else {
      // Ticket has no message in the database
      // Create a new message document
      const messageDocument = {
        ticketId,
        message: [{ comment: message?.comment, date: message?.date }],
      };
 
      // Insert the message document into the database
      await db.collection("messages").insertOne(messageDocument);

      // Return a success response
      res.status(201).json({ message: "Message created successfully" });
    }
  } catch (err) {
    console.log(err);
  }
};

// GET /messages/:sender/:receiver
exports.getMessages = async (req, res) => {
  const db = getDb();
  const { ticketId } = req.params;
  if (!ticketId) {
    return res.status(404).json({ message: "No Ticket ID" });
  }
  // Find all messages between the specified sender and receiver
  const messages = await db
    .collection("messages")
    .findOne({ ticketId: ticketId });
  if (messages == null) {
    return res.status(200).json({ messageData: [] });
  }
  const messageData = messages?.message;
  // Return the messages
  res.status(200).json({ messageData });
};

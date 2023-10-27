const { getDb } = require("../database/mongoConnect");

require("dotenv").config();
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const User = require("../models/user");

exports.getAllTickets = async (req, res, next) => {
  try {
    // fetch all users from db
    const allUsers = await User.getAllUsers();
    res.status(200).json({ message: "Users gotten", response: allUsers });
  } catch (err) {
    res.status(501).json({ message: "Getting Tickets Failed.!! " });
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
      title,
      status,
      customer_name,
      phone_number,
      customer_type,
      location,
      priority,
      description,
      date,
      category,
    } = req.body;

    const UserData = new User(
      title,
      status,
      customer_name,
      priority,
      description,
      date,
      category,
      phone_number,
      customer_type,
      location
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
  const tid = req.params.tid;
  try {
    const updatedDocument = db
      .collection("ticket")
      .findOneAndUpdate(
        { _id: new mongodb.ObjectId(tid) },
        { $set: { status: status } }
      );

    if (updatedDocument) {
      res.status(201).json({ message: "Updated Status" });
    } else {
      // The document was not updated.
      res.status(501).json({ message: "Updating Status Failed.!! " });
    }
  } catch (err) {}
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
  const { userId, message } = req.body;

  // Validate user input
  if (!userId || !message) {
    return res.status(400).json({ message: "All input is required" });
  }
  try {
    const existingUser = await db
      .collection("messages")
      .findOne({ userId: userId });

    if (existingUser) {
      // user exists already on db, so update message array
      await db.collection("messages").updateOne(
        { _id: new mongodb.ObjectId(existingUser?._id) },
        {
          $set: {
            message: [{ comment: message?.commemt, date: message?.date }],
          },
        }
      );
      res.status(201).json({ message: "Updated User message" });
    } else {
      // User does not exist on db
      // Create a new message document
      const messageDocument = {
        userId,
        message: [{ data: message?.date, comment: message?.commemt }],
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

  const { userId } = req.params;

  // Find all messages between the specified sender and receiver
  const messages = await db
    .collection("messages")
    .find({ userId: userId })
    .toArray();

  // Return the messages
  res.status(200).json({ messages });
};

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

exports.updateTicket = async (req, res) => {};

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
exports.loginAdmin = async (req, res, next) => {
  const db = getDb();
  try {
    const { username, password } = req.body;
    console.log(username, password);
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
        statusId: "BAD REQUEST",
      });
    }

    try {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        authDetails.password
      );
      if (!isPasswordCorrect)
        return res.status(400).json({
          message: "Incorrect Password!!",
          statusId: "FAILED",
        });

      // setting up token
      const token = jwt.sign(
        { userId: authDetails._id.toString(), email: authDetails.email },
        process.env.JSONWEB_TOKEN,
        { expiresIn: "12h" }
      );
      return res.status(200).json({
        message: "LoginAdmin successful",
        statusId: "SUCCESS!",
        token: token,
        userDetails: authDetails,
      });
      // }
    } catch (err) {
      res.status(501).json({
        message: "Error Verifying User !!",
        statusId: "FAILED",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

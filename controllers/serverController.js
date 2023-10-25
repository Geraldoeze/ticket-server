const { getDb } = require("../../database/mongoConnect");

const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const User = require("../../models/user");

exports.getAllTickets = async (req, res, next) => {
  try {
    // fetch all users from db
    const allUsers = await User.getAllUsers();
    res.status(200).json({ message: "Users gotten", response: allUsers });
  } catch (err) {
    res.status(501).json({ message: "Getting Users Failed.!! " });
  }
};

exports.findTicketbyId = async (req, res) => {};

exports.addNewTicket = async (req, res) => {
  const db = await getDb();
  // const RandomId = 100000 + Math.floor(Math.random() * 900000);
  try {
    const { title, status, creator, priority, description, date, category } =
      req.body;

    //   Check if RegId  exist
    const _regUser = await db.collection("users").findOne({ matric: matric });

    if (_regUser) {
      //  A user exists with this RegId,
      return res.status(400).json({
        statusId: "Matric No",
        message: "Matric No exists already, change it or Try again. !!!",
      });
    }

    // save user data to user database model
    const UserData = new User(
      title,
      status,
      creator,
      priority,
      description,
      date,
      category,
      id
    );

    const saveUserData = await UserData.saveToDB();

    res.status(201).json({ message: "Users Created", response: saveUserData });
  } catch (err) {
    console.log(err);
  }
};

exports.updateTicket = async (req, res) => {};
exports.deleteTicket = async (req, res) => {};

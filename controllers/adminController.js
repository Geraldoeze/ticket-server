const Admin = require("../models/admin");

exports.createNewUser = async (req, res) => {
  const db = await getDb();
  try {
    const { password, username, userId, email } = req.body;

    const NewUser = new Admin(username, email, password, userId);

    const saveUser = await NewUser.saveToDB();

    res.status(201).json({ message: "User Created", response: saveUser });
  } catch (err) {
    console.log(err);
  }
};

exports.getAllUsers = async (req, res) => {
  const adminId = req.params.adminId;
  const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter (default to 1)
  const pageSize = parseInt(req.query.pageSize) || 5; // Define the number of items per page (default to 10)

  const db = await getDb();

  try {
    // Count the total number of tickets created by the user
    const totalTicketsCount = await db
      .collection("auth")
      .estimatedDocumentCount({ adminId: adminId });

    // Calculate the number of pages available
    const numberOfPages = Math.ceil(totalTicketsCount / pageSize);

    // Skip the specified number of documents
    const users = await db
      .collection("auth")
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    if (users.length === 0) {
      return res.status(200).json({
        message: "No user created by Admin",
        response: users,
        numberOfPages: numberOfPages,
      });
    }

    res.status(200).json({
      message: "Users created by Admin",
      response: users,
      numberOfPages: numberOfPages,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fetching Users failed", error: err.message });
  }
};

exports.loginAdmin = async (req, res) => {
  const db = getDb();
  try {
    const { username, password } = req.body;
    console.log(req.body)
    // Validate user input
    if (!(username && password)) {
      return res.status(400).json({ message: "All input is required" });
    }
    const authDetails = await db
      .collection("admin")
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
      adminDetails: authDetails,
    });
  } catch (err) {
    console.log(err);
  }
};

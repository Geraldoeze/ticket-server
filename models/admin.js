const mongodb = require("mongodb");
const { getDb } = require("../database/mongoConnect");

class Admin {
  constructor(
    username,
    email,
    password,
    id
  ) {
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.password = password;
    this.username = username;
    this.email = email;
  }

  // the static key enables me call getAllUsers directly on the class itself
  static getAllUsers() {
    const db = getDb();
    return db
      .collection("auth")
      .find()
      .toArray()
      .then((users) => {
        return users;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async saveToDB(adminId) {
    const db = getDb();
  
    // Check if adminId exists in the database
    const adminExists = await db.collection("admin").find({ _id: new mongodb.ObjectId(adminId) })
  
    if (adminExists) {
      // If adminId exists, execute the saveToDB function
      return db.collection("auth").insertOne(this);
    } else {
      // If adminId doesn't exist, you might want to handle this case accordingly
      console.error(`Admin with ID ${adminId} not found in the database.`);
      // You can throw an error, log a message, or handle it based on your requirements.
      // For now, let's just return a message indicating that the adminId doesn't exist.
      return Promise.reject(`Admin with ID ${adminId} not found in the database.`);
    }
  }
  

  static findById(Id) {
    const db = getDb();
    return db
      .collection("auth")
      .find({ _id: new mongodb.ObjectId(Id) })
      .next()
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Admin;

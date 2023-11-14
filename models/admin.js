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
    this.userId = userId;
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

  saveToDB() {
    const db = getDb();
    return db.collection("auth").insertOne(this);
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

const mongodb = require("mongodb");
const { getDb } = require("../database/mongoConnect");

class Users {
  constructor(
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
    email,
    userId,
    id
  ) {
    this.customer_name = customer_name;
    this.status = status;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.date = date;
    this.description = description;
    this.phone_number = phone_number;
    this.country = country;
    this.state = state;
    this.city = city;
    this.communication_mode = communication_mode;
    this.transfer_mode = transfer_mode;
    this.action_request = action_request;
    this.customer_request = customer_request;
    this.email = email;
    this.userId = userId;
  }

  // the static key enables me call getAllUsers directly on the class itself
  static getAllUsers() {
    const db = getDb();
    return db
      .collection("ticket")
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
    return db.collection("ticket").insertOne(this);
  }

  static findById(Id) {
    const db = getDb();
    return db
      .collection("ticket")
      .find({ _id: new mongodb.ObjectId(Id) })
      .next()
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Users;

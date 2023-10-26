const mongodb = require("mongodb");
const { getDb } = require("../database/mongoConnect");

class Users {
  constructor(
    title,
    status,
    customer_name,
    priority,
    description,
    date,
    category,
    phone_number,
    customer_type,
    location,
    id
  ) {
    this.title = title;
    this.customer_name = customer_name;
    this.status = status;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.priority = priority;
    this.date = date;
    this.description = description;
    this.category = category;
    this.phone_number = phone_number;
    this.customer_type = customer_type;
    this.location = location;
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

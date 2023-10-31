const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
require('dotenv').config();

let _db;
const MONGODB_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@dotsafetyuser.mklfc.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`;
const mongoConnect = (callback) => {
  MongoClient.connect(MONGODB_URL, { useNewUrlParser: true })
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;
// "DATABASE": "node-cluster",
//     "COLLECTION": "tickets-db",
//     "MONGO_USER": "gerald",
//     "MONGO_PASSWORD": "GZ3r0pV0toPBWmCV"
// const MONGODB_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.DATABASE}.uktzq.mongodb.net/${process.env.COLLECTION}?retryWrites=true&w=majority`;
const MONGODB_URL = `mongodb+srv://gerald:GZ3r0pV0toPBWmCV@node-cluster.uktzq.mongodb.net/tickets-db?retryWrites=true&w=majority`;
// const MONGODB_URL = "mongodb://localhost:27017/StudentAdmin";
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

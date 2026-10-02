require("dotenv").config();

const mongodb = require("mongodb");
const { MongoClient } = mongodb;

const client = new MongoClient(process.env.MONGO_URI);
let _db;

const mongoConnect = (callback) => {
  client
    .connect()
    .then((client) => {
      console.log("Mongodb Connected");
      _db = client.db("shop");
      callback();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDb = () => {
  if (!_db) throw new Error("call Connectdb() first");
  return _db;
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

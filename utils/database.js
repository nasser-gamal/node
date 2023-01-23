const mongodb = require("mongodb");

const monogClient = mongodb.MongoClient;

let _db;

exports.mongoConnect = (callback) => {
  monogClient
    .connect(
      "mongodb+srv://nasser:74neverforget@cluster0.vhixoru.mongodb.net/shop?retryWrites=true&w=majority"
    )
    .then((client) => {
      _db = client.db();
      console.log("Connected Successfully");
      callback(client);
    })
    .catch((err) => console.log(err));
};

exports.getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No Database Found!";
};

const MongoClient = require('mongodb').MongoClient;

const url = process.env.DB_URL || 'mongodb://localhost:27017/deals';
let database;
const client = new MongoClient(url);

exports.getConnection = () => (database ? Promise.resolve(database)
  : new Promise((resolve, reject) => {
    client.connect((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(database = client.db());
      }
    });
  }));

exports.closeConnection = () => {
  database = undefined;
  client.close();
};

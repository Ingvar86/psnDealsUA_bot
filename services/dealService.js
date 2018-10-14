const connect = require('./connectionService');

const collectionName = 'deals';

exports.getDeals = async () => {
  const db = await connect.getConnection();
  return db.collection(collectionName).find().toArray();
};

exports.updateDeals = async (deals) => {
  const db = await connect.getConnection();
  return new Promise((resolve, reject) => {
    db.collection(collectionName).deleteMany({}, (err) => {
      if (err) {
        reject(err);
      } else {
        db.collection(collectionName).insertMany(deals, (insertErr) => {
          if (insertErr) {
            reject(insertErr);
          } else {
            resolve();
          }
        });
      }
    });
  });
};

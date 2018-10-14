const connect = require('../services/connectionService');

async function getChats() {
  const db = await connect.getConnection();
  return db.collection('chats').find().toArray();
}

async function saveChat(chatId) {
  const db = await connect.getConnection();
  return db.collection('chats').updateOne({ chatId }, { $set: { chatId } }, { upsert: true });
}

async function deleteChat(chatId) {
  const db = await connect.getConnection();
  return db.collection('chats').deleteOne({ chatId });
}

exports.getChats = getChats;
exports.saveChat = saveChat;
exports.deleteChat = deleteChat;

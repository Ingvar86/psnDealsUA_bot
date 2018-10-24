const TelegramBot = require('node-telegram-bot-api');
const chatService = require('../services/chatService');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN;
let bot;
// Create a bot that uses 'polling' to fetch new updates
if (process.env.NODE_ENV === 'production') {
  bot = new TelegramBot(token);
} else {
  bot = new TelegramBot(token, { polling: true });
}

// temporary

// Matches "/start"
bot.onText(/\/start/, (msg) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  chatService.saveChat(chatId);
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, 'notification on');
});

// Matches "/end"
bot.onText(/\/stop/, (msg) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  chatService.deleteChat(chatId);
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, 'notification off');
});

// Listen for any kind of message. There are different kinds of
// messages.
// bot.on('message', function (msg) {
//   var chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   // bot.sendMessage(chatId, "Received your message");
// });

bot.notifyAll = (messages, options) => chatService.getChats().then((chats) => {
  chats.forEach((chat) => {
    messages.forEach(async (m) => {
      await bot.sendMessage(chat.chatId, m, options);
    });
  });
});

module.exports = bot;

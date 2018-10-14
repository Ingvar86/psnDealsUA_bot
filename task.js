const winston = require('winston');
const psnService = require('./services/psnService');
const dealService = require('./services/dealService');
const bot = require('./telegram/bot');
const connectionService = require('./services/connectionService');

winston.level = process.env.DEBUG_LEVEL || 'info';

const getMessages = (deals) => {
  const storeUrl = 'https://store.playstation.com/ru-ua/product';
  const messages = [];
  let message = `<b>${deals.length} New Sales</b>\n`;
  deals.forEach((deal) => {
    try {
      if (message.length > 4000) {
        messages.push(message);
        message = '';
      }
      const { prices } = deal;
      const actualPrice = prices['non-plus-user']['actual-price'];
      const discount = prices['non-plus-user']['discount-percentage'];

      const actualPlusPrice = prices['plus-user']['actual-price'];
      const plusDiscount = prices['plus-user']['discount-percentage'];

      const price = prices['non-plus-user']['strikethrough-price'];

      message += `\n<a href='${storeUrl}/${deal._id}'>${deal.name}</a>\n`;
      message += `-${discount}% ${price.display} -> ${actualPrice.display}\n`;
      if (actualPrice.value !== actualPlusPrice.value) {
        message += `-${plusDiscount}% ${price.display} -> ${actualPlusPrice.display} (PS+)\n`;
      }
    } catch (err) {
      winston.error('Parse error: ', JSON.stringify(deal));
    }
  });
  return messages;
};

const sendDeals = (deals) => {
  const messages = getMessages(deals);
  return bot.notifyAll(messages, { parse_mode: 'HTML', disable_web_page_preview: true });
};

psnService.getDeals().then(deals => dealService.getDeals().then((oldDeals) => {
  const newDeals = deals.filter(deal => !oldDeals.find(x => x._id === deal._id));
  if (newDeals.length > 0) {
    return sendDeals(newDeals).then(() => dealService.updateDeals(deals));
  }
  return Promise.resolve();
}))
  .then(() => connectionService.closeConnection())
  .catch((error) => {
    connectionService.closeConnection();
    winston.error(error);
  });

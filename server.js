const express = require('express');
const bodyParser = require('body-parser');
const packageInfo = require('./package.json');
const bot = require('./telegram/bot.js');

const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ version: packageInfo.version });
});

app.post(`/${bot.token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
});

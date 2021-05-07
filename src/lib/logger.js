const fs = require('fs');

let Logger = (exports.Logger = {});
const date = new Date();
const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const infoStream = fs.createWriteStream(`../logs/info--${dateString}.txt`);

Logger.info = function(msg) {
  var message = `${new Date().toISOString()}: ${msg} \n`;
  infoStream.write(message);
};
const Snoowrap = require('snoowrap');
const { CommentStream } = require('snoostorm');
const path = require('path');
const env = require('dotenv').config({ path: path.resolve(__dirname, '../.env') }).parsed;
const equations = require('./lib/equation');
const validations = require('./lib/validation');
const writeReply = require('./lib/response');
const logger = require("./lib/logger").Logger;

const client = new Snoowrap({
  userAgent: env.username,
  clientId: env.clientId,
  clientSecret: env.clientSecret,
  username: env.username,
  password: env.password
});


const parseComments = (client) => {
  logger.info(`FixieBot was started`);
  const botStartedTime = Date.now() / 1000;
  const comments = new CommentStream(client, {
    subreddit: "testingground4bots",
    limit: 10,
    pollTime: 2000,
  });

  comments.on('item', comment => {
    const {id, created_utc, body, author, locked, link_url} = comment;
    const botWasInvoked = validations.checkForMention(body, env.username);
    const commentedAfterStart = created_utc > botStartedTime;

    if (botWasInvoked && commentedAfterStart) {
      logger.info(`FixieBot was called by /u/${author.name}`);
      const commandWasPassed = validations.checkForCommand(body) ? true : false;
      if (commandWasPassed) {
        const drivetrains = equations.getRatios(body);
        if (drivetrains.length > 0) {
          let response;

          if (!locked) {
            drivetrains.forEach(drivetrain => {
              const replyIntro = writeReply.writeIntro(author.name);
              const replyBody = writeReply.writeTechnicalInfo(drivetrain);
              const replyOutro = writeReply.writeOutro();
              response = `${replyIntro}\n ${replyBody}\n ${replyOutro}`;
            });

            comment.reply(response);
            logger.info(`FixieBot replied to /u/${author.name} -- ${link_url}${id}`);
          }
        }
      } else {
        logger.info(`ERROR: /u/${author.name} did not list a command`);
      }
    }
  })
}

parseComments(client);


const fs = require('fs');
const Snoowrap = require('snoowrap');
const { CommentStream } = require('snoostorm');
const path = require('path');
const env = require('dotenv').config({ path: path.resolve(__dirname, '../.env') }).parsed;
const equations = require('./lib/equation');
const validations = require('./lib/validation');
const writeReply = require('./lib/response');

const client = new Snoowrap({
  userAgent: env.username,
  clientId: env.clientId,
  clientSecret: env.clientSecret,
  username: env.username,
  password: env.password
});

const parseComments = (client) => {
  const botStartedTime = Date.now() / 1000;
  const comments = new CommentStream(client, {
    subreddit: "testingground4bots",
    limit: 10,
    pollTime: 2000,
  });

  comments.on('item', comment => {
    const botWasInvoked = validations.checkForMention(comment, env.username);
    const commentedAfterStart = comment.created_utc > botStartedTime;

    if (botWasInvoked && commentedAfterStart) {
      const commandWasPassed = validations.checkForCommand(comment) ? true : false;
      if (commandWasPassed) {
        const drivetrains = equations.getRatios(comment);
        if (drivetrains.length > 0) {
          const { author, locked } = comment;
          const authorRef = `/u/${author.name}`;
          let response;

          if (!locked) {
            drivetrains.forEach(drivetrain => {
              const intro = writeReply.writeIntro(authorRef);
              const body = writeReply.writeTechnicalInfo(drivetrain);
              const outro = writeReply.writeOutro();
              response = `${intro}\n ${body}\n ${outro}`;
            });

            comment.reply(response);
          }
        }
      }
    }
  })
}

parseComments(client);

// Order of operations
// 1. Check for comment streams that contain my name
// 2. Validate the request (are they asking for x/y/z) / check if already replied
// 3. Run gear calcs and store as variables
// 4. Mush it together to make a comment - reply with a tag


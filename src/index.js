require('dotenv').config({ path: "../.env" });

const Snoowrap = require('snoowrap');
const { CommentStream } = require('snoostorm');
const message = require('./lib/messages');
const logger = require("./lib/logger").Logger;

const reddit = new Snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.CLIENT_Id,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASS
});

(() => {
  logger.info(`${process.env.REDDIT_USER} was started...`);
  const stream = new CommentStream(reddit, {
    subreddit: process.env.SUBREDDIT,
    results: 100,
  });

  let commentIds = [];

  stream.on('item', async comment => {
    const wasSummoned = comment.body && comment.body.toLowerCase().includes(process.env.REDDIT_USER.toLowerCase()) ? true : false;

    if (wasSummoned) {
      const reply = await message.getReply(comment, commentIds);
      if (!reply) return;

      comment.reply(reply)
      .then(resp => {
        const botReplyLink = `${comment.link_url}${comment.id}`;
        logger.info(`${process.env.REDDIT_USER} replied to /u/${comment.author.name} -- ${botReplyLink}`);
      })
      .catch(err => {
        console.log(err);
      })
    }
  })
})();
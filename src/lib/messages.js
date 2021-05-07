const content = require('../config/content.json');
const equations = require('./equations.js');
const logger = require("./logger").Logger;

const hasCommand = (body) => {
  const regex = new RegExp(`(?<=ratio\\()(.+?)(?=\\))`, 'igm');
  return body.match(regex);
};

const formatReply = (id, author, commandPassed) => {
  const drivetrainValues = commandPassed.map(valueStr => {
    const values = valueStr.split(', ');
    return equations.calculateRatio(values)
  });

  const replyIntro = `${content.intro.greeting} /u/${author.name}, ${content.intro.phrase}`;
  let replyBody = '';
  const replyOutro = content.outro.phrase;

  drivetrainValues.forEach(drivetrain => {
    const { chainring, cog, basicGearRatio, singleSkidPatch, ambidexSkidPatch } = drivetrain;
    const headingString = `**${content.technical.chainring}(${chainring}) => ${content.technical.cog}(${cog})**`;
    const ratioString = `- *${content.technical.gearRatio}*: **${basicGearRatio}**`;
    const singlePatchString = `- *${content.technical.skidPatches}*: **${singleSkidPatch}**`;
    const ambidexPatchString = `- *${content.technical.ambiSkidPatches}*: **${ambidexSkidPatch}**`;

    replyBody += `\n ${headingString} \n ${ratioString} \n ${singlePatchString} \n ${ambidexPatchString} \n ---`;
  })

  return `${replyIntro} \n ${replyBody} \n ${replyOutro}`;
};

module.exports = {
  async getReply(comment, prevCommentIds = []) {
    const {id, author, body, replies} = comment;
    const commandPassed = hasCommand(body);
    let message = null;
    //TODO: Check to not reply to ourselves

    if (commandPassed) {
      const replyAuthors = await replies.fetchAll().map(reply => reply.author.name.toLowerCase());
      if (!replyAuthors.includes(process.env.REDDIT_USER.toLowerCase())) {
        // Only reply if we never commented
        message = formatReply(id, author, commandPassed);
        logger.info(`ERROR: ${process.env.REDDIT_USER} has replied to /u/${author.name} already -- ignoring comment.`);
      }
      logger.info(`${process.env.REDDIT_USER} summoned with the command ${commandPassed} by /u/${author.name}.`);
    } else {
      logger.info(`ERROR: ${process.env.REDDIT_USER} was summoned by /u/${author.name} without a command.`);
    }
    if (message) return message;
  }
}
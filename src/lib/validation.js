const validations = {
  checkForMention: (comment, username) => {
    const { body } = comment;
    if (body && body.toLowerCase().includes(`/u/${username}`)) {
      return true;
    }
  },
  checkForCommand: (comment) => {
    // FIXME: Check for 2 comma seperated numbers, empty parens will validate
    const regex = new RegExp(`(?<=ratio\\().*(?=\\))`, 'igm');
    return comment.body.match(regex);
  },

}

module.exports = validations;
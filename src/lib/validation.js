const validations = {
  checkForMention: (body, username) => {
    if (body && body.toLowerCase().includes(`/u/${username}`)) {
      return true;
    }
  },
  checkForCommand: (body) => {
    // FIXME: Check for 2 comma seperated numbers, empty parens will validate
    const regex = new RegExp(`(?<=ratio\\().*(?=\\))`, 'igm');
    return body.match(regex);
  },

}

module.exports = validations;
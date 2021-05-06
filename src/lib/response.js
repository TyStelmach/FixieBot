const content = require('../config/content.json');

const responses = {
  writeIntro: (author) => {
    return `${content.intro.greeting} /u/${author}, ${content.intro.phrase} \n`
  },
  writeTechnicalInfo: ({ chainring, cog, basicGearRatio, singleSkidPatch, ambidexSkidPatch }) => {
    const headingString = `**${content.technical.chainring}(${chainring}) => ${content.technical.cog}(${cog})**`;
    const ratioString = `- *${content.technical.gearRatio}*: **${basicGearRatio}**`;
    const singlePatchString = `- *${content.technical.skidPatches}*: **${singleSkidPatch}**`;
    const ambidexPatchString = `- *${content.technical.ambiSkidPatches}*: **${ambidexSkidPatch}**`;

    return `${headingString} \n ${ratioString} \n ${singlePatchString} \n ${ambidexPatchString} \n ---`;
  },
  writeOutro: () => {

  }
}

module.exports = responses;
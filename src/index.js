const fs = require('fs');
const Snoowrap = require('snoowrap');
const { CommentStream } = require('snoostorm');
const path = require('path');
const env = require('dotenv').config({ path: path.resolve(__dirname, '../.env') }).parsed;
const equations = require('./lib/equations');

const client = new Snoowrap({
    userAgent: env.username,
    clientId: env.clientId,
    clientSecret: env.clientSecret,
    username: env.username,
    password: env.password
});


const checkForMentions = (comment) => {
	const { body } = comment;
	if (body && body.toLowerCase().includes(`/u/${env.username}`)) {
		return true;
	};
};

const checkForCommand = (comment) => {
	// FIXME: Check for 2 comma seperated numbers, empty parens will validate
	const regex = new RegExp(`(?<=ratio\\().*(?=\\))`, 'igm');
	return comment.body.match(regex);
}

const getRatios = (comment) => {
	const passedRatios = checkForCommand(comment);
	
	const drivetrains = passedRatios.map(gearSet => {
		const ratio = gearSet.split(', ');
		const chainring = parseInt(ratio[0]);
		const cog = parseInt(ratio[1]);
		
		return {
			chainring,
			cog,
			basicGearRatio: (chainring/cog).toFixed(2),
			singleSkidPatch: equations.getSkidpatches(chainring, cog, false),
			ambidexSkidPatch: equations.getSkidpatches(chainring, cog, true)
		}
	});
	return drivetrains;
}

const writeResponse = ({chainring, cog, basicGearRatio, singleSkidPatch, ambidexSkidPatch}) => {
	const html = `**Chainring(${chainring}) => Cog(${cog})**\n`+
	`- *Gear Ratio*: **${basicGearRatio}** \n` +
	`- *Skid Patches(Single Foot)*: **${singleSkidPatch}** \n` +
	`- *Skid Patches(Ambidextrous)*: **${ambidexSkidPatch}** \n` +
	`---`
	return html;
};

const readSummonedComments = (client) => {
	const BOT_RUN = Date.now() / 1000;

	const comments = new CommentStream(client, {
			subreddit: "testingground4bots",
			limit: 10,
			pollTime: 2000,
	});

	comments.on('item', item => {
		const botWasSummoned =  checkForMentions(item);
		const commentedAfterRun = item.created_utc > BOT_RUN;

		// Commented after bot was run && bot was summoned via /u/ params
		if (botWasSummoned && commentedAfterRun) {
			const commandWasPassed = checkForCommand(item) ? true : false;
			if (commandWasPassed) {
				// Start getting calculations
				const drivetrainsArr = getRatios(item);
				if (drivetrainsArr) {
					const { author, locked } = item;
					const replyStatements = [];
					const greeting = `Hey [/u/${author.name}](https://www.reddit.com/user/${author.name}), this is what I figuered out about your gears: \n`;
					let response;
					const closing = '*beep - boop* I am a bot created by... for more information about fixed gear skidpatches and rations, check out these links...'
					if (!locked) {
						drivetrainsArr.forEach(drivetrain => {
							response = writeResponse(drivetrain);
						});

						item.reply(`${greeting}\n` + `${response}\n` + `${closing}`);
					}
				}
			}
		}
	});    
};

readSummonedComments(client);

// Order of operations
// 1. Check for comment streams that contain my name
// 2. Validate the request (are they asking for x/y/z) / check if already replied
// 3. Run gear calcs and store as variables
// 4. Mush it together to make a comment - reply with a tag


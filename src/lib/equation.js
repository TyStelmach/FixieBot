const validations = require('./validation');

const isNumEven = (number) => number % 2 == 0;

const reduceRatios = (chainring, cog) => {
	let gcr = (front, rear) => {
		return rear ? gcr(rear, front % rear) : front;
	};

	gcr = gcr(chainring, cog);
	return [chainring / gcr, cog / gcr];
};

const equations = {
	getRatios: (comment) => {
		const passedRatios = validations.checkForCommand(comment);
	
		const drivetrains = passedRatios.map(gearSet => {
			const ratio = gearSet.split(', ');
			const chainring = parseInt(ratio[0]);
			const cog = parseInt(ratio[1]);
	
			return {
				chainring,
				cog,
				basicGearRatio: (chainring / cog).toFixed(2),
				singleSkidPatch: equations.getSkidpatches(chainring, cog, false),
				ambidexSkidPatch: equations.getSkidpatches(chainring, cog, true)
			}
		});
		return drivetrains;
	},
	getSkidpatches: (chainring, cog, isAmbiSkidder) => {
		const reducedRatio = reduceRatios(chainring, cog);
		let skidpatches;
		if (isAmbiSkidder) {
			skidpatches = isNumEven(reducedRatio[0]) ? reducedRatio[1] : reducedRatio[1] * 2;
		} else {
			skidpatches = reducedRatio[1];
		}

		return skidpatches;
	}
};

module.exports = equations;
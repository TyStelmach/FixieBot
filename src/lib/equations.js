const isNumEven = (number) => number % 2 == 0;

const reduceRatios = (chainring, cog) => {
	let gcr = (front, rear) => {
		return rear ? gcr(rear, front % rear) : front;
	};

	gcr = gcr(chainring, cog);
	return [chainring / gcr, cog / gcr];
};

const getSkidpatches = (chainring, cog, isAmbiSkidder) => {
	const reducedRatio = reduceRatios(chainring, cog);
	let skidpatches;
	if (isAmbiSkidder) {
		skidpatches = isNumEven(reducedRatio[0]) ? reducedRatio[1] : reducedRatio[1] * 2;
	} else {
		skidpatches = reducedRatio[1];
	}

	return skidpatches;
}

module.exports = {
	calculateRatio(values) {
		const chainring = parseInt(values[0]);
		const cog = parseInt(values[1]);

		return {
			chainring,
			cog,
			basicGearRatio: (chainring / cog).toFixed(2),
			singleSkidPatch: getSkidpatches(chainring, cog, false),
			ambidexSkidPatch: getSkidpatches(chainring, cog, true)
		}

	}
}
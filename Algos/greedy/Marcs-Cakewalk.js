const solution = (calories) => {
	let min = 0;

	calories.sort((a, b) => b - a);

	for (let i = 0; i < calories.length; i++) {
		min = min + calories[i] * Math.pow(2, i);
	}

	return min;
};

const output = solution([1, 3, 2]);
console.log(output);

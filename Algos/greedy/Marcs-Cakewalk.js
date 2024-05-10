// link -> https://www.hackerrank.com/challenges/marcs-cakewalk/problem?isFullScreen=false

/**
 * @param calorie an array of integers containing the calorie counts for each cupcake
 * @returns a Long Number Type representing the minimum miles necessary
 */

function marcsCakewalk(calorie) {
	let min = 0;

	calorie.sort((a, b) => b - a);

	for (let i = 0; i < calorie.length; i++) {
		min = min + calorie[i] * Math.pow(2, i);
	}

	return min;
}

const output = marcsCakewalk([1, 3, 2]);
console.log(output);

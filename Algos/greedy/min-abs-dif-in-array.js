// link -> https://www.hackerrank.com/challenges/minimum-absolute-difference-in-an-array/problem?isFullScreen=false

/**
 * @param w an array of integers
 * @returns an Int representing the minimum absolute difference found
 */

function minimumAbsoluteDifference(arr) {
	arr.sort((a, b) => a - b);

	let currentMin = Math.abs(arr[0] - arr[1]);

	for (let i = 1; i < arr.length; i++) {
		let currentAbsDiff = Math.abs(arr[i] - arr[i + 1]);
		if (currentAbsDiff < currentMin) {
			currentMin = currentAbsDiff;
		}
	}

	return currentMin;
}

const output = minimumAbsoluteDifference([-59, -36, -13, 1, -53, -92, -2, -96, -54, 75]);
console.log(output);

// link -> https://www.hackerrank.com/challenges/priyanka-and-toys/problem?isFullScreen=false

/**
 * @param w an Int representing  Mark's budget
 * @returns the integer value of the number of containers Priyanka must contract to ship all of the toys.
 */

function toys(w) {
	w.sort((a, b) => a - b);

	let minContainers = 1;
	let minWeightRangeEnd = 4 + w[0];

	for (let i = 0; i < w.length; i++) {
		if (w[i] > minWeightRangeEnd) {
			minContainers++;
			minWeightRangeEnd = 4 + w[i];
		}
	}

	return minContainers;
}

const output = toys([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
console.log(output);

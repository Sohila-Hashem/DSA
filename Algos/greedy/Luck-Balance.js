// link -> https://www.hackerrank.com/challenges/luck-balance/problem?isFullScreen=false

/**
 * @param K the number of important contests Lena can lose
 * @param contests a 2D array of integers where each contests[i] contains two integers that represent the luck balance and importance of the ith contest
 * @returns an Integer representing the maximum luck balance achievable
 */
function luckBalance(k, contests) {
	let maxLuck = 0;

	contests.sort((a, b) => {
		return b[0] - a[0];
	});

	for (let i = 0; i < contests.length; i++) {
		if (contests[i][1]) {
			if (k) {
				maxLuck = maxLuck + contests[i][0];
				k--;
			} else {
				maxLuck = maxLuck - contests[i][0];
			}
		} else {
			maxLuck = maxLuck + contests[i][0];
		}
	}

	return maxLuck;
}

const output = luckBalance(3, [
	[5, 1],
	[2, 1],
	[1, 1],
	[8, 1],
	[10, 0],
	[5, 0],
]);
console.log(output);

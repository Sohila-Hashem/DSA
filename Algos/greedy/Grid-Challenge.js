// link -> https://www.hackerrank.com/challenges/grid-challenge/problem?isFullScreen=false

/**
 * @param grid: an array of strings
 * @returns either YES or NO
 */
function gridChallenge(grid) {
	for (let i = 0; i < grid.length; i++) {
		grid[i] = grid[i].split("").sort().join("");
	}

	for (let col = 0; col < grid.length; col++) {
		for (let row = 1; row < grid.length; row++) {
			if (grid[row - 1][col] > grid[row][col]) {
				return "NO";
			}
		}
	}

	return "YES";
}

// const output = gridChallenge(["ebacd", "fghij", "olmkn", "xywuv", "trpqs"]);
// const output = gridChallenge(["ebacd", "fghij", "olmkn", "trpqs", "xywuv"]);
// const output = gridChallenge(["abc", "lmp", "qrt"]);
// const output = gridChallenge(["mpxz", "abcd", "wlmf"]);
//  const output = gridChallenge(["abc", "hjk", "mpq", "rtv"]);
const output = gridChallenge(["rpb", "hot", "qra"]);
console.log(output);

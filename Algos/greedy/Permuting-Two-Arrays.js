// link -> https://www.hackerrank.com/challenges/two-arrays/problem?isFullScreen=false

/**
 * @param k: an integer
 * @param A[n]: an array of integers
 * @param B[n]: an array of integers
 * @returns string: either YES or NO
 */
function twoArrays(k, A, B) {
	A.sort((a, b) => a - b);
	B.sort((a, b) => b - a);

	for (let i = 0; i < A.length; i++) {
		if (!(A[i] + B[i] >= k)) {
			return "NO";
		}
	}

	return "YES";
}

// const output = twoArrays(5, [1, 2, 2, 1], [3, 3, 3, 4]);
const output = twoArrays(5, [7, 8, 9], [2, 1, 3]);
console.log(output);

// link -> https://www.hackerrank.com/challenges/mark-and-toys/problem?isFullScreen=false

/**
 * @param prices an array of Int containing the toy prices
 * @param k an Int representing  Mark's budget
 * @returns an Integer representing the maximum number of toys
 */
function maximumToys(prices, k) {
	let minToys = 0;

	prices.sort((a, b) => a - b);

	for (let i = 0; i < prices.length; i++) {
		if (k - prices[i] < 0) break;

		k -= prices[i];
		minToys++;
	}

	return minToys;
}

const output = maximumToys([1, 12, 5, 111, 200, 1000, 10], 50);
console.log(output);

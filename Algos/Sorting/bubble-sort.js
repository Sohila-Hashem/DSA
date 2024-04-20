// bubble sort can be used to sort an unsorted array
// it's time complexity is O(N^2)

const arr = [1, 8, 9, 11, 2, 6, 0, 10, 12, 7, 13, 3, 0, -20, 5, 4, 14, 15, 16];
const sorted = [
    -20, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
];

const bubbleSort = (arr) => {
    let operationsCounter = 0;
    // loop on the arr N times to keep checking for sorting
    for (let i = 0; i < arr.length - 1; i++) {
        // this is used to check if there was no operations made
        // after the first whole iteration
        // in case of a sorted array already
        if (operationsCounter === 0 && i === 1) {
            break;
        }
        // the inner loop will keep checking
        // for the two adjacent pairs if they sorted
        // until the end of the array - 1 - i (as a sort of optimization)
        // and that's since they will already be sorted after each iteration.
        for (let j = 0; j < arr.length - 1 - i; j++) {
            // check if the adjacent arr value is less than
            // the current one in the sub-loop (the preceding value)
            if (arr[j + 1] < arr[j]) {
                // if true than swap them
                [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
                operationsCounter++;
            }
        }
    }
    return arr;
};

console.log("Final array: ", bubbleSort(arr));

// insertion sort can be used to sort an unsorted array
// it's time complexity is O(N^2)

const arr = [8, 1, 9, 11, 2, 6, 0, 10, 12, 7, 13, 3, 0, -20, 5, 4, 14, 15, 16];

const insertionSort = (arr) => {
    // first create an outer loop to traverse on each element
    // it will start from the second index (1)
    for (let i = 1; i < arr.length; i++) {
        // inner loop created to traverse backward through the
        // beginning of the array from thr current index of the outer loop
        // and in each iteration it will keep checking from the smaller
        // number between the current index value and the preceding
        // index value in the array, until all sorted.
        for (let j = i; j > 0; j--) {
            // if the current index value is less than the preceding
            // index value, swap the values and so till the beginning of the array.
            if (arr[j] < arr[j - 1]) {
                [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
            }
        }
    }
    return arr;
};

console.log("Final array: ", insertionSort(arr));

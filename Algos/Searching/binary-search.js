// Binary Search can be used to find an element
// in a sorted array
// it's time complexity is O(logN) - very good

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const target = 3;

let binarySearch = function (arr, target) {
    let start = 0;
    let end = arr.length - 1;

    while (start <= end) {
        let mid = Math.floor((start + end) / 2);

        if (arr[mid] === target) return true;
        else if (target > arr[mid]) start = mid + 1;
        else end = mid - 1;
    }

    return false;
};

console.log(binarySearch(arr, target));

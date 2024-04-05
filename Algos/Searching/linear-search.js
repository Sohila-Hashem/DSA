// Binary Search can be used to find an element
// in an unsorted array
// it's time complexity is O(N) - good
const arr = [1, 5, 4, 2, 10, 7, 9, 3, 8, 6];
const target = 6;

const linearSearch = (arr, target) => {
    let i = 0;
    while (i < arr.length) {
        if (target === arr[i]) return true;
        i++;
    }
    return false;
};

console.log(linearSearch(arr, target));

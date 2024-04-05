// average time complexity of O(N*logN) and worst case time complexity of O(N*2)
const arr = [8, 1, 9, 11, 2, 6, 0, 10, 12, 7, 13, 3, 0, -20, 5, 4, 14, 15, 16];

const quickSort = (arr) => {
    if (arr.length <= 1) return arr;

    let pivot = arr[0];
    let smallerNums = [];
    let greaterNums = [];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < pivot) {
            smallerNums.push(arr[i]);
        } else {
            greaterNums.push(arr[i]);
        }
    }

    return [...quickSort(smallerNums), pivot, ...quickSort(greaterNums)];

    // [(1,2,6,0,7,3,0,-20,5,4),"8",(9,11,10,12,13,14,15,16)]
    // [(0,0,-20),"1",(2,6,7,3,5,4)] / [(),"9",(11,10,12,13,14,15,16)]
    // [()"0"(-20)] / [()"2"(6,7,3,5,4)] / [()] / [(10)"11"(12,13,14,15,16)]
    // [()] / [()] / [()] / [(3,5,4)"6"(7)] / [()] / [()] / [()"12"(13,14,15,16)]
    // ...
};

console.log("Final Array:", quickSort(arr));

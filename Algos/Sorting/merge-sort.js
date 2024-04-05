// average and worst time complexity of O(N*logN) and worst case time complexity of O(N*logN)
// space complexity of O(N)

const arr = [8, 1, 9, 11, 2, 6, 0, 10, 12, 7, 13];

const mergeSort = (arr) => {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);

    const leftArr = mergeSort(arr.slice(0, mid));
    const rightArr = mergeSort(arr.slice(mid, arr.length));

    return merge(leftArr, rightArr);
};

const merge = (leftArr, rightArr) => {
    const sortedArr = [];
    let i = 0;
    let j = 0;

    while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] < rightArr[j]) {
            sortedArr.push(leftArr[i]);
            i++;
        } else {
            sortedArr.push(rightArr[j]);
            j++;
        }
    }

    while (i < leftArr.length) {
        sortedArr.push(leftArr[i]);
        i++;
    }

    while (j < rightArr.length) {
        sortedArr.push(rightArr[j]);
        j++;
    }

    return sortedArr;
};

console.log("Final Array:", mergeSort(arr));

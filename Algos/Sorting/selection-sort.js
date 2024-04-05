// selection sort can be used to sort an unsorted array
// it's time complexity is O(N^2) - bad

const arr = [1, 8, 9, 11, 2, 6, 0, 10, 12, 7, 13, 3, 0, -20, 5, 4, 14, 15, 16];

const selectionSort = (arr) => {
    // create an outer loop to traverse through the whole array
    for (let i = 0; i < arr.length; i++) {
        // setting the min index that will act as
        // in each sub-iteration, starting at the first
        // index of the array
        let min = i;
        // creating a sub-loop to traverse each element
        // in the array, just looking for the index
        // of the minimum value at each sub-iteration
        for (let j = i; j < arr.length - 1; j++) {
            // here we check if the current value of the index
            // is less than the value stored in minimum index in the array
            if (arr[j + 1] < arr[min]) {
                // if say so then set the current index to be
                // the index pointing to the minimum value
                min = j + 1;
            }
        }
        // after each iteration is done, we compare the value
        // of the current index in the outer loop to the value
        // stored in the minimum var pointing to a specific index in the array
        if (arr[i] > arr[min]) {
            // if say so then swap the elements

            //* USING JS ARRAY DESTRUCTURE (ES6)
            [arr[min], arr[i]] = [arr[i], arr[min]];

            //* USING NORMAL SWAP TECHNIQUE
            // let temp = arr[min];
            // arr[min] = arr[i];
            // arr[i] = temp;
        }
    }
    return arr;
};

console.log("Final array: ", selectionSort(arr));

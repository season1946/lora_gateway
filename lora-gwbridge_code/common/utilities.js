let obj = {};

// Use this generic function to quickly search a sorted array for a given simple value,
// such as a string or a number. Note that "endIndex" is non-inclusive. I.e.: if you had
// an array named "myArr":
//
//     Index: 0    1    2    3    4
//     Value: "a", "b", "c", "d", "e"
//
// and you wanted to search it for the element "c", you would call:
//
//     partitionSearchSortedArray("c", myArr, 0, myArr.length);
//
obj.partitionSearchSortedArray = function(valueToFind, inputArr, startIndex, endIndex) {
    // logger.info(valueToFind, inputArr, startIndex, endIndex)
    if ((endIndex - startIndex) <= 3) {
        for (let i = startIndex; i < endIndex; i++) {
            // logger.warn(i)
            if (inputArr[i] === valueToFind) {
                // logger.error(inputArr[i])
                // logger.error(valueToFind)
                return i;
            }
        }
        return -1;
    } else {
        let pivotIndex = startIndex + Math.floor((endIndex - startIndex) / 2);
        let pivot = inputArr[pivotIndex];
        if (valueToFind === pivot) {
            return pivotIndex;
        } else if (valueToFind < pivot) {
            return callPartitionSearchSortedArray(valueToFind, inputArr, startIndex, pivotIndex);
        } else { // valueToFind > pivot
            return callPartitionSearchSortedArray(valueToFind, inputArr, pivotIndex, endIndex);
        }
    }
};

// This function is just here to solve the self-dependency problem
function callPartitionSearchSortedArray(valueToFind, inputArr, startIndex, pivotIndex) {
    return obj.partitionSearchSortedArray(valueToFind, inputArr, startIndex, pivotIndex);
}

function getPositionToInsertIntoSortedArray(valueToInsert, array, startIndex, endIndex) {
    if ((endIndex - startIndex) === 0) { // If it's an empty array
        return startIndex;
    } else if ((endIndex - startIndex) === 1) { // If there's only one element left
        if (valueToInsert <= array[startIndex]) {
            return startIndex;
        } else {
            return endIndex;
        }
    } else { // Else, recursively cut the array in half to find insertion index
        let pivotIndex = startIndex + Math.floor((endIndex - startIndex) / 2);
        let pivot = array[pivotIndex];
        if (valueToInsert === pivot) {
            return pivotIndex;
        } else if (valueToInsert < pivot) {
            return getPositionToInsertIntoSortedArray(valueToInsert, array, startIndex, pivotIndex);
        } else { // valueToInsert > pivot
            return getPositionToInsertIntoSortedArray(valueToInsert, array, pivotIndex, endIndex);
        }
    }
}

obj.insertIntoSortedArray = function(valueToInsert, array) {
    let insertedAtIndex = getPositionToInsertIntoSortedArray(valueToInsert, array, 0, array.length);
    array.splice(insertedAtIndex, 0, valueToInsert);
    return insertedAtIndex;
};

module.exports = obj;

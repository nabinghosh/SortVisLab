let array = []; 
let animationSpeed = 10;
let comparisons = 0;
let swaps = 0;
let sorted = false;
const arrayContainer = document.getElementById('arrayContainer');
const originalArrayContainer = document.getElementById('originalArray');
const sortedArrayContainer = document.getElementById('sortedArray');    

function reverseArray() {
    array.reverse(); // Reverse the array in place
    displayArray(array); // Update the displayed array to show reversed order
    displayOriginalArray(array); // Optionally update the "Original Array" display
}

// Event listener for speed slider
document.getElementById('speedSlider').addEventListener('input', function() {
    animationSpeed = 110 - this.value;
});

// Event listener for array size slider
document.getElementById('sizeSlider').addEventListener('input', function() {
    generateArray(parseInt(this.value));
});

// Generate a random array
function generateArray(size = 20) {
    array = Array.from({ length: size }, (_, i) => ({
        value: Math.floor(Math.random() * 300) + 5,
        id: i
    }));
    
    resetCounters();
    displayOriginalArray(array);
    displayArray(array);
    displaySortedArray([]);
    updateStepCount();
}


function displayOriginalArray(arr) {
    const originalArrayContainer = document.getElementById('originalArray');
    originalArrayContainer.innerHTML = arr.map(item => `<span class="original-value">${item.value}</span>`).join(' ');
}


function displayArray(arr) {
    arrayContainer.innerHTML = ''; 
    const maxVal = Math.max(...arr.map(item => item.value));

    // Create Y-axis container
    const yAxis = document.createElement('div');
    yAxis.classList.add('y-axis');
    arrayContainer.appendChild(yAxis);

    // Add Y-axis labels
    const yAxisStep = Math.ceil(maxVal/3 );
    for (let i = 0; i <= maxVal; i += yAxisStep) {
        const yAxisLabel = document.createElement('div');
        yAxisLabel.classList.add('y-axis-label');
        yAxisLabel.textContent = i;
        yAxis.appendChild(yAxisLabel);
    }

    // Add array bars with initial heights and values
    arr.forEach((item, index) => {
        const barContainer = document.createElement('div');
        barContainer.classList.add('bar-container');

        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${item.value}px`; // Set initial height based on array value
        bar.dataset.index = index; // Store the index to identify bars during swaps
        barContainer.appendChild(bar);

        // Value below each bar (X-axis labels)
        const valueDiv = document.createElement('div');
        valueDiv.classList.add('value-below');
        valueDiv.textContent = item.value; // Set initial value label
        barContainer.appendChild(valueDiv);

        arrayContainer.appendChild(barContainer);
    });
}


// Sorting algorithms

// Bubble Sort
async function bubbleSort(arr) {
    let len = arr.length;
    comparisons = 0;
    swaps = 0;
    for (let i = 0; i < len; i++) {
        let swapped = false; // Track if any elements were swapped in this pass
        for (let j = 0; j < len - 1 - i; j++) {
            // Visualize comparison
            visualizeComparison(j, j + 1);
            await sleep(animationSpeed);

            if (arr[j].value > arr[j + 1].value) {
                // Swap elements
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

                // Visualize swap
                visualizeSwap(j, j + 1);
                await sleep(animationSpeed);

                swapped = true; // Set swapped flag to true if a swap occurred
            }
        }
        if (!swapped) {
            break; // If no elements were swapped, array is sorted
        }
        updateStepCount();
    }
    updateStepCount();
}

// Insertion Sort
async function insertionSort(arr) {
    let len = arr.length;
    comparisons = 0;
    swaps = 0;
    for (let i = 1; i < len; i++) {
        let key = arr[i].value; // Extract the value to be compared
        let j = i - 1;

        // Visualize comparison
        visualizeComparison(i, j);
        await sleep(animationSpeed);

        while (j >= 0 && arr[j].value > key) {
            // Shift elements greater than key to the right
            arr[j + 1].value = arr[j].value;

            // Visualize swap
            visualizeSwap(j + 1, j);
            await sleep(animationSpeed);

            j--;
            comparisons++;
        }
        arr[j + 1].value = key; // Place key into its correct position
        // swaps++;
        updateStepCount();
    }
    updateStepCount();
}

// Selection Sort
async function selectionSort(arr) {
    let len = arr.length;
    comparisons = 0;
    swaps = 0;
    for (let i = 0; i < len - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < len; j++) {
            // Visualize comparison
            visualizeComparison(minIndex, j);
            await sleep(animationSpeed);

            if (arr[j].value < arr[minIndex].value) {
                minIndex = j;
            }
            comparisons++;
        }

        if (minIndex !== i) {
            // Swap elements
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

            // Visualize swap
            visualizeSwap(i, minIndex);
            await sleep(animationSpeed);

            swaps++;
        }
        updateStepCount();
    }
    updateStepCount();
}

// Merge Sort
async function mergeSort(arr) {
    comparisons = 0;
    swaps = 0;
    await mergeSortHelper(arr, 0, arr.length - 1);
    updateStepCount(); // Final update for the counters after sorting
}

async function mergeSortHelper(arr, left, right) {
    if (left >= right) {
        return;
    }

    const middle = Math.floor((left + right) / 2);
    await mergeSortHelper(arr, left, middle);
    await mergeSortHelper(arr, middle + 1, right);
    await merge(arr, left, middle, right);
}

async function merge(arr, left, middle, right) {
    const leftArr = arr.slice(left, middle + 1);
    const rightArr = arr.slice(middle + 1, right + 1);

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
        comparisons++;
        visualizeComparison(left + i, middle + 1 + j); // Visualize comparison
        await sleep(animationSpeed);

        if (leftArr[i].value <= rightArr[j].value) {
            arr[k] = leftArr[i];
            i++;
        } else {
            arr[k] = rightArr[j];
            j++; swaps++;
        }
        k++;
    }

    while (i < leftArr.length) {
        arr[k] = leftArr[i];
        i++;
        k++;
    }

    while (j < rightArr.length) {
        arr[k] = rightArr[j];
        j++;
        k++;
    }

    // Visualize merged array
    displayArray(arr);
    await sleep(animationSpeed);

    updateStepCount(); // Update counters during the merge step
}


// Quick Sort
async function quickSort(arr, left = 0, right = arr.length - 1) {
    if (left < right) {
        let pivotIndex = await partition(arr, left, right);
        await Promise.all([
            quickSort(arr, left, pivotIndex - 1),
            quickSort(arr, pivotIndex + 1, right)
        ]);
    }
}

async function partition(arr, left, right) {
    let pivotValue = arr[right].value;
    let pivotIndex = left;

    for (let i = left; i < right; i++) {
        updateStepCount();

        // Visualize comparison
        visualizeComparison(i, right);
        await sleep(animationSpeed);

        if (arr[i].value < pivotValue) {
            // Swap elements only if necessary
            if (i !== pivotIndex) {
                [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
                swaps++; // Increment swaps only when elements are swapped
                updateStepCount();

                // Visualize swap
                visualizeSwap(i, pivotIndex);
                await sleep(animationSpeed);
            }

            pivotIndex++;
        }
    }

    // Swap pivot with pivotIndex
    if (right !== pivotIndex && arr[right].value !== arr[pivotIndex].value) {
        [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];
        swaps++; // Increment swaps for the final pivot swap
        updateStepCount();

        // Visualize swap
        visualizeSwap(pivotIndex, right);
        await sleep(animationSpeed);
    }

    return pivotIndex;
}

// Heap Sort
async function heapSort(arr) {
    let n = arr.length;

    // Build max heap
    await buildMaxHeap(arr, n);

    // Heap sort
    for (let i = n - 1; i > 0; i--) {
        // Swap root (max element) with the last element
        [arr[0], arr[i]] = [arr[i], arr[0]];

        // Visualize swap
        visualizeSwap(0, i);
        await sleep(animationSpeed);

        // Heapify the reduced heap
        await heapify(arr, i, 0);
    }

    updateStepCount(); // Update step count after sorting
}

// Function to build max heap
async function buildMaxHeap(arr, n) {
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(arr, n, i);
    }
}

// Function to heapify a subtree rooted with node i which is an index in arr[]
async function heapify(arr, n, i) {
    let largest = i; // Initialize largest as root
    let left = 2 * i + 1; // Left child
    let right = 2 * i + 2; // Right child

    // Visualize comparison with children
    if (left < n) {
        visualizeComparison(largest, left);
        await sleep(animationSpeed);
    }
    if (right < n) {
        visualizeComparison(largest, right);
        await sleep(animationSpeed);
    }

    // If left child is larger than root
    if (left < n && arr[left].value > arr[largest].value) {
        largest = left;
    }

    // If right child is larger than largest so far
    if (right < n && arr[right].value > arr[largest].value) {
        largest = right;
    }

    // If largest is not root
    if (largest !== i) {
        // Swap elements
        [arr[i], arr[largest]] = [arr[largest], arr[i]];

        // Visualize swap
        visualizeSwap(i, largest);
        await sleep(animationSpeed);

        // Recursively heapify the affected sub-tree
        await heapify(arr, n, largest);
    }

    comparisons++; // Count each comparison
    updateStepCount(); // Update step count after each heapify operation
}

// Radix Sort
async function radixSort(arr) {
    let maxDigitCount = getMaxDigitCount(arr);

    for (let k = 0; k < maxDigitCount; k++) {
        let digitBuckets = Array.from({ length: 10 }, () => []);

        for (let i = 0; i < arr.length; i++) {
            let digit = getDigit(arr[i].value, k);
            digitBuckets[digit].push(arr[i]);
            comparisons++; // Count comparison for each element processed
            visualizeComparison(i, i); // Visualize comparison
            await sleep(animationSpeed);
        }

        // Flatten digit buckets into the new order
        arr = [].concat(...digitBuckets);

        // Visualize the current state of the array
        displayArray(arr);
        await sleep(animationSpeed); // Optional delay for visualization
    }

    updateStepCount(); // Update step count after sorting completes
    return arr;
}


// Helper function to get the maximum number of digits in the array
function getMaxDigitCount(arr) {
    let maxDigits = 0;
    for (let i = 0; i < arr.length; i++) {
        maxDigits = Math.max(maxDigits, digitCount(arr[i].value));
    }
    return maxDigits;
}

// Helper function to get the number of digits in a number
function digitCount(num) {
    if (num === 0) return 1;
    return Math.floor(Math.log10(Math.abs(num))) + 1;
}

// Helper function to get the digit at a specific place value
function getDigit(num, place) {
    return Math.floor(Math.abs(num) / Math.pow(10, place)) % 10;
}


function updateStepCount() {
    document.getElementById('comparisonCount').textContent = comparisons;
    document.getElementById('swapCount').textContent = swaps;
}

function visualizeComparison(idx1, idx2) {      
    const bars = document.querySelectorAll('.bar');
    bars[idx1].classList.add('compare');
    bars[idx2].classList.add('compare');
    setTimeout(() => {
        bars[idx1].classList.remove('compare');
        bars[idx2].classList.remove('compare');
    }, animationSpeed);
    comparisons++;
    updateStepCount();
}

async function visualizeSwap(idx1, idx2) {
    const bars = document.querySelectorAll('.bar');
    const valuesBelow = document.querySelectorAll('.value-below');

    // Swap the heights of the bars
    [bars[idx1].style.height, bars[idx2].style.height] = [bars[idx2].style.height, bars[idx1].style.height];

    // Update the displayed values below the bars to match the swap
    [valuesBelow[idx1].textContent, valuesBelow[idx2].textContent] = [valuesBelow[idx2].textContent, valuesBelow[idx1].textContent];

    bars[idx1].classList.add('swap');
    bars[idx2].classList.add('swap');
    await sleep(animationSpeed);
    bars[idx1].classList.remove('swap');
    bars[idx2].classList.remove('swap');
    swaps++;
    updateStepCount();
}


function markSorted() {
    document.querySelectorAll('.bar').forEach(bar => bar.classList.add('final'));
}


// Function for sleep (delay)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to update complexity display
function updateComplexityDisplay(algorithm) {
    const complexities = {
        bubble: `Bubble Sort
    
    Time Complexity:
    - Best: O(n)
    - Average: O(n^2)
    - Worst: O(n^2)
    
    Space Complexity:
    - O(1)
    
    Advantages:
    - Simple to implement.
    - Efficient for small datasets.
    
    Disadvantages:
    - Inefficient for large datasets.
    - Time complexity can be high in the worst case (O(n^2)).
    
    Stable: Yes`,
    
        insertion: `Insertion Sort
    
    Time Complexity:
    - Best: O(n)
    - Average: O(n^2)
    - Worst: O(n^2)
    
    Space Complexity:
    - O(1)
    
    Advantages:
    - Efficient for small datasets or nearly sorted arrays.
    - Adaptive: performs well when the input is mostly sorted.
    
    Disadvantages:
    - Inefficient on large datasets.
    - Time complexity can be high in the worst case (O(n^2)).
    
    Stable: Yes`,
    
        selection: `Selection Sort
    
    Time Complexity:
    - Best: O(n^2)
    - Average: O(n^2)
    - Worst: O(n^2)
    
    Space Complexity:
    - O(1)
    
    Advantages:
    - Simple to implement.
    - In-place sorting algorithm.
    
    Disadvantages:
    - Inefficient for large datasets.
    - Time complexity is consistently O(n^2) in all cases.
    
    Stable: No`,
    
        merge: `Merge Sort
    
    Time Complexity:
    - Best: O(n log n)
    - Average: O(n log n)
    - Worst: O(n log n)
    
    Space Complexity:
    - O(n)
    
    Advantages:
    - Consistent O(n log n) time complexity.
    - Efficient for large datasets.
    - Stable sorting algorithm.
    
    Disadvantages:
    - Requires additional space (O(n)).
    - Not an in-place algorithm.
    
    Stable: Yes`,
    
        quick: `Quick Sort
    
    Time Complexity:
    - Best: O(n log n)
    - Average: O(n log n)
    - Worst: O(n^2)
    
    Space Complexity:
    - O(log n)
    
    Advantages:
    - Very fast on average (O(n log n)).
    - Efficient for large datasets.
    
    Disadvantages:
    - Worst-case time complexity can be O(n^2) if the pivot selection is poor.
    - Not a stable sorting algorithm.
    
    Stable: No`,
    
        heap: `Heap Sort
    
    Time Complexity:
    - Best: O(n log n)
    - Average: O(n log n)
    - Worst: O(n log n)
    
    Space Complexity:
    - O(1)
    
    Advantages:
    - Efficient for large datasets.
    - In-place sorting algorithm.
    - Time complexity is consistently O(n log n).
    
    Disadvantages:
    - Not a stable sorting algorithm.
    - Less efficient than merge sort in practical applications.
    
    Stable: No`,
    
        radix: `Radix Sort
    
    Time Complexity:
    - Best: O(nk)
    - Average: O(nk)
    - Worst: O(nk)
    
    Space Complexity:
    - O(n + k)
    
    Advantages:
    - Can be faster than comparison-based sorting algorithms for large datasets.
    - Stable sorting algorithm.
    
    Disadvantages:
    - Requires extra space (O(n + k)).
    - Not suitable for all types of data (works best with integers or strings).
    
    Stable: Yes`
    };
    
    document.getElementById('complexityDisplay').textContent = complexities[algorithm] || '';
}

function displaySortedArray(arr) {
    const sortedArrayContainer = document.getElementById('sortedArray');
    sortedArrayContainer.innerHTML = arr.map(item => `<span class="sorted-value">${item.value}</span>`).join(' ');
}

// Function to update step count display
function updateStepCount() {
    document.getElementById('comparisonCount').textContent = comparisons;
    document.getElementById('swapCount').textContent = swaps;
}

// Reset counters
function resetCounters() {
    comparisons = 0;
    swaps = 0;
}

// Function to sort array based on selected algorithm
async function sortArray(algorithm) {
    const algorithms = {
        bubble: bubbleSort,
        insertion: insertionSort,
        selection: selectionSort,
        merge: mergeSort,
        quick: quickSort,
        heap: heapSort,
        radix: radixSort
    };
    const sortFunction = algorithms[algorithm];
    if (!sortFunction) return;

    resetCounters();
    updateStepCount();
    updateComplexityDisplay(algorithm);
    
    const sortButtons = document.querySelectorAll('.controls button');
    sortButtons.forEach(button => button.disabled = true);

    await sortFunction(array);

    displaySortedArray(array);
    sortButtons.forEach(button => button.disabled = false);
    markSorted();
}

// Event listener for Generate New Array button
document.getElementById('generateButton').addEventListener('click', function() {
    generateArray();
});

// Initial array generation and display on page load
generateArray();
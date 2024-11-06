let array = []; // Array to be sorted
let animationSpeed = 10; // Speed of animation in milliseconds, default value
let comparisons = 0;
let swaps = 0;
let sorted = false; // Flag to track if array is sorted

// Function to handle slider change
document.getElementById('speedSlider').addEventListener('input', function() {
    animationSpeed = 110 - this.value; // Adjust animation speed inversely with slider value (higher value means slower animation)
});

// Function to generate a new random array
function generateArray() {
    const arraySize = 20; // Size of the array
    array = [];
    resetCounters(); // Reset counters when generating new array

    // Clear sorted array display
    displaySortedArray([]);

    // Clear existing array bars and display original array
    const arrayContainer = document.getElementById('arrayContainer');
    arrayContainer.innerHTML = '';

    for (let i = 0; i < arraySize; i++) {
        array.push({
            value: Math.floor(Math.random() * 300) + 5, // Random values between 5 and 300
            id: i // Add ID to track original order
        });
    }

    displayOriginalArray(array);
    displayArray(array);

    // Reset counters display
    updateStepCount();
}


function displayOriginalArray(arr) {
    const originalArrayContainer = document.getElementById('originalArray');
    originalArrayContainer.innerHTML = arr.map(item => `<span class="original-value">${item.value}</span>`).join(' ');
}

// Function to display the array as bars
// Function to display array bars and Y-axis
// Function to display array bars and Y-axis
function displayArray(arr) {
    const arrayContainer = document.getElementById('arrayContainer');
    arrayContainer.innerHTML = ''; // Clear existing content

    // Calculate maximum value in the array
    const maxVal = Math.max(...arr.map(item => item.value));

    // Create Y-axis container
    const yAxis = document.createElement('div');
    yAxis.classList.add('y-axis');
    arrayContainer.appendChild(yAxis);

    // Add Y-axis labels
    const yAxisStep = Math.ceil((maxVal) / 4); // Adjust steps as needed
    for (let i = 0; i <= maxVal; i += yAxisStep) {
        const yAxisLabel = document.createElement('div');
        yAxisLabel.classList.add('y-axis-label');
        yAxisLabel.textContent = i;
        yAxis.appendChild(yAxisLabel);
    }

    // Add array bars with corresponding heights
    for (let i = 0; i < arr.length; i++) {
        const barContainer = document.createElement('div');
        barContainer.classList.add('bar-container');

        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${arr[i].value}px`; // Set height based on array value
        barContainer.appendChild(bar);

        const valueDiv = document.createElement('div');
        valueDiv.classList.add('value-below');
        valueDiv.textContent = arr[i].value; // Display value below the bar
        barContainer.appendChild(valueDiv);

        arrayContainer.appendChild(barContainer);
    }
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

// Cyclic Sort
async function cyclicSort(arr) {
    let i = 0;
    comparisons = 0;
    swaps = 0;

    while (i < arr.length) {
        let correctIndex = arr[i].value - 1;

        // Ensure values are within the correct range (1 to n)
        if (arr[i].value >= 1 && arr[i].value <= arr.length && arr[i].value !== arr[correctIndex].value) {
            // Visualize comparison
            visualizeComparison(i, correctIndex);
            await sleep(animationSpeed);

            comparisons++;
            updateStepCount();

            // Swap elements
            [arr[i], arr[correctIndex]] = [arr[correctIndex], arr[i]];
            swaps++;
            updateStepCount();

            // Visualize swap
            visualizeSwap(i, correctIndex);
            await sleep(animationSpeed);

            // After swap, re-check current position
            i--;
        }

        i++; // Move to the next element in the array
    }

    updateStepCount(); // Final update for the counters after sorting
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

// Helper functions

// Function to visualize comparison between two bars
function visualizeComparison(idx1, idx2) {
    const bars = document.querySelectorAll('.bar');
    bars[idx1].style.backgroundColor = '#FF9AA2'; // Red color for comparison
    bars[idx2].style.backgroundColor = '#FFB7B2'; // Red color for comparison
    comparisons++;
}

// Function to visualize swap between two bars
async function visualizeSwap(idx1, idx2) {
    const bars = document.querySelectorAll('.bar');
    const bar1Height = bars[idx1].style.height;
    const bar1ClassList = bars[idx1].classList;
    const bar2Height = bars[idx2].style.height;
    const bar2ClassList = bars[idx2].classList;

    bars[idx1].style.height = bar2Height;
    bars[idx1].classList = bar2ClassList;

    bars[idx2].style.height = bar1Height;
    bars[idx2].classList = bar1ClassList;

    // Highlight swapped bars
    bars[idx1].style.backgroundColor = '#B5EAD7'; // Green color for swapped bar
    bars[idx2].style.backgroundColor = '#E2F0CB'; // Green color for swapped bar

    swaps++;

    await sleep(animationSpeed);

    // Reset color after highlighting
    bars[idx1].style.backgroundColor = '#C7CEEA'; // Blue color after swap
    bars[idx2].style.backgroundColor = '#C6DEF1'; // Blue color after swap
}

// Function for sleep (delay)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to update complexity display
function updateComplexityDisplay(algorithm) {
    const complexityDisplay = document.getElementById('complexityDisplay');
    let complexityText = '';

    switch (algorithm) {
        case 'bubble':
            complexityText = `Bubble Sort\n\nTime Complexity:\n- Best: O(n)\n- Average: O(n^2)\n- Worst: O(n^2)\n\nSpace Complexity:\n- O(1)`;
            break;
        case 'insertion':
            complexityText = `Insertion Sort\n\nTime Complexity:\n- Best: O(n)\n- Average: O(n^2)\n- Worst: O(n^2)\n\nSpace Complexity:\n- O(1)`;
            break;
        case 'selection':
            complexityText = `Selection Sort\n\nTime Complexity:\n- Best: O(n^2)\n- Average: O(n^2)\n- Worst: O(n^2)\n\nSpace Complexity:\n- O(1)`;
            break;
        case 'merge':
            complexityText = `Merge Sort\n\nTime Complexity:\n- Best: O(n log n)\n- Average: O(n log n)\n- Worst: O(n log n)\n\nSpace Complexity:\n- O(n)`;
            break;
        case 'quick':
            complexityText = `Quick Sort\n\nTime Complexity:\n- Best: O(n log n)\n- Average: O(n log n)\n- Worst: O(n^2)\n\nSpace Complexity:\n- O(log n)`;
            break;
        case 'heap':
            complexityText = `Heap Sort\n\nTime Complexity:\n- Best: O(n log n)\n- Average: O(n log n)\n- Worst: O(n log n)\n\nSpace Complexity:\n- O(1)`;
            break;
        case 'cyclic':
            complexityText = `Cyclic Sort\n\nTime Complexity:\n- Best: O(n)\n- Average: O(n)\n- Worst: O(n)\n\nSpace Complexity:\n- O(1)`;
            break;
        case 'radix':
            complexityText = `Radix Sort\n\nTime Complexity:\n- Best: O(nk)\n- Average: O(nk)\n- Worst: O(nk)\n\nSpace Complexity:\n- O(n+k)`;
            break;
        default:
            complexityText = '';
    }


    complexityDisplay.textContent = complexityText;
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
    let sortFunction;
    switch (algorithm) {
        case 'bubble':
            sortFunction = bubbleSort;
            break;
        case 'insertion':
            sortFunction = insertionSort;
            break;
        case 'selection':
            sortFunction = selectionSort;
            break;
        case 'merge':
            sortFunction = mergeSort;
            break;
        case 'quick':
            sortFunction = quickSort;
            break;
        case 'heap':
            sortFunction = heapSort;
            break;
        case 'cyclic':
            sortFunction = cyclicSort;
            break;
        case 'radix':
            sortFunction = radixSort;
            break;
        default:
            return;
    }

    resetCounters(); // Reset counters before sorting
    updateStepCount(); // Update step count display before sorting

    // Update complexity display
    updateComplexityDisplay(algorithm);

    // Disable sorting buttons during sorting
    const sortButtons = document.querySelectorAll('.controls button');
    sortButtons.forEach(button => {
        button.disabled = true;
    });

    // Sort the array using selected algorithm
    await sortFunction(array);

    // Display the sorted array
    displaySortedArray(array);

    // Enable sorting buttons after sorting
    sortButtons.forEach(button => {
        button.disabled = false;
    });

    sorted = true; // Set sorted flag to true after sorting

    // Enable generate array button after sorting
    const generateButton = document.getElementById('generateButton');
    generateButton.disabled = false;
}

// Event listener for Generate New Array button
document.getElementById('generateButton').addEventListener('click', function() {
    generateArray();
});

// Initial array generation and display on page load
generateArray();
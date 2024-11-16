let sortingChart;
let data = [];
let correctAlgorithm = '';
let algorithms = ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Insertion Sort'];

function randomData() {
    return Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
}

function updateChart(data) {
    sortingChart.data.datasets[0].data = data;
    sortingChart.update();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Bubble Sort Visualization
async function bubbleSort(data) {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data.length - i - 1; j++) {
            if (data[j] > data[j + 1]) {
                [data[j], data[j + 1]] = [data[j + 1], data[j]]; // Swap
                updateChart(data);
                await sleep(500); // Slow down for visualization
            }
        }
    }
    correctAlgorithm = 'Bubble Sort';
}

// Quick Sort Visualization
async function quickSort(data, left = 0, right = data.length - 1) {
    if (left >= right) return;

    const pivot = data[right];
    let partitionIndex = left;

    for (let i = left; i < right; i++) {
        if (data[i] < pivot) {
            [data[i], data[partitionIndex]] = [data[partitionIndex], data[i]];
            partitionIndex++;
            updateChart(data);
            await sleep(500); // Slow down for visualization
        }
    }
    [data[partitionIndex], data[right]] = [data[right], data[partitionIndex]];
    updateChart(data);
    await sleep(500);

    await quickSort(data, left, partitionIndex - 1);
    await quickSort(data, partitionIndex + 1, right);

    correctAlgorithm = 'Quick Sort';
}

function startSorting() {
    data = randomData();
    updateChart(data);

    const randomAlgorithm = algorithms[Math.floor(Math.random() * algorithms.length)];
    if (randomAlgorithm === 'Bubble Sort') {
        bubbleSort([...data]);
    } else if (randomAlgorithm === 'Quick Sort') {
        quickSort([...data]);
    } else if (randomAlgorithm === 'Merge Sort') {
        mergeSort([...data]).then(sortedData => {
            correctAlgorithm = 'Merge Sort';
        });
    } else if (randomAlgorithm === 'Insertion Sort') {
        insertionSort([...data]);
    }
}

// Merge Sort Visualization
async function mergeSort(data) {
    if (data.length <= 1) {
        return data;
    }

    const middle = Math.floor(data.length / 2);
    const left = await mergeSort(data.slice(0, middle));
    const right = await mergeSort(data.slice(middle));

    return await merge(left, right);
}

async function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
        updateChart([...result, ...left.slice(leftIndex), ...right.slice(rightIndex)]);
        await sleep(500); // Vizualizare lentă
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}


// Insertion Sort Visualization
async function insertionSort(data) {
    for (let i = 1; i < data.length; i++) {
        let key = data[i];
        let j = i - 1;

        while (j >= 0 && data[j] > key) {
            data[j + 1] = data[j];
            j--;
            updateChart(data);
            await sleep(500); // Vizualizare lentă
        }
        data[j + 1] = key;
        updateChart(data);
        await sleep(500);
    }
    correctAlgorithm = 'Insertion Sort';
}

function checkGuess(guess) {
    const resultMessage = document.getElementById('resultMessage');
    if (guess === correctAlgorithm) {
        resultMessage.innerText = `Correct! The algorithm was ${correctAlgorithm}.`;
        resultMessage.style.color = 'green';
    } else {
        resultMessage.innerText = `Wrong! The algorithm was actually ${correctAlgorithm}.`;
        resultMessage.style.color = 'red';
    }
}

// Initialize the chart
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('sortingChart').getContext('2d');
    sortingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: 10 }, (_, i) => i + 1),
            datasets: [{
                label: 'Values',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    document.getElementById('startButton').addEventListener('click', startSorting);
});

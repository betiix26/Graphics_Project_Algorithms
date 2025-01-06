const canvas = document.getElementById('sortCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;
const ARRAY_SIZE = 100;
let data = [];
let darkMode = false;
let initialData = [];

function resetArray() {
  data = [...initialData];
  drawArray(data);
}

function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.style.backgroundColor = darkMode ? "#2e2e2e" : "#fff";
  drawArray(data);
}

function shuffleArray() {
  data = Array.from({ length: ARRAY_SIZE }, () => Math.floor(Math.random() * canvas.height));
  initialData = [...data];
  drawArray(data);
}

function drawArray(array, highlighted = [], pivot = -1) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barWidth = canvas.width / array.length;

  array.forEach((value, index) => {
    let color = 'aqua';


    if (index === pivot) {
      color = 'lime';
    }
    else if (highlighted.includes(index)) {
      color = 'red';
    }

    if (darkMode) {
      ctx.fillStyle = color;
    } else {
      ctx.fillStyle = color;
    }

    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;

    ctx.fillRect(index * barWidth, canvas.height - value, barWidth - 2, value);
  });
}

function animateSwap(i, j, delay = 20) {
  return new Promise(resolve => {
    const temp = data[i];
    data[i] = data[j];
    data[j] = temp;
    drawArray(data, [i, j]);
    setTimeout(resolve, delay);
  });
}

// Bubble Sort Animation
async function startBubbleSort() {
  for (let i = 0; i < data.length - 1; i++) {
    for (let j = 0; j < data.length - i - 1; j++) {
      if (data[j] > data[j + 1]) {
        await animateSwap(j, j + 1);
      }
    }
  }
}

// Quick Sort Animation
async function startQuickSort() {
  await quickSort(data, 0, data.length - 1);
  drawArray(data);
}

async function quickSort(arr, left, right) {
  if (left >= right) return;

  let pivotIndex = await partition(arr, left, right);
  await quickSort(arr, left, pivotIndex - 1);
  await quickSort(arr, pivotIndex + 1, right);
}

async function partition(arr, left, right) {
  let pivotValue = arr[right];
  let pivotIndex = left;

  for (let i = left; i < right; i++) {
    if (arr[i] < pivotValue) {
      await animateSwap(i, pivotIndex);
      pivotIndex++;
    }
    drawArray(arr, [i, pivotIndex], right);
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  await animateSwap(pivotIndex, right);
  return pivotIndex;
}

// Merge Sort Animation
async function startMergeSort() {
  await mergeSort(data, 0, data.length - 1);
  drawArray(data);
}

async function mergeSort(arr, left, right) {
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);
  await mergeSort(arr, left, mid);
  await mergeSort(arr, mid + 1, right);
  await merge(arr, left, mid, right);
}

async function merge(arr, left, mid, right) {
  const leftArray = arr.slice(left, mid + 1);
  const rightArray = arr.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;

  while (i < leftArray.length && j < rightArray.length) {
    if (leftArray[i] <= rightArray[j]) {
      arr[k] = leftArray[i];
      i++;
    } else {
      arr[k] = rightArray[j];
      j++;
    }
    drawArray(data, [k]);
    await new Promise(resolve => setTimeout(resolve, 30));
    k++;
  }

  while (i < leftArray.length) {
    arr[k] = leftArray[i];
    i++;
    drawArray(data, [k]);
    await new Promise(resolve => setTimeout(resolve, 30));
    k++;
  }

  while (j < rightArray.length) {
    arr[k] = rightArray[j];
    j++;
    drawArray(data, [k]);
    await new Promise(resolve => setTimeout(resolve, 30));
    k++;
  }
}

// Initialize
shuffleArray();


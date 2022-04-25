
let size = 100;
let w = 0;
let list = [];
let index = 0;

let done = false;

let dd;
let perlinNoise;

let sortingAlg;
let sizeSlider;

let instance = 0;
let quickSorting = false;
let states = [];

let bubbleI = 0;

function setup() {
  createCanvas(600, 600);

  dd = createSelect();
  dd.option('Dumb');
  dd.option('Bubble sort');
  dd.option('Quicksort');

  dd.selected('Dumb');
  dd.changed(selectEvent);

  let label = createDiv('Sorting algorithm: ');
  dd.parent(label);

  sortingAlg = dd.value();

  createDiv('Amount');
  sizeSlider = createSlider(5, 1000, 25, 1);
  size = sizeSlider.value();

  perlinNoise = createCheckbox("Perlin randomisation", false);
  perlinNoise.changed(reset);

  w = width / size;

  // Reset to start
  reset();
}

function reset() {
  instance++;
  done = false;
  w = width / size;
  index = 0;
  bubbleI = 0;
  quickSorting = false;
  states = [];
  list = [];

  for (let i = 0; i < size; i++) {
    if (perlinNoise.checked()) {
      list[i] = noise(i / 100.0) * height;
    } else {
      list[i] = random(height * 0.1, height * 0.9);
    }
    states[i] = 0;
  }
}

function draw() {
  if (sizeSlider.value() != size) {
    size = sizeSlider.value();
    reset();
    return;
  }

  background(51);
  noStroke();
  translate(1, height);
  for (let i = 0; i < list.length; i++) {
    let h = list[i];

    fill(255);
    // Draw the one currently being compared red
    if (i == index) {
      fill(255, 0, 0);
    }
    if (states[i] == 1) {
      fill(0, 0, 255);
    }

    rect(0, 0, w, -h);

    translate(w, 0);
  }

  switch (sortingAlg) {

    case "Dumb":
      dumbSort();
      break;

    case "Bubble sort":
      bubbleSort();
      break;

    case "Quicksort":
      if (!quickSorting) {
        quickSort(0, list.length - 1, instance);
      }
      break;

    default:
      break;
  }
}

function dumbSort() {
  // Sort the list 1 step
  if (list[index] > list[index + 1]) {
    // flip em
    swap(index, index + 1);
  }

  index++;
  if (index > size) {
    index = 0;
  }
}

function bubbleSort() {
  if (bubbleI < list.length) {

    index = 0;
    while (index < list.length - bubbleI - 1) {
      let a = list[index];
      let b = list[index + 1];
      if (a > b) {
        swap(index, index + 1);
      }
      index++;
    }

  } else {
    done = true;
  }
  bubbleI++;
}

async function quickSort(start, end, inst) {
  if (inst < instance) {
    return;
  }

  if (start >= end) {
    return;
  }
  quickSorting = true;

  // Divide and conquer :D
  index = await partition(start, end);
  states[index] = 0;

  await Promise.all([
    quickSort(start, index - 1, inst),
    quickSort(index + 1, end, inst)
  ]);
}

// Function for quicksort algorithm
async function partition(start, end) {
  let pIndex = start;
  let pVal = list[end];

  states[pIndex] = 1;

  for (let i = start; i < end; i++) {
    if (list[i] < pVal) {
      await swap(i, pIndex);
      pIndex++;
    }
  }

  await swap(pIndex, end, 100);

  for (let i = start; i < end; i++) {
    if (i != pIndex) {
      states[i] = 0;
    }
  }
  return pIndex;
}

// Swap two objects in list based on index
async function swap(a, b, sleep = 0) {
  if (sleep != 0) {
    await doSleep(sleep);
  }

  let temp = list[a];
  list[a] = list[b];
  list[b] = temp;
}

function selectEvent() {
  sortingAlg = dd.value();
  console.log("Selected: " + sortingAlg);
  reset();
}

function doSleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

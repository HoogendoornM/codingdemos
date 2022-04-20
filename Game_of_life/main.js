let grid;
let cols;
let rows;
let res = 6;

function setup() {

  let canvas = createCanvas(600, 600);
  canvas.mouseClicked(CanvasClick);

  speedSlider = createSlider(1, 100, 30, 1);

  cols = width / res;
  rows = height / res;

  // Make 2d array grid and fill with cells having life 0 or 1;
  grid = Make2DArray(cols, rows);
}

function CanvasClick(){
  let x = floor(mouseX / res)
  let y = floor(mouseY / res)

  // Flip a clicked tile
  grid[x][y].life = !grid[x][y].life;
}

function draw() {
  background(51);
  frameRate(speedSlider.value());
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {

      x = i * res;
      y = j * res;

      if (grid[i][j].life == 1) {
        fill(255);
        rect(x, y, res, res);
      }
    }
  }

  let next = Make2DArray(cols, rows);


  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let alive = grid[i][j].life;

      // count living neighbors
      let neighbors = CountLivingNeighbors(grid, i, j);

      // rule 1: back to live if dead and 3 neighbors
      if (alive == 0 && neighbors == 3) {
        next[i][j].life = 1;
      } else if (alive == 1 && (neighbors < 2 || neighbors > 3)) {
        // rule 2: die from under/overpopulation
        next[i][j].life = 0;
      } else {
        // go to next gen with same state
        next[i][j].life = alive;
      }
    }
  }
  grid = next;
}


function Make2DArray(cols, rows) {
  let arr = new Array(cols);

  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);

  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      arr[i][j] = new Cell();
    }
  }


  return arr;
}

function CountLivingNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {

      // Wrap around 
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row].life;
    }
  }

  // substract self 
  sum -= grid[x][y].life;
  return sum;
}

class Cell {
  constructor() {
    this.life = floor(random(2));
  }
}

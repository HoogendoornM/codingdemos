
const cols = 25;
const rows = 25;
var w, h;

var grid;

var openCells = [];
var closedCells = [];

var start;
var end;
var current;
var done = false;
var noSolution = false;
var path = [];
var wallChance = 0.3;


function setup() {
  createCanvas(600, 600);

  speedSlider = createSlider(1, 120, 20, 1);

  noStroke();

  w = width / cols;
  h = height / rows;

  grid = Make2DArray(cols, rows);

  // Set the neighbors for all cells
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  start = grid[0][0];

  let randomX = floor(random(3, cols));
  let randomY = floor(random(3, rows));
  end = grid[randomX][randomY];

  // Make sure start and end are not walls
  start.wall = false;
  end.wall = false;

  openCells.push(start);
}

function draw() {
  frameRate(speedSlider.value());
  background(51);

  if (openCells.length > 0) {

    var bestI = 0;
    for (let i = 0; i < openCells.length; i++) {
      if (openCells[i].f < openCells[bestI].f) {
        bestI = i;
      }
    }

    current = openCells[bestI];

    if (current === end) {
      done = true;
      noLoop();
    }

    openCells = removeFromArray(openCells, current); // remove from open
    closedCells.push(current); // add to closed

    var neighbors = current.neighbors;
    for (let i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];

      var betterPath = false;
      if (!closedCells.includes(neighbor) && !neighbor.wall) {
        var tempG = current.g + 1;

        // if already evaluated
        if (openCells.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            betterPath = true;
          }
        } else {
          neighbor.g = tempG;
          betterPath = true;
          openCells.push(neighbor);
        }

        if (betterPath) {
          // set distance between it & end node
          neighbor.h = heuristic(neighbor, end);

          // calculate score
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    }


  } else {
    noSolution = true;
    done = true;
    noLoop();
  }


  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }

  for (let i = 0; i < closedCells.length; i++) {
    closedCells[i].show(color(255, 0, 0));
  }

  for (let i = 0; i < openCells.length; i++) {
    openCells[i].show(color(0, 255, 0));
  }

  // Trace back the path
  if (!noSolution) {
    path = [];
    var temp = current;
    path.push(temp);
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }
  }

  // draw path
  for (let i = 0; i < path.length; i++) {
    path[i].show(color(0, 255, 255));
  }
}

function Make2DArray(cols, rows) {
  let arr = Array(cols).fill().map(e => Array(rows))

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      arr[i][j] = new Cell(i, j);
    }
  }
  return arr;
}

function heuristic(a, b) {
  var d = abs(a.x - b.x) + abs(a.y - b.y);
  return d;
}

function removeFromArray(arr, index) {
  return arr.filter(e => e != index);
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.f = 0; // Cell score, g + h. Lowest score is best and used for next step
    this.g = 0; // Cost of moving from start to target
    this.h = 0; // Estimated cost to move from this cell to end, calculated by heuristic
    this.neighbors = [];
    this.previous;
    this.wall = false;


    if (random(1) < wallChance) {
      this.wall = true;
    }
  }

  show(color) {
    fill(color);
    if (this.wall) { // Override color to black for walls
      fill(51);
    }
    if (this == end) { // Override color of end
      fill(255, 0, 255);
    }
    if (this == current) { // Override color of current
      fill(0, 0, 255);
    }
    if (this == current && this == end) { // Override color if reached end
      fill(255, 255, 0);
    }
    rect(this.x * w, this.y * h, w - 1, h - 1);
  }

  addNeighbors(grid) {
    let x = this.x;
    let y = this.y;

    if (x < cols - 1) {
      this.neighbors.push(grid[x + 1][y])
    }
    if (x > 0) {
      this.neighbors.push(grid[x - 1][y])
    }
    if (y < rows - 1) {
      this.neighbors.push(grid[x][y + 1])
    }
    if (y > 0) {
      this.neighbors.push(grid[x][y - 1])
    }

    //diagonals
    // if (x > 0 && y > 0) {
    //   this.neighbors.push(grid[x - 1][y - 1])
    // }
    // if (x < cols - 1 && y > 0) {
    //   this.neighbors.push(grid[x + 1][y - 1])
    // }
    // if (x > 0 && y < rows - 1) {
    //   this.neighbors.push(grid[x - 1][y + 1])
    // }
    // if (x < cols - 1 && y < rows - 1) {
    //   this.neighbors.push(grid[x + 1][y + 1])
    // }
  }
}

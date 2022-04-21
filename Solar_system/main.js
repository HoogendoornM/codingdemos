
function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(51);
}

class Planet {
  constructor(x, y) {
    this.pos = createVector(x, y);
  }
}
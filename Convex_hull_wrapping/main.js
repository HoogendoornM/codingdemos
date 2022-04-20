const points = [];
const hull = [];
var margin = 50;
let leftP;
let currentVertex;
let nextVertex;
let index;
let nextIndex = -1;
var done = false;

function setup() {
  createCanvas(600, 600);

  for (let i = 0; i < 50; i++) {
    points.push(createVector(random(margin, width - margin), random(margin, height - margin)))
  }

  points.sort((a, b) => a.x - b.x);
  leftP = points[0];
  currentVertex = leftP; // start at leftmost point
  hull.push(currentVertex);
  nextVertex = points[1];
  index = 2;

}

function draw() {
  background(51);
  stroke(255);
  strokeWeight(8);
  for (let p of points) {
    point(p.x, p.y);
  }

  stroke(0, 0, 255);
  fill(0, 255, 255, 50);
  strokeWeight(3);
  beginShape();
  for (let p of hull) {
    vertex(p.x, p.y);
  }

  if (done) {
    endShape(CLOSE);
    noLoop();
    return;
  } else {
    endShape();
  }


  // draw leftmost point green
  stroke(0, 255, 0);
  strokeWeight(10);
  point(leftP.x, leftP.y);

  // draw current
  stroke(255, 0, 255);
  strokeWeight(12);
  point(currentVertex.x, currentVertex.y);


  stroke(255);
  strokeWeight(2);
  line(currentVertex.x, currentVertex.y, nextVertex.x, nextVertex.y);



  stroke(255, 0, 0);
  let checking = points[index];
  line(currentVertex.x, currentVertex.y, checking.x, checking.y);

  const a = p5.Vector.sub(nextVertex, currentVertex);
  const b = p5.Vector.sub(checking, currentVertex);

  const cross = a.cross(b);

  if (cross.z < 0) {
    nextVertex = checking;
    nextIndex = index;
  }
  index++;
  if (index == points.length) {
    if (nextVertex == leftP) {
      done = true;
    }
    hull.push(nextVertex);
    currentVertex = nextVertex;
    index = 0;
    nextVertex = leftP;
  }
}

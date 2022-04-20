let walls = [];
let ray;
let particle;

let xoff = 0;
let yoff = 10000;

let mouseCheckbox;
let lightColorPicker;

function setup() {
  createCanvas(600, 600);

  mouseCheckbox = createCheckbox("Mouse control");

  lightColorPicker = createColorPicker(color("white"));
  sliderLabel = createDiv("Light color");
  lightColorPicker.parent(sliderLabel);

  bgColorPicker = createColorPicker(color(51));
  sliderLabel = createDiv("Background");
  bgColorPicker.parent(sliderLabel);

  for (let i = 0; i < 5; i++) {
    let x1 = random(0, width);
    let y1 = random(0, height);
    let x2 = random(0, width);
    let y2 = random(0, height);
    walls.push(new Boundary(x1, y1, x2, y2));
  }

  // Add walls to edges 
  walls.push(new Boundary(0, 0, width, 0));
  walls.push(new Boundary(width, 0, width, height));
  walls.push(new Boundary(width, height, 0, height));
  walls.push(new Boundary(0, height, 0, 0));

  particle = new Particle();
}

function draw() {
  background(bgColorPicker.color());
  strokeWeight(1);

  for (let wall of walls) {
    wall.show();
  }

  if (mouseCheckbox.checked()) {
    particle.update(mouseX, mouseY);
  } else {
    particle.update(noise(xoff) * width, noise(yoff) * height);
  }
  particle.show();
  particle.look(walls);

  xoff += 0.005;
  yoff += 0.005;
}

class Particle {
  constructor() {
    this.pos = createVector(height / 2, width / 2);
    this.rays = [];
    for (let i = 0; i < 360; i += 1) {
      this.rays.push(new Ray(this.pos, radians(i)));
    }
  }

  look(walls) {
    for (let ray of this.rays) {
      let closestCol = null;
      let minD = Infinity;
      for (let wall of walls) {
        const col = ray.cast(wall);
        if (col) {
          let d = p5.Vector.dist(this.pos, col);
          if (d < minD) {
            minD = d;
            closestCol = col;
          }
        }
      }
      if (closestCol) {
        // Draw line to closest wall collision
        strokeWeight(1);
        stroke(lightColorPicker.color(), 255);
        line(this.pos.x, this.pos.y, closestCol.x, closestCol.y);
      }
    }
  }

  update(x, y) {
    this.pos.set(x, y);
  }

  show() {
    strokeWeight(1);
    fill(255);
    ellipse(this.pos.x, this.pos.y, 4);
  }
}

class Ray {
  constructor(pos, angle) {
    this.pos = pos;
    this.dir = p5.Vector.fromAngle(angle);
  }

  // Unused right now
  show() {
    strokeWeight(1);
    stroke(255);
    push();
    translate(this.pos.x, this.pos.y);
    line(0, 0, this.dir.x * 1000, this.dir.y * 1000);
    pop();
  }

  setDir(x, y) {
    this.dir.x = x - this.pos.x;
    this.dir.y = y - this.pos.y;
    this.dir.normalize();
  }

  cast(wall) {

    // Determine if lines collide
    // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    const x1 = wall.a.x;
    const y1 = wall.a.y;
    const x2 = wall.b.x;
    const y2 = wall.b.y;

    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;

    const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    // If lines never intersect stop
    if (d == 0)
      return;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / d;

    if (t > 0 && t < 1 && u > 0) {
      const col = createVector();
      col.x = x1 + t * (x2 - x1);
      col.y = y1 + t * (y2 - y1);
      return col;
    } else {
      return;
    }
  }
}

class Boundary {
  constructor(x1, y1, x2, y2) {
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);
  }

  show() {
    stroke(255);
    strokeWeight(3);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}

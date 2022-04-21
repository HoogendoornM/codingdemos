
let sun;
let showOrbitLines;
let orbitSpeedSlider;
let moonDepthSlider;
let depth;

function setup() {
  createCanvas(600, 600);
  showOrbitLines = createCheckbox("Show orbit lines", true);

  createDiv('Orbit Speed');
  orbitSpeedSlider = createSlider(0, 10, 1, 0.1);

  createDiv('Moon depth');
  moonDepthSlider = createSlider(1, 6, 3, 1);
  depth = moonDepthSlider.value();

  sun = new Planet(random(15, 35), 0);
  sun.spawnMoons(random(3, 6), 1);
}

function draw() {

  if (depth != moonDepthSlider.value()) {
    sun = new Planet(random(15, 35), 0);
    sun.spawnMoons(random(3, 6), 1);
    depth = moonDepthSlider.value();
  }

  background(51);
  translate(width / 2, height / 2);
  sun.show();
  sun.orbit();
}

class Planet {
  constructor(r, d, o = 0, c = color(255, 255, 10)) {
    this.color = c;
    this.orbitSpeed = o;
    this.radius = r;
    this.distance = d;
    this.angle = random(0, TWO_PI);
    this.planets = [];
  }

  orbit() {
    this.angle += this.orbitSpeed * sq(orbitSpeedSlider.value());
    for (let planet of this.planets) {
      planet.orbit();
    }
  }

  spawnMoons(amount, level, rad = this.radius) {
    for (let i = 0; i < amount; i++) {
      let r = rad * (random(0.5, 0.9));
      let d = random(50, 300) / (level * level);
      let c = color(random(255), random(255), random(255), 255);
      let o = random(-0.005, 0.005);
      this.planets[i] = new Planet(r, d, o, c);

      if (level < moonDepthSlider.value()) {
        for (let planet of this.planets) {
          planet.spawnMoons(random(0, 3), level + 1, r);
        }
      }
    }
  }

  show() {
    push();
    noStroke();
    fill(this.color);
    rotate(this.angle);
    translate(this.distance, 0);
    ellipse(0, 0, this.radius * 2);

    for (let planet of this.planets) {

      if (showOrbitLines.checked()) {
        noFill();
        stroke(255, 5 * planet.radius);
        ellipse(0, 0, planet.distance * 2);
      }

      planet.show();
    }
    pop();
  }
}
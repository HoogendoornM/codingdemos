let sun;
let showConnections;
let autoRotate;
let orbitSpeedSlider;
let moonDepthSlider;
let depth;
let bgColorPicker;

let cam;

function setup() {
  let canvas = createCanvas(600, 600, WEBGL);
  canvas.elt.oncontextmenu = () => false;

  // https://github.com/freshfork/p5.EasyCam
  cam = createEasyCam({ distance: 600 });
  cam.rotateX(150);

  showConnections = createCheckbox("Show connections", false);
  autoRotate = createCheckbox("Auto rotate", false);

  createDiv('Orbit Speed');
  orbitSpeedSlider = createSlider(0, 10, 1, 0.1);

  createDiv('Moon depth');
  moonDepthSlider = createSlider(1, 6, 2, 1);
  depth = moonDepthSlider.value();

  bgColorPicker = createColorPicker(color(25));
  sliderLabel = createDiv("Background");
  bgColorPicker.parent(sliderLabel);

  sun = new Planet(random(15, 35), 0);
  sun.spawnMoons(random(1, 5), 1);
}

function draw() {
  if (autoRotate.checked()) {
    cam.rotateX(0.001);
    cam.rotateY(0.001);
    cam.rotateZ(0.001);
  }

  //ambientLight(200, 200, 200);
  //directionalLight(255, 255, 255, 0, 0, -1);
  lights();

  if (depth != moonDepthSlider.value()) {
    sun = new Planet(random(15, 35), 0);
    sun.spawnMoons(random(1, 5), 1);
    depth = moonDepthSlider.value();
  }

  background(bgColorPicker.color());
  sun.show();
  sun.orbit();
}

class Planet {
  constructor(r, d, o = 0, c = color(255, 255, 10)) {
    this.v = p5.Vector.random3D();
    this.color = c;
    this.orbitSpeed = o;
    this.radius = r;
    this.distance = d;
    this.v.mult(this.distance);
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
      let d = random(r + this.radius, r + this.radius * 8);

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

    // Get a perpendicular vector
    let v2 = createVector(1, 0, 1);
    let p = this.v.cross(v2);

    if (p.x != 0 || p.y != 0 || p.z != 0) {
      rotate(this.angle, p);
    }

    if (showConnections.checked()) {
      stroke(255);
      line(0, 0, 0, this.v.x, this.v.y, this.v.z);
      noStroke();
    }

    translate(this.v.x, this.v.y, this.v.z);
    sphere(this.radius);

    for (let planet of this.planets) {
      planet.show();
    }
    pop();
  }
}
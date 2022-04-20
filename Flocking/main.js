const flock = [];

function setup() {
  createCanvas(600, 600);
  textSize(15);

  sliderLabel = createDiv('Range ');
  flockRangeSlider = createSlider(0, 200, 50, 1);

  sliderLabel = createDiv('Align force ');
  alignForceSlider = createSlider(0, 5, 1.3, 0.1);

  sliderLabel = createDiv('Cohesion force ');
  cohesionForceSlider = createSlider(0, 5, 1, 0.1);

  sliderLabel = createDiv('Separation force ');
  separationForceSlider = createSlider(0, 5, 1, 0.1);

  shapeCheckbox = createCheckbox('Triangles', true);
  sizeCheckbox = createCheckbox('Random Size', false);
  colorCheckbox = createCheckbox('Colors', false);

  for (let i = 0; i < 100; i++) {
    flock.push(new Boid());
  }

}

function draw() {
  background(51);

  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }
}

// Coding Rainbow

var angle = 0;
var maxSteps = 0;
var steps = 0;
var slider;

function setup() {
  createCanvas(displayWidth / 2, displayHeight / 2);
  slider = createSlider(0, TWO_PI, PI / 4, 0.01);
  sliderSteps = createSlider(1, 13, 10, 1);
  sliderLenMul = createSlider(0, 2, 0.7, 0.01);
  sliderWeightMul = createSlider(0, 1.1, 0.85, 0.01);
  sliderStartMul = createSlider(0.5, 10, 1, 0.01);
  sliderTipMul = createSlider(0.5, 10, 1, 0.01);
  tipColorPick = createColorPicker('#ed225d');
}

function draw() {
  background(51);
  angle = slider.value();
  maxSteps = sliderSteps.value();
  lenMul = sliderLenMul.value();
  weightMul = sliderWeightMul.value();
  startMul = sliderStartMul.value();
  tipColor = tipColorPick.value();
  tipMul = sliderTipMul.value();
  stroke(255);
  translate(width / 2, height);
  branch(height / 3.3, 0, 4, true);
}

function branch(len, steps, weight, first = false) {
  strokeWeight(weight);
  if (first) {
    line(0, 0, 0, -len / startMul);
    translate(0, -len / startMul);
  } else {
    line(0, 0, 0, -len);
    translate(0, -len);
  }
  steps++;
  if (steps <= maxSteps) {
    if (steps == maxSteps) {
      weight *= tipMul;
      stroke(tipColor);
    }
    push();
    rotate(angle);
    branch(len * lenMul, steps, weight * weightMul);
    pop();
    push();
    rotate(-angle);
    branch(len * lenMul, steps, weight * weightMul);
    pop();
  }
}


let r, g, b;
let brain;
let hiddenSize = 3;

let choice = "white";

function setup() {
  createCanvas(600, 600);
  noLoop();


  pickColor();

  let storedBrain = getCookie("nnColorPred");
  if (storedBrain != null) {
    brain = NeuralNetwork.deserialize(storedBrain);
    console.log("Loaded stored neural network");
  } else {
    brain = new NeuralNetwork(3, hiddenSize, 2);
  }

  let resetButton = createButton("Reset");
  resetButton.mousePressed(resetNN);
  let trainButton = createButton("Auto train");
  trainButton.mousePressed(trainNN);
}

// reset the neural network to untrained state
function resetNN() {
  console.log("Resetting NN");
  brain = new NeuralNetwork(3, hiddenSize, 2);
  setCookie("nnColorPred", brain.serialize(), 7);
  redraw();
}

function trainNN() {
  for (let i = 0; i < 1000; i++) {
    r = random(255);
    g = random(255);
    b = random(255);
    redraw();

    let input = [r / 255, g / 255, b / 255];
    let target;
    if (r + g + b < 350) {
      target = [0, 1]; // chosen white (1)
    } else {
      target = [1, 0]; // chosen black (0)
    }

    brain.train(input, target);
  }
}

function draw() {

  background(color(r, g, b));

  strokeWeight(4);
  stroke(0);
  line(width / 2, 0, width / 2, height)

  noStroke();
  textSize(64);
  textAlign(CENTER);

  fill(0);
  text("Black", width * 0.25, height / 2);
  fill(255);
  text("White", width * 0.75, height / 2);

  let pred = predictColor(r, g, b);

  // if black higher proba than white
  if (pred[0] > pred[1]) {
    choice = "black";
  } else {
    choice = "white";
  }

  if (choice == "black") {
    fill(0);
    ellipse(width * 0.25, height / 2 - height * 0.25, 10);
  } else if (choice == "white") {
    fill(255);
    ellipse(width * 0.75, height / 2 - height * 0.25, 10);
  }

  fill(0);
  textSize(32);
  text(round(pred[0] * 100, 2), width * 0.25, height / 2 + height * 0.25);
  fill(255);
  textSize(32);
  text(round(pred[1] * 100, 2), width * 0.75, height / 2 + height * 0.25);

}

function predictColor(r, g, b) {
  let input = [r / 255, g / 255, b / 255];
  return brain.predict(input);

}

// Update the neural network when choice is made
function mousePressed() {


  if (mouseY > height) {
    return;
  }

  let input = [r / 255, g / 255, b / 255];
  let target;
  if (mouseX > width / 2) {
    target = [0, 1]; // chosen white (1)
    console.log("Picked white");
  } else {
    target = [1, 0]; // chosen black (0)
    console.log("Picked black");
  }

  // inputs the current color (normalised) and the target (chosen black or white)
  brain.train(input, target);

  setCookie("nnColorPred", brain.serialize(), 7);

  pickColor();
}

function pickColor() {
  r = random(255);
  g = random(255);
  b = random(255);
  redraw();
}

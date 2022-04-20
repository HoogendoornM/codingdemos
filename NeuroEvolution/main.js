const TOTAL = 500;
var gen = 1;
var genText;

var birds = [];
var savedBirds = [];
var pipes = [];

let counter = 0;
let speedSlider;
var spacingSlider;
var lastSpacing;

let bgBlack = false;

function setup() {
  createCanvas(600, 600);
  //frameRate(45); 

  genText = createDiv("Generation: " + gen.toString() + "\n");

  sliderLabel = createDiv('Speed ');
  speedSlider = createSlider(1, 100, 1, 1);
  speedSlider.parent(sliderLabel);

  sliderLabel = createDiv('Spacing ');
  spacingSlider = createSlider(50, 200, 125, 5);
  spacingSlider.parent(sliderLabel);
  lastSpacing = spacingSlider.value();

  let bgButton = createCheckbox("Flip colors");
  bgButton.mousePressed(toggleBg);

  for (let i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
  }
}

function toggleBg() {
  bgBlack = !bgBlack;
}

function draw() {
  for (let n = 0; n < speedSlider.value(); n++) {
    if (counter % 75 == 0) {
      pipes.push(new Pipe());
    }
    counter++;

    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();

      // remove bird if it hits pipe
      for (let j = birds.length - 1; j >= 0; j--) {
        if (pipes[i].hits(birds[j])) {
          savedBirds.push(birds.splice(j, 1)[0]);
        }
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    for (let i = birds.length - 1; i >= 0; i--) {
      if (birds[i].offscreen()) {
        savedBirds.push(birds.splice(i, 1)[0]);
      }
    }

    for (let bird of birds) {
      bird.think(pipes);
      bird.update();
    }

    // If all birds died 
    if (birds.length == 0) {
      counter = 0;
      nextGen();
      pipes = [];
    }
  }

  // Drawing
  if (bgBlack) {
    background(10);
  } else {
    background(250);
  }

  for (let bird of birds) {
    bird.show();
  }

  for (let pipe of pipes) {
    pipe.show();
  }


  // If changed spacing reset
  if (lastSpacing != spacingSlider.value()) {
    lastSpacing = spacingSlider.value();
    reset();
  }
}

function reset() {
  console.log("Reset");
  gen = 1;
  genText.html("Generation: " + gen.toString());
  birds = [];
  savedBirds = [];
  counter = 0;
  pipes = [];
  for (let i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
  }
}

// Learning part
function nextGen() {
  gen++;
  genText.html("Generation: " + gen.toString());
  console.log("Next generation");
  calcFitness();

  for (let i = 0; i < TOTAL; i++) {
    birds[i] = pickBird();
  }
  savedBirds = [];
}

function pickBird() {
  var index = 0;
  var r = random(1);

  while (r > 0) {
    r = r - savedBirds[index].fitness;
    index++;
  }
  index--;

  let bird = savedBirds[index];
  let child = new Bird(bird.brain);
  child.mutate();

  return child;
}

function calcFitness() {
  let sum = 0;
  for (let bird of savedBirds) {
    sum += bird.score;
  }

  for (let bird of savedBirds) {
    bird.fitness = bird.score / sum;
  }
}

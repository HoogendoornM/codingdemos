const r = 300;

let total = 0;
let inCircle = 0;
let piDiv;

let bestPi = 0.0;

function setup() {
  createCanvas(605, 605);

  background(51);
  noFill();
  stroke(255);
  strokeWeight(3);

  ellipse(height / 2, width / 2, r * 2, r * 2);
  rect(2.5, 2.5, r * 2, r * 2);

  amount = createSlider(0, 10, 1, 1);
  amount.style('width', width - 10 + 'px');

  piDiv = createDiv('Pi');
}

function draw() {
  translate(height / 2, width / 2);

  for (let i = 0; i < Math.exp(amount.value(), 2); i++) {

    let x = random(-r, r);
    let y = random(-r, r);

    let d = sqrt(x * x + y * y);

    if (d <= r) {
      inCircle++;
      stroke(0, 255, 0);
    } else {
      stroke(255, 0, 0);
    }
    total++;
    point(x, y);

    var pi = 4 * (inCircle / total);


    let bestDiff = abs(PI - bestPi);
    let diff = abs(PI - pi);

    if (diff < bestDiff) {
      bestDiff = diff;
      bestPi = pi;
    }
  }

  piDiv.html(pi + "<br>" + PI + " < True PI<br>" + bestPi + " < Best<br>");

}

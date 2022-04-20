class Bird {
    constructor(brain) {
        this.y = height / 2;
        this.x = 64;

        this.gravity = 0.7;
        this.lift = -12;
        this.velocity = 0;

        this.score = 0;
        this.fitness = 0;

        this.r = random(255);
        this.g = random(255);
        this.b = random(255);

        if (brain) {
            this.brain = brain.copy();
        } else {
            this.brain = new NeuralNetwork(5, 8, 1);
        }
    }

    show() {
        stroke(0);
        fill(this.r, this.g, this.b, 150);
        if (bgBlack) {
            stroke(255);
        }

        //ellipse(this.x, this.y, 32, 32);

        let size = 25;
        strokeWeight(1);
        push();
        translate(this.x, this.y);
        angleMode(DEGREES);
        rotate(-90 + this.velocity);
        triangle(0, 0, size, 0, size / 2, size * 1.2);
        pop();
    }

    mutate() {
        this.brain.mutate(0.1);
    }

    think(pipes) {

        // Find closest pipe in front
        let closestPipe = null;
        let closestD = Infinity;
        for (let i = 0; i < pipes.length; i++) {
            let d = (pipes[i].x + pipes[i].w) - this.x;
            if (d < closestD && d > 0) {
                closestPipe = pipes[i];
                closestD = d;
            }
        }

        let p = closestPipe;
        let input = [];

        input[0] = this.y / height;
        input[1] = p.top / height;
        input[2] = p.bottom / height;
        input[3] = p.x / width;
        input[4] = this.velocity / 10;

        let output = this.brain.predict(input);

        if (output[0] > 0.5 && this.velocity > 0) {
            this.up();
        }
    }

    up() {
        this.velocity += this.lift;
    }

    update() {
        this.score++;

        this.velocity += this.gravity;
        // this.velocity *= 0.9;
        this.y += this.velocity;
    }

    offscreen() {
        return (this.y > height || this.y < 0)
    }
}

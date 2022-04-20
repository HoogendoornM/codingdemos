class Boid {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(0.5, 3));
        this.acceleration = createVector();
        this.size = random(2, 20);
        this.maxForce = 0.2;
        this.maxSpeed = 3;

        this.r = random(50, 255);
        this.g = random(50, 255);
        this.b = random(50, 255);
    }

    show() {

        let size = 8;
        if (sizeCheckbox.checked()) {
            strokeWeight(this.size);
            size = this.size;
        } else {
            strokeWeight(8);
        }

        if (colorCheckbox.checked()) {
            stroke(color(this.r, this.g, this.b));
        } else {
            stroke(255);
        }

        if (shapeCheckbox.checked()) {
            strokeWeight(1);
            push();
            translate(this.position.x, this.position.y);
            rotate(this.velocity.heading() - radians(90));
            triangle(0, 0, size, 0, size / 2, size * 1.2);
            pop();
        } else {
            point(this.position.x, this.position.y);
        }
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
    }

    edges() {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }

    }

    flock(boids) {
        this.acceleration.mult(0); // start every flock calculation with no acceleration
        let alignment = 0;
        let cohesion = 0;
        let separation = 0;

        alignment = this.align(boids);
        alignment.mult(alignForceSlider.value());
        this.acceleration.add(alignment);

        cohesion = this.cohesion(boids);
        cohesion.mult(cohesionForceSlider.value());
        this.acceleration.add(cohesion);

        separation = this.separation(boids);
        separation.mult(separationForceSlider.value());
        this.acceleration.add(separation);


    }

    align(boids) {
        let range = flockRangeSlider.value();
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let distance = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && distance < range) {
                steering.add(other.velocity);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);

            steering.setMag(this.maxSpeed);


            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }

        return steering;
    }

    cohesion(boids) {
        let range = flockRangeSlider.value();
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let distance = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && distance < range) {
                steering.add(other.position);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);

            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }

        return steering;
    }

    separation(boids) {
        let range = flockRangeSlider.value();
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < range) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d * d);
                steering.add(diff);

                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);

            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }

        return steering;
    }
}
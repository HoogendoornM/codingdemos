class Pipe {
    constructor() {
        this.spacing = spacingSlider.value();
        this.top = random(height / 6, 3 / 4 * height);
        this.bottom = height - (this.top + this.spacing);
        this.x = width;
        this.w = 80;
        this.speed = 6;

        this.r = random(255);
        this.g = random(255);
        this.b = random(255);

        this.highlight = false;
    }

    hits(bird) {
        if (bird.y - 18 < this.top || bird.y > height - this.bottom) {
            if (bird.x > this.x && bird.x < this.x + this.w) {
                this.highlight = true;
                return true;
            }
        }
        this.highlight = false;
        return false;
    }

    show() {
        stroke(0);
        if (bgBlack) {
            stroke(255);
        }
        fill(this.r, this.g, this.b);
        if (this.highlight) {
            fill(255, 0, 0);
        }
        rect(this.x, 0, this.w, this.top);
        rect(this.x, height - this.bottom, this.w, this.bottom);
    }

    update() {
        this.x -= this.speed;
    }

    offscreen() {
        if (this.x < -this.w) {
            return true;
        } else {
            return false;
        }
    }
}

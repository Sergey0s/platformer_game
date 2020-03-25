let context, controller, rectangle, loop;

context = document.querySelector('canvas').getContext('2d');

context.canvas.height = 180;
context.canvas.width = 320;

// context.strokeStyle='#fff';
// context.lineJoin = 'round';
// context.lineWidth = 4;
// context.fillStyle = '#ff0f00';
// context.beginPath();
// context.moveTo(10,10);
// context.lineTo(100,300);
// context.lineTo(300,100);
// context.closePath();
// context.fill();
// // context.stroke();


class Rectangle {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = this.color;
        context.fill();
    }

    get bottom() {
        return this.y + this.height;
    }

    get left() {
        return this.x;
    }

    get right() {
        return this.x + this.width;
    }

    get top() {
        return this.y;
    }

    get centerX() {
        return this.x + this.width * 0.5;
    }

    get centerY() {
        return this.y + this.height * 0.5;
    }

    testCollision(rectangle) {
        return !(this.top > rectangle.bottom || this.right < rectangle.left || this.bottom < rectangle.top || this.left > rectangle.right);
    }

    resolveCollision(rectangle) {

        let vector_x = this.centerX - rectangle.centerX;
        let vector_y = this.centerY - rectangle.centerY;

        // is the y vector longer than the x vector?
        if (vector_y * vector_y > vector_x * vector_x) {// square to remove negatives

            // is the y vector pointing down?
            if (vector_y > 0) {

                this.y = rectangle.bottom;

            } else { // the y vector is pointing up

                this.y = rectangle.y - this.height;

            }

        } else { // the x vector is longer than the y vector

            // is the x vector pointing right?
            if (vector_x > 0) {

                this.x = rectangle.right;

            } else { // the x vector is pointing left

                this.x = rectangle.x - this.width;

            }

        }
    }
}

let red = new Rectangle(144, 0, 32, 32, "#ffd918");
let white = new Rectangle(context.canvas.width * 0.5 - 32, context.canvas.height- 32, 32, 32, "#630000");

red.jumping = true;
red.x_velocity = 0;
red.y_velocity = 0;

controller = {
    left: false,
    right: false,
    up: false,
    keyListener: function (event) {
        let keyState = (event.type === "keydown");

        switch (event.keyCode) {
            case 37:
                controller.left = keyState;
                break;
            case 38:
                controller.up = keyState;
                break;
            case 39:
                controller.right = keyState;
                break;
        }
    }
};


loop = function () {

    if (controller.up && !red.jumping) {
        red.y_velocity -= 20;
        red.jumping = true;
    }

    if (controller.left) red.x_velocity -= 0.5;
    if (controller.right) red.x_velocity += 0.5;

    red.y_velocity += 1.2;
    red.x += red.x_velocity;
    red.y += red.y_velocity;
    red.x_velocity *= 0.9;
    red.y_velocity *= 0.9;

    if (red.y > 180 - 32) {
        red.jumping = false;
        red.y = 180 - 32;
        red.y_velocity = 0;
    }

    if (red.x < -red.width) {
        red.x = 320
    } else if (red.x > 320) {
        red.x = -red.width;
    }


    context.fillStyle = '#e3ff82';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    red.draw();
    white.draw();

    if (red.testCollision(white)) {
        red.resolveCollision(white);

        context.beginPath();
        context.rect(red.x, red.y, red.width, red.height);
        context.rect(white.x, white.y, white.width, white.height);
        context.strokeStyle = "#131313";
        context.stroke();

        // draw the collision regions of the white rectangle (white X)
        context.beginPath();
        context.moveTo(white.centerX - white.width, white.centerY - white.height);
        context.lineTo(white.centerX + white.width, white.centerY + white.height);
        context.stroke();

        context.beginPath();
        context.moveTo(white.centerX + white.width, white.centerY - white.height);
        context.lineTo(white.centerX - white.width, white.centerY + white.height);
        context.stroke();

        // draw the line between the center points of the rectangles
        context.beginPath();
        context.moveTo(red.centerX, red.centerY);
        context.lineTo(white.centerX, white.centerY);
        context.lineWidth = 1;
        context.strokeStyle = "#0022ef";
        context.stroke();
    }

    window.requestAnimationFrame(loop);
};


window.addEventListener('keydown', controller.keyListener);
window.addEventListener('keyup', controller.keyListener);
window.requestAnimationFrame(loop);
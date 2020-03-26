let context, controller, map, size;
let output = document.querySelector('p');

context = document.querySelector("canvas").getContext("2d");

map = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1,
    1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1,
    1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

size = 32;

context.canvas.width = 16 * size;
context.canvas.height = 9 * size;


controller = {
    pointer_x:0,
    pointer_y:0,

    move:function(event) {
        let rectangle = context.canvas.getBoundingClientRect();
        controller.pointer_x = event.clientX - rectangle.left;
        controller.pointer_y = event.clientY - rectangle.top;
        if (controller.pointer_y < 0) {controller.pointer_y = 0;}
    }

};

function drawMap() {
    for (let index = 0; index < map.length; index++) {
        context.fillStyle = (map[index] === 1) ? "#000000" : "#ffffff";
        context.fillRect((index % 16) * size, Math.floor(index / 16) * size, size, size);
    }
}


loop = function() {

    let tile_x, tile_y, value;

    tile_x = Math.floor(controller.pointer_x / (context.canvas.width/16));
    tile_y = Math.floor(controller.pointer_y / (context.canvas.height/9));
    value = map[tile_y * 16 + tile_x];

    drawMap();

    context.fillStyle = "rgba(128, 128, 128, 0.5)";
    context.fillRect(tile_x * size, tile_y * size, size, size);

    output.innerHTML = "tile_x: " + tile_x + "<br>tile_y: " + tile_y + "<br>value: " + value;

    window.requestAnimationFrame(loop);

};

context.canvas.addEventListener("mousemove", controller.move);

window.requestAnimationFrame(loop);
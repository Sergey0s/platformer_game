let controller, display, game;

controller = {

    down: false,
    left: false,
    right: false,
    up: false,

    keyUpDown: function (event) {
        let key_state = (event.type === "keydown") ? true : false;
        switch (event.keyCode) {
            case 37:
                controller.left = key_state;
                break;
            case 38:
                controller.up = key_state;
                break;
            case 39:
                controller.right = key_state;
                break;
            case 40:
                controller.down = key_state;
                break;
        }
    }
};

display = {
    context: document.querySelector("canvas").getContext("2d"),
    output: document.querySelector("p"),

    render: function () {

        for (let index = game.world.map.length - 1; index > -1; --index) {
            this.context.fillStyle = (game.world.map[index] === 1) ? "#0099ff" : "#303840";
            this.context.fillRect((index % game.world.columns) * game.world.tile_size, Math.floor(index / game.world.columns) * game.world.tile_size, game.world.tile_size, game.world.tile_size);
        }

        this.context.fillStyle = game.player.color;
        this.context.beginPath();
        this.context.arc(game.player.x, game.player.y, game.player.radius, 0, Math.PI * 2);
        this.context.closePath();
        this.context.fill();

        this.output.innerHTML = "tile_x: " + game.player.tile_x + "<br>tile_y: " + game.player.tile_y + "<br>map index: " + game.player.tile_y + " * " + game.world.columns + " + " + game.player.tile_x + " = " + String(game.player.tile_y * game.world.columns + game.player.tile_x);
    },
};

game = {

    // when the counter reaches 0, a tile turns blue
    counter: Math.random() * 100,

    player: {
        color: "#ff9900",
        radius: 8,
        tile_x: undefined,// the x and y tile positions of the player
        tile_y: undefined,
        velocity_x: 0,
        velocity_y: 0,
        x: 160,
        y: 90

    },

    world: {
        columns: 16,
        rows: 9,
        tile_size: 20,
        map: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    },

    loop: function () {
        if (controller.down) {
            game.player.velocity_y += 0.5
        }
        if (controller.left) {
            game.player.velocity_x -= 0.5
        }
        if (controller.right) {
            game.player.velocity_x += 0.5
        }
        if (controller.up) {
            game.player.velocity_y -= 0.5
        }

        if (game.player.x - game.player.radius < 0) {
            game.player.velocity_x = 0;
            game.player.x = game.player.radius;
        } else if (game.player.x + game.player.radius > display.context.canvas.width) {
            game.player.velocity_x = 0;
            game.player.x = display.context.canvas.width - game.player.radius;
        }

        if (game.player.y - game.player.radius < 0) {
            game.player.velocity_y = 0;
            game.player.y = game.player.radius;
        } else if (game.player.y + game.player.radius > display.context.canvas.height) {
            game.player.velocity_y = 0;
            game.player.y = display.context.canvas.height - game.player.radius;

        }
        game.player.x += game.player.velocity_x;
        game.player.y += game.player.velocity_y;

        game.player.velocity_x *= 0.9;
        game.player.velocity_y *= 0.9;

        // calculate the x and y tile in the map that the player is standing on
        game.player.tile_x = Math.floor(game.player.x / game.world.tile_size);
        game.player.tile_y = Math.floor(game.player.y / game.world.tile_size);

        // set the tile the player is standing on to 0 in the map
        game.world.map[game.player.tile_y * game.world.columns + game.player.tile_x] = 0;

        let victory = true;
        for (let i = 0; i < game.world.map.length; i++) {
            if (game.world.map[i] === 1) {
                victory = false;
                break;
            }
        }

        if (victory) {
            controller.down = controller.left = controller.right = controller.up = false;
            game.counter = -1;// reset the counter to -1 so another blue square can be generated immediately
            alert("You have done it! You have vanquished the evil blue squares! But they will rise again...")
        }

        // when the counter reaches zero, make a random tile in the map a 1
        game.counter--;

        if (game.counter < 0) {
            game.counter = Math.random() * 150;// reset the counter to a random value between 0 and 150
            game.world.map[Math.floor(Math.random() * game.world.map.length)] = 1;// reset that random tile!
        }

        display.render();
        window.requestAnimationFrame(game.loop);
    }
};

display.context.canvas.height = 180;
display.context.canvas.width = 320;

window.addEventListener("keydown", controller.keyUpDown);
window.addEventListener("keyup", controller.keyUpDown);
game.loop();
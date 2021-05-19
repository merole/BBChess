//Create a Pixi Application
let app = new PIXI.Application({width: 512, height: 512, backgroundColor: 0xffffff});

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

let squareSize = app.renderer.width / 16;
console.log(squareSize)
PIXI.loader
    .add(["images/pawn.png"])
    .load(setup);


let pawn;

function setup() {
    for (let i = 0; i < 17; i++) {
        for (let j = 0; j < 17; j++) {
            let square = new PIXI.Graphics();
            if ((j + i) % 2 === 0) {
                square.beginFill(0xeeeed2);
            } else {
                square.beginFill(0x769656);
            }

            square.drawRect(i * squareSize, j * squareSize, squareSize, squareSize);
            square.endFill();
            app.stage.addChild(square)
        }
    }

    pawn = new PIXI.Sprite(
        PIXI.loader.resources["images/pawn.png"].texture
    );
    app.stage.addChild(pawn)
    pawn.width = squareSize;
    pawn.height = squareSize;
    pawn.vx = 0;
    pawn.interactive = true;
    pawn.buttonMode = true;
    pawn.on('pointerover', () => {
        socket.send('cus vyhulove')
    })

    app.ticker.add(d => gameLoop(d));

}

function update(delta) {
    pawn.x += pawn.vx;
}

function gameLoop(delta) {
    update(delta)
}

function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
        if (event.key === key.value) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
        }
    };

    //The `upHandler`
    key.upHandler = event => {
        if (event.key === key.value) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
            event.preventDefault();
        }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener(
        "keydown", downListener, false
    );
    window.addEventListener(
        "keyup", upListener, false
    );

    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };

    return key;
}

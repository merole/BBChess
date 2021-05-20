//Create a Pixi Application
let app = new PIXI.Application({width: 512, height: 512, backgroundColor: 0xffffff});

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

let squareSize = app.renderer.width / 16;
console.log(squareSize)
PIXI.loader
    .add(["images/pawn.png",
        "images/dot.png"])
    .load(setup);


let dot, pawns, dots;
pawns = [];
dots = [];

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

    for (let i = 0; i < 17; i++) {
        pawns.push(getBlackPawn(i, 1));
        app.stage.addChild(pawns[i]);
    }

    app.ticker.add(d => gameLoop(d));

}

function update(delta) {
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

function getBlackPawn(x, y) {
    let pawn = new PIXI.Sprite(PIXI.loader.resources["images/pawn.png"].texture);

    pawn.width = squareSize;
    pawn.height = squareSize;
    pawn.x = x * squareSize;
    pawn.y = y * squareSize;
    pawn.interactive = true;
    pawn.mousemode = true;
    pawn.move = false;
    pawn.on('pointerup', () => {
        pawn.move = false;
        if (dots.some(
            (dot) => {
                return (snap(dot.x) === snap(pawn.x)) && (snap(dot.y) === snap(pawn.y));
            }
        )) {
            pawn.x = snap(pawn.x) * squareSize;
            pawn.y = snap(pawn.y) * squareSize;
        } else {
            pawn.x = pawn.origin.x
            pawn.y = pawn.origin.y
        }
        pawn.origin = {x: pawn.x, y: pawn.y}
        destroy(dots);
        console.log(dots)
    });
    pawn.on('pointerdown', () => {
        pawn.move = true;
        pawn.origin = {x: pawn.x, y: pawn.y}
        if (snap(pawn.y) === 1) {
            dots = dots.concat(
                getDot(
                    [snap(pawn.x), snap(pawn.x)],
                    [2, 3]
                )
            );
            for (let i of dots) {
                app.stage.addChild(i)
            }
        } else {
            dots = dots.concat(
                getDot(
                    [snap(pawn.x)],
                    [snap(pawn.y) + 1]
                )
            );
            for (let i of dots) {
                app.stage.addChild(i)
            }
        }
    });
    pawn.on('pointermove', (event) => {
        if (pawn.move) {
            let e = event.data.global;
            pawn.x = e.x - squareSize / 2;
            pawn.y = e.y - squareSize / 2;
        }
    });

    return pawn
}

function getDot(x, y) {
    let ds = [];
    for (let i = 0; i < x.length; i++) {
        let dot = new PIXI.Sprite(PIXI.loader.resources["images/dot.png"].texture);
        dot.width = squareSize;
        dot.height = squareSize;
        dot.x = x[i] * squareSize;
        dot.y = y[i] * squareSize;
        ds.push(dot)
    }
    return ds;
}

function snap(a) {
    return Math.floor((a + squareSize / 2) / squareSize)
}

function destroy(a) {
    if (a instanceof Array) {
        for (let i of a) {
            i.destroy()
        }
        a.length = 0
    } else {
        a.destroy()
    }
}

//Create a Pixi Application
let app = new PIXI.Application({width: 512, height: 512, backgroundColor: 0xffffff});

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);


// Init loader
PIXI.loader
    .add(["images/pawn.png",
        "images/dot.png"])
    .load(setup);

// Init program-wise vars
let dot, pawns, dots, squareSize;
pawns = [];
dots = [];
squareSize = app.renderer.width / 16;

function setup() {

    // Draw squares to canvas
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

    // Add pieces
    for (let i = 0; i < 17; i++) {
        pawns.push(getBlackPawn(i, 1));
        app.stage.addChild(pawns[i]);
    }


    // Start game loop
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
    let alm = function(piece) {
        if (snap(piece.y) === 1) {
            dots = dots.concat(
                getDot(
                    [snap(piece.x), snap(piece.x)],
                    [2, 3]
                )
            );
            for (let i of dots) {
                app.stage.addChild(i)
            }
        } else {
            dots = dots.concat(
                getDot(
                    [snap(piece.x)],
                    [snap(piece.y) + 1]
                )
            );
            for (let i of dots) {
                app.stage.addChild(i);
            }
        }
    }

    return getPiece(x,y, 'pawn', alm)
}

function getPiece(x, y, img, addLegalMoves) {
    // Init
    let piece = new PIXI.Sprite(PIXI.loader.resources['images/' + img + '.png'].texture);
    piece.width = squareSize;
    piece.height = squareSize;
    piece.x = x * squareSize;
    piece.y = y * squareSize;
    piece.interactive = true;
    piece.mousemode = true;
    piece.move = false;

    piece.on('pointerdown', () => {
        piece.move = true;
        piece.origin = {x: piece.x, y: piece.y};
        addLegalMoves(piece)
    })
    piece.on('pointerup', () => {
        piece.move = false;
        if (dots.some(
            (dot) => {
                return (snap(dot.x) === snap(piece.x)) && (snap(dot.y) === snap(piece.y));
            }
        )) {
            piece.x = snap(piece.x) * squareSize;
            piece.y = snap(piece.y) * squareSize;
        } else {
            piece.x = piece.origin.x
            piece.y = piece.origin.y
        }
        piece.origin = {x: piece.x, y: piece.y}
        destroy(dots);
    })
    // Piece follows cursor
    piece.on('pointermove', (event) => {
        if (piece.move) {
            let e = event.data.global;
            piece.x = e.x - squareSize / 2;
            piece.y = e.y - squareSize / 2;
        }
    });

    return piece
}

// Dot factory, takes arrays
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

// Find nearest square
function snap(a) {
    return Math.floor((a + squareSize / 2) / squareSize)
}

// Destroy object in container or array
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

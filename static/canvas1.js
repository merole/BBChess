//Create a Pixi Application
let app = new PIXI.Application({width: 512, height: 512, backgroundColor:0xffffff});

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

let squareSize = app.head / 8;
PIXI.loader
    .add(["images/pawn.png"])
    .load(setup)

function setup() {
    let pawnSprite = new PIXI.Sprite(
        PIXI.loader.resources["images/pawn.png"].texture

    );
    app.stage.addChild(pawnSprite)
}




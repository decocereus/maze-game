let levels = [];

levels[0] = {
  map: [
    [1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 0, 1, 0],
  ],
  player: {
    x: 0,
    y: 4,
  },
  goal: {
    x: 4,
    y: 1,
  },
  theme: "default",
};
function Game(id, level) {
  this.el = document.getElementById(id);

  this.tileTypes = ["floor", "wall"];

  this.tileDim = 32;

  // inherit the level's properties: map, player start, goal start.
  this.map = level.map;
  this.theme = level.theme;
  this.player = { ...level.player };
  this.goal = { ...level.goal };
}

Game.prototype.populateMap = function () {
  this.el.className = "game-container " + this.theme;

  let tiles = document.getElementById("tiles");

  for (var y = 0; y < this.map.length; ++y) {
    for (var x = 0; x < this.map[y].length; ++x) {
      let tileCode = this.map[y][x];

      let tileType = this.tileTypes[tileCode];

      let tile = this.createEl(x, y, tileType);

      tiles.appendChild(tile); // add to tile layer
    }
  }
};
Game.prototype.createEl = function (x, y, type) {
  // create one tile.
  let el = document.createElement("div");

  // two class names: one for tile, one or the tile type.
  el.className = type;

  // set width and height of tile based on the passed-in dimensions.
  el.style.width = el.style.height = this.tileDim + "px";

  // set left positions based on x coordinate.
  el.style.left = x * this.tileDim + "px";

  // set top position based on y coordinate.
  el.style.top = y * this.tileDim + "px";

  return el;
};
Game.prototype.placeSprite = function (type) {
  // syntactic sugar
  let x = this[type].x;

  let y = this[type].y;

  // reuse the createTile function
  let sprite = this.createEl(x, y, type);

  sprite.id = type;

  // set the border radius of the sprite.
  sprite.style.borderRadius = this.tileDim + "px";

  // get half the difference between tile and sprite.

  // grab the layer
  let layer = this.el.querySelector("#sprites");

  layer.appendChild(sprite);

  return sprite;
};
Game.prototype.sizeUp = function () {
  // inner container so that text can be below it
  let map = this.el.querySelector(".game-map");

  // inner container, height. Need this.map
  map.style.height = this.map.length * this.tileDim + "px";

  map.style.width = this.map[0].length * this.tileDim + "px";
};
Game.prototype.movePlayer = function (event) {
  event.preventDefault();
  let actions = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  if (actions.indexOf(event.code) === -1) {
    //event.keyCode < 37 || event.keyCode > 40)
    return;
  }

  switch (event.code) {
    case "ArrowLeft":
      this.moveLeft();
      break;

    case "ArrowUp":
      this.moveUp();
      break;

    case "ArrowRight":
      this.moveRight();
      break;

    case "ArrowDown":
      this.moveDown();
      break;
  }
};
Game.prototype.checkGoal = function () {
  let body = document.querySelector("body");

  if (this.player.y == this.goal.y && this.player.x == this.goal.x) {
    body.className = "success";
  } else {
    body.className = "";
  }
};
Game.prototype.keyboardListener = function () {
  document.addEventListener("keydown", (event) => {
    this.movePlayer(event);

    this.checkGoal();
  });
};

/* movement helpers */

Game.prototype.moveLeft = function () {
  if (this.player.x == 0) {
    return;
  }

  let nextTile = this.map[this.player.y][this.player.x - 1];
  if (nextTile == 1) {
    return;
  }

  this.player.x -= 1;

  this.updateHoriz();
};
Game.prototype.moveUp = function () {
  if (this.player.y == 0) {
    return;
  }

  let nextTile = this.map[this.player.y - 1][this.player.x];
  if (nextTile == 1) {
    return;
  }

  this.player.y -= 1;

  this.updateVert();
};
Game.prototype.moveRight = function () {
  if (this.player.x == this.map[this.player.y].length - 1) {
    return;
  }
  let nextTile = this.map[this.player.y][this.player.x + 1];

  if (nextTile == 1) {
    return;
  }

  this.player.x += 1;

  this.updateHoriz();
};
Game.prototype.moveDown = function () {
  if (this.player.y == this.map.length - 1) {
    return;
  }
  let nextTile = this.map[this.player.y + 1][this.player.x];

  if (nextTile == 1) {
    return;
  }

  this.player.y += 1;

  this.updateVert();
};

/* dom update helpers */

Game.prototype.updateHoriz = function () {
  this.player.el.style.left = this.player.x * this.tileDim + "px";
};

Game.prototype.updateVert = function () {
  this.player.el.style.top = this.player.y * this.tileDim + "px";
};

/* initialization */

function init() {
  let myGame = new Game("game-container-1", levels[0]);

  myGame.populateMap();

  myGame.sizeUp();

  myGame.placeSprite("goal");

  let playerSprite = myGame.placeSprite("player");

  myGame.player.el = playerSprite;

  myGame.keyboardListener();
}

init();

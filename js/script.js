let levels = [];

// 1 stands for a wall 0 stands for a tile over which a player can move.
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
  this.tileDimension = 32;
  this.map = level.map;
  this.theme = level.theme;
  // We need to make copy of player and goal coordinates because they will change with each level
  this.player = { ...level.player };
  this.goal = { ...level.goal };
  this.player.el = null;
}

Game.prototype.populateMap = function () {
  this.el.className = "game-container" + this.theme;
  let tiles = document.getElementById("tiles");

  for (var y = 0; y < this.map.length; ++y) {
    for (var x = 0; x < this.map[y].length; ++x) {
      let tileCode = this.map[y][x];
      // We used 0,1 to signify tile types, now based on those values we get the tile type
      let tileType = this.tileTypes[tileCode];
      let tile = this.createEl(x, y, tileType);
      tiles.appendChild(tile);
    }
  }
};

Game.prototype.createEl = function (x, y, tileType) {
  let el = document.createElement("div");
  el.className = tileType;
  el.style.width = el.style.height = this.tileDimension + "px";
  el.style.left = x * this.tileDimension + "px";
  el.style.top = y * this.tileDimension + "px";
  return el;
};

Game.prototype.sizeUp = function () {
  let map = this.el.querySelector(".game-map");
  map.style.height = this.map.length * this.tileDimension + "px";
  map.style.width = this.map[0].length * this.tileDimension + "px";
};

Game.prototype.placeSprite = function (type) {
  let x = this[type].x;
  let y = this[type].y;
  let sprite = this.createEl(x, y, type);
  sprite.id = type;
  sprite.style.borderRadius = this.tileDimension + "px";
  let layer = this.el.querySelector("#sprites");
  layer.appendChild(sprite);
  return sprite;
};

// the event codes for up down right left on the keyboard are as follows:
//left:37
//up:38
//right:39
//down:40

Game.prototype.movePlayer = function (event) {
  event.preventDefault();
  let actions = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  //console.log(event.code);
  if (actions.indexOf(event.code) === -1) {
    console.log(event.code);
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

Game.prototype.keyboardListener = function () {
  document.addEventListener("keydown", (event) => {
    this.movePlayer(event);
  });
};

/*movement helpers */

Game.prototype.moveLeft = function (sprite) {
  let nextTile = this.map[this.player.y][this.player.x - 1];
  if (this.player.x == 0 || nextTile == 1) {
    console.log("thats a tile");
    return;
  }

  this.player.x -= 1;
  this.updateHoriz(sprite);
};

Game.prototype.moveUp = function () {
  let nextTile = this.map[this.player.y - 1][this.player.x];
  if (this.player.y == 0 || nextTile == 1) {
    console.log("thats a tile");
    return;
  }
  this.player.y -= 1;
  this.updateVert();
};

Game.prototype.moveRight = function (sprite) {
  let nextTile = this.map[this.player.y][this.player.x + 1];
  if (this.player.x == this.map[this.player.y].length - 1 || nextTile == 1) {
    console.log("thats a tile", nextTile);
    return;
  }
  this.player.x += 1;
  this.updateHoriz(sprite);
};

Game.prototype.moveDown = function () {
  let nextTile = this.map[this.player.y + 1][this.player.x];
  if (this.player.y == this.map.length - 1 || nextTile == 1) {
    console.log("thats a tile");
    return;
  }
  this.player.y += 1;
  this.updateVert();
};

/*dom update helpers*/

Game.prototype.updateVert = function () {
  this.player.el.style.top = this.player.y * this.tileDimension + "px";
};

Game.prototype.updateHoriz = function (sprite) {
  this.player.el.style.left = this.player.x * this.tileDimension + "px";
};

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

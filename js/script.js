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

function init() {
  let level = levels[0];
  let myGame = new Game("game-container-1", level);
  myGame.populateMap();
}

init();

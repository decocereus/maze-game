let app = {};

(function (context) {
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
  levels[1] = {
    map: [
      [1, 0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0],
      [0, 1, 0, 1, 0, 0],
    ],

    player: {
      x: 2,
      y: 4,
    },
    goal: {
      x: 4,
      y: 4,
    },
    theme: "grassland",
  };

  levels[2] = {
    map: [
      [1, 0, 1, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1, 0],
      [1, 0, 1, 1, 0, 0, 0],
      [1, 0, 0, 1, 0, 1, 0],
      [1, 1, 0, 0, 1, 0, 0],
    ],
    player: {
      x: 2,
      y: 4,
    },
    goal: {
      x: 6,
      y: 4,
    },
    theme: "dungeon",
  };

  function Game(id, level) {
    this.el = document.getElementById(id);
    this.level_idx = 0;
    this.tileTypes = ["floor", "wall"];

    this.tileDim = 62;

    this.map = level.map;
    this.theme = level.theme;
    this.player = { ...level.player };
    this.goal = { ...level.goal };
  }

  Game.prototype.collide = function () {
    this.player.el.className += "collide";
    let delay = 200;
    let obj = this;
    window.setTimeout(function () {
      obj.player.el.className = "player";
    }, delay);
    return 0;
  };

  Game.prototype.populateMap = function () {
    this.el.className = "game-container " + this.theme;

    let tiles = document.getElementById("tiles");

    for (var y = 0; y < this.map.length; ++y) {
      for (var x = 0; x < this.map[y].length; ++x) {
        let tileCode = this.map[y][x];

        let tileType = this.tileTypes[tileCode];

        let tile = this.createEl(x, y, tileType);

        tiles.appendChild(tile);
      }
    }
  };
  Game.prototype.createEl = function (x, y, type) {
    let el = document.createElement("div");

    el.className = type;

    el.style.width = el.style.height = this.tileDim + "px";

    el.style.left = x * this.tileDim + "px";

    el.style.top = y * this.tileDim + "px";

    return el;
  };
  Game.prototype.placeSprite = function (type) {
    let x = this[type].x;

    let y = this[type].y;

    let sprite = this.createEl(x, y, type);

    sprite.id = type;

    sprite.style.borderRadius = this.tileDim + "px";

    let layer = this.el.querySelector("#sprites");

    layer.appendChild(sprite);

    return sprite;
  };
  Game.prototype.sizeUp = function () {
    let map = this.el.querySelector(".game-map");

    map.style.height = this.map.length * this.tileDim + "px";

    map.style.width = this.map[0].length * this.tileDim + "px";
  };
  Game.prototype.movePlayer = function (event) {
    event.preventDefault();
    let actions = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (actions.indexOf(event.code) === -1) {
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
      this.collide();
      return;
    }

    let nextTile = this.map[this.player.y][this.player.x - 1];
    if (nextTile == 1) {
      this.collide();
      return;
    }

    this.player.x -= 1;

    this.updateHoriz();
  };
  Game.prototype.moveUp = function () {
    if (this.player.y == 0) {
      this.collide();
      return;
    }

    let nextTile = this.map[this.player.y - 1][this.player.x];
    if (nextTile == 1) {
      this.collide();
      return;
    }

    this.player.y -= 1;

    this.updateVert();
  };
  Game.prototype.moveRight = function () {
    if (this.player.x == this.map[this.player.y].length - 1) {
      this.collide();
      return;
    }
    let nextTile = this.map[this.player.y][this.player.x + 1];

    if (nextTile == 1) {
      this.collide();
      return;
    }

    this.player.x += 1;

    this.updateHoriz();
  };
  Game.prototype.moveDown = function () {
    if (this.player.y == this.map.length - 1) {
      this.collide();
      return;
    }
    let nextTile = this.map[this.player.y + 1][this.player.x];

    if (nextTile == 1) {
      this.collide();
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

  Game.prototype.buttonListeners = function (instruction_msg, goal_msg) {
    let up = document.getElementById("up");
    let left = document.getElementById("left");
    let down = document.getElementById("down");
    let right = document.getElementById("right");

    let obj = this;

    up.addEventListener("mousedown", function () {
      obj.moveUp();
      obj.checkGoal(instruction_msg, goal_msg);
    });

    down.addEventListener("mousedown", function () {
      obj.moveDown();
      obj.checkGoal(instruction_msg, goal_msg);
    });

    left.addEventListener("mousedown", function () {
      obj.moveLeft();
      obj.checkGoal(instruction_msg, goal_msg);
    });

    right.addEventListener("mousedown", function () {
      obj.moveRight();
      obj.checkGoal(instruction_msg, goal_msg);
    });
  };

  /* initialization */

  Game.prototype.changeLevel = function () {
    this.level_idx++;
    if (this.level_idx > levels.length - 1) {
      this.level_idx = 0;
    }
    let level = levels[this.level_idx];
    this.map = level.map;
    this.player = { ...level.player };
    this.goal = { ...level.goal };
  };

  Game.prototype.addMazeListener = function () {
    let map = this.el.querySelector(".game-map");
    let obj = this;
    map.addEventListener("mousedown", function (e) {
      if (obj.player.y != obj.goal.y || obj.player.x != obj.goal.x) {
        return;
      }
      obj.changeLevel();
      let layers = obj.el.querySelectorAll(".layer");
      for (layer of layers) {
        layer.innerHTML = "";
      }
      obj.placeLevel();
      obj.checkGoal();
    });
  };
  Game.prototype.addListeners = function () {
    this.keyboardListener();
    this.buttonListeners();
    this.addMazeListener();
  };
  Game.prototype.placeLevel = function () {
    this.populateMap();
    this.sizeUp();
    this.placeSprite("goal");
    let playerSprite = this.placeSprite("player");
    this.player.el = playerSprite;
  };

  context.init = function () {
    let myGame = new Game("game-container-1", levels[0]);

    // encapsulate for multi-level
    myGame.placeLevel();

    // add listeners
    myGame.addListeners();
  };
})(app);

app.init();

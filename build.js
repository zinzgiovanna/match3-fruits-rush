/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var State = {};
State.Idle = 0;
State.PickSecond = 1;
State.Swap = 2;
State.Score = 0;
State.Timer = 1;

var Shape = {};
Shape.SQUARE   = 0;
Shape.TRIANGLE = 1;
Shape.CIRCLE   = 2;
Shape.LAST     = 3;

module.exports = {
    State: State,
    Shape: Shape
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

var GameEvents = {};
GameEvents.CHIP_CLICKED = 'chip_clicked';

module.exports = GameEvents;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// Отримуємо розміри екрану
var screenWidth = window.innerWidth
var screenHeight = window.innerHeight;

// Ваші початкові значення x та y
var gridColumn = 8;
var gridRows = 8;

// Перевіряємо ширину екрану і змінюємо x відповідно
if (screenWidth < 480) {
    gridColumn = 4;
} else if (screenWidth >= 480 && screenWidth < 768) {
    gridColumn = 6;
} else if (screenWidth >= 768 && screenWidth < 1024) {
    gridColumn = 8;
} 
else {
    gridColumn =12;
}

// Перевіряємо висоту екрану і змінюємо y відповідно
if (screenHeight < 480) {
    gridRows = 4;
} else if (screenHeight >= 480 && screenHeight < 768) {
    gridRows = 8;
} else {
    gridRows = 8;
}

var renderer = new PIXI.WebGLRenderer(screenWidth, screenHeight, {antialias: false, transparent: true, resolution: 1});
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();

var Game = __webpack_require__(3);

// Додаємо фонове зображення
// var backgroundTexture = PIXI.Texture.from('./assets/bg.jpg');
// var background = new PIXI.Sprite(backgroundTexture);
// background.width = screenWidth;
// background.height = screenHeight;
// stage.addChild(background);

function app_init(next) {
    var game = new Game(gridRows, gridColumn);
    stage.addChild(game.getView());
    next();
}

function app_update() {
    requestAnimationFrame(app_update);
    stage.update();
    renderer.render(stage);
}

app_init(app_update);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var GameModel  = __webpack_require__(4);
var GameView   = __webpack_require__(5);
var GameEvents = __webpack_require__(1);
var State      = __webpack_require__(0).State;

function GameController(rows, cols) {

    this.state = null;
    this.first = null;  // first chip to swap
    this.second = null; // second chip to swap

    this.model = new GameModel(rows, cols)

    this.view = new GameView(rows, cols);
    this.view.x = (window.innerWidth - this.view.width) / 2;
    this.view.y = (window.innerHeight  - this.view.height) / 2;
    this.view.on(GameEvents.CHIP_CLICKED, this.onChipClicked, this);

    this.setChips();
    this.setState(State.Idle);
}

GameController.prototype.getView = function() {
    return this.view;
};

GameController.prototype.setState = function(state) {
    this.state = state;
};

GameController.prototype.setChips = function() {

    this.view.clear();
    var chips = this.model.chips;
    for (var row = 0; row < chips.length; ++row)
        for (var col = 0; col < chips[row].length; ++col)
            this.view.setChip(row, col, chips[row][col]);
};

GameController.prototype.onChipClicked = function(data) {

    if (this.state === State.Idle) {
        this.first = data;
        this.view.selectChip(data);
        this.setState(State.PickSecond);
    }
    else if (this.state === State.PickSecond) {
        var dx = Math.abs(this.first.row - data.row);
        var dy = Math.abs(this.first.col - data.col);
        if (dx > 1 || dy > 1 || dx == dy) {
            this.view.unselectChip(this.first);
            this.view.selectChip(data);
            this.first = data;
        }
        else {
            this.view.unselectChip(this.first);
            this.second = data;
            this.swap();
        }
    }
};

GameController.prototype.swap = function() {

    this.setState(State.Swap);
    this.model.swap(this.first, this.second);

    var swapTween = this.view.swap(this.first, this.second);
    swapTween.on(PIXI.TweenEvent.COMPLETE, this.checkResult, this);
};

GameController.prototype.checkResult = function() {

    var matches = this.model.getMatches();

    if (matches.length)
        this.removeMatches(matches);
    else if (this.first && this.second)
        this.reverseSwap();
    else if (!this.model.checkPossibilities())
        this.shuffle();
    else
        this.setState(State.Idle);
};

GameController.prototype.shuffle = function() {

    while (!this.model.checkPossibilities())
        this.model.shuffle();

    var chips = [];
    for (var row = 0; row < this.view.chips.length; ++row)
        chips = chips.concat(this.view.chips[row]);

    var lastTween = null;
    for (var row = 0; row < this.model.rows; ++row) {
        for (var col = 0; col < this.model.cols; ++col) {
            var i = -1;
            while (chips[++i].getShape() !== this.model.chips[row][col]) {}
            var coords = this.view.getCoords(row, col);
            lastTween = chips[i].addTween(new PIXI.Tween({x: coords.x, y: coords.y}, {duration: 1000}));
            chips.splice(i, 1);
        }
    }

    lastTween.on(PIXI.TweenEvent.COMPLETE, function() {
        this.setChips();
        this.setState(State.Idle);
    }, this);
};

GameController.prototype.removeMatches = function(matches) {

    this.first = null;
    this.second = null;
    // (State.Score == -1)? this.model.scores = 0: null;
    State.Score = this.model.scores
    // console.log();
    document.querySelector('#score-res').textContent = State.Score
    var removeTween = this.view.remove(matches);
    if (removeTween) {
        removeTween.on(PIXI.TweenEvent.COMPLETE, function() {
            this.model.generateNext(matches);
            this.animate(matches);
        }, this);
    }
};

GameController.prototype.reverseSwap = function() {

    this.model.swap(this.first, this.second);
    this.view.swap(this.first, this.second).on(PIXI.TweenEvent.COMPLETE, function() {
        this.setState(State.Idle);
    }, this);
};

GameController.prototype.animate = function(matches) {

    this.setChips();

    var longest = 1;
    for (var col = 0; col < matches.length; ++col) {
        var length = matches[col].length;
        if (length) {
            var shift = 1;
            var nextRow = matches[col][length - shift - 1];
            for (var row = matches[col][length - 1]; row >= 0; --row) {
                var prevRow = row - 1;
                while (prevRow === nextRow) {
                    shift++;
                    --prevRow;
                    nextRow = matches[col][length - shift - 1];
                }

                this.view.animate(row, col, shift);
                longest = Math.max(longest, shift);
            }
        }
    }

    this.view.addTween(new PIXI.TweenDummy(longest * 300)).on(PIXI.TweenEvent.COMPLETE, this.checkResult, this);
};

module.exports = GameController;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var Shape = __webpack_require__(0).Shape;

function GameModel(rows, cols)
{
    this.rows = rows;
    this.cols = cols;
    this.matchLength = 3;
    this.scores = 0;

    this.table = {};
    this.table[Shape.SQUARE] = 10;
    this.table[Shape.TRIANGLE] = 20;
    this.table[Shape.CIRCLE] = 30;

    this.chips = null;

    //randomize initial board
    this.init();
}

GameModel.prototype.init = function() {

    this.chips = [];

    for (var row = 0; row < this.rows; ++row) {
        this.chips.push(new Array(this.cols));
        for (var col = 0; col < this.cols; ++col) {

            // generate random shape while board has matches
            do
                this.chips[row][col] = Math.floor(Math.random() * Shape.LAST);
            while (this.getMatchLength(row, col, {x: -1, y: 0}) >= this.matchLength ||
                   this.getMatchLength(row, col, {x: 0, y: -1}) >= this.matchLength);
        }
    }

    while (!this.checkPossibilities())
        this.shuffle();
};

GameModel.prototype.getMatchLength = function(row, col, direction) {

    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols)
        return 0;

    // check match in pointed direction
    var shape = this.chips[row][col];
    var matchLength = 0;

    do
    {
        matchLength++;
        row += direction.y;
        col += direction.x;
    } while (this.chips[row] !== undefined &&
             this.chips[row][col] === shape);

    return matchLength;
};

GameModel.prototype.swap = function(first, second) {
    var temp = this.chips[first.row][first.col];
    this.chips[first.row][first.col] = this.chips[second.row][second.col];
    this.chips[second.row][second.col] = temp;
};

GameModel.prototype.generateNext = function(matches) {

    for (var col = 0; col < matches.length; ++col) {
        var length = matches[col].length;
        if (length) {

            var shift = 1;
            var nextRow = matches[col][length - shift - 1];
            for (var row = matches[col][length - 1]; row >= 0; --row) {
                var prevRow = row - 1;

                while (prevRow === nextRow) {
                    shift++;
                    --prevRow;
                    nextRow = matches[col][length - shift - 1];
                }

                if (row < length)
                    this.chips[row][col] = Math.floor(Math.random() * Shape.LAST);
                else
                    this.chips[row][col] = this.chips[row - shift][col];
            }
        }
    }
};

GameModel.prototype.shuffle = function() {

    this.shuffleRows();
    this.chips = this.transposeBoard();
    this.shuffleRows();

    var tmpRow, tmpCol;

    for (var row = 0; row < this.rows; ++row) {
        for (var col = 0; col < this.cols; ++col) {

            while (this.isMatchChip(row, col)) {
                tmpRow = Math.floor(Math.random() * this.rows);
                tmpCol = Math.floor(Math.random() * this.cols);

                this.swap({row: row, col: col}, {row: tmpRow, col: tmpCol});
                if (this.isMatchChip(row, col) || this.isMatchChip(tmpRow, tmpCol))
                    this.swap({row: row, col: col}, {row: tmpRow, col: tmpCol});
                else {
                    break;
                }
            }
        }
    }
};

GameModel.prototype.isMatchChip = function(row, col) {

    var horLength = this.getMatchLength(row, col, {x: -1, y: 0}) + this.getMatchLength(row, col, {x: 1, y: 0}) - 1;
    var verLength = this.getMatchLength(row, col, {x: 0, y: -1}) + this.getMatchLength(row, col, {x: 0, y: 1}) - 1;
    return horLength >= this.matchLength || verLength >= this.matchLength;
};

GameModel.prototype.shuffleRows = function() {

    var i = this.chips.length;
    var temp, j;

    while (i) {
        j = Math.floor(Math.random() * i--);
        temp = this.chips[i];
        this.chips[i] = this.chips[j];
        this.chips[j] = temp;
    }
};

GameModel.prototype.transposeBoard = function() {

    return this.chips[0].map(function(col, i) {
        return this.chips.map(function(row) {
            return row[i];
        }, this);
    }, this);
};

GameModel.prototype.getHorizontalMatches = function() {

    var matches = [];

    for (var row = 0; row < this.rows; ++row) {

        var buffer = [];
        var shape = this.chips[row][0];
        for (var col = 0; col < this.cols; ++col) {
            if (shape === this.chips[row][col]) {
                buffer.push({row: row, col: col});
            }
            else {
                if (buffer.length >= this.matchLength) {
                    this.scores += this.table[shape];
                    Array.prototype.push.apply(matches, buffer);
                }
                buffer = [{row: row, col: col}];
                shape = this.chips[row][col];
            }

            if (buffer.length >= this.matchLength && col === this.cols - 1) {
                this.scores += this.table[shape];
                Array.prototype.push.apply(matches, buffer);
            }
        }
    }
    return matches;
};

GameModel.prototype.getVerticalMatches = function() {

    var matches = [];

    for (var col = 0; col < this.cols; ++col) {

        var buffer = [];
        var shape = this.chips[0][col];
        for (var row = 0; row < this.rows; ++row) {
            if (shape === this.chips[row][col]) {
                buffer.push({row: row, col: col});
            }
            else {
                if (buffer.length >= this.matchLength) {
                    this.scores += this.table[shape];
                    Array.prototype.push.apply(matches, buffer);
                }
                buffer = [{row: row, col: col}];
                shape = this.chips[row][col];
            }

            if (buffer.length >= this.matchLength && row == this.rows - 1) {
                this.scores += this.table[shape];
                Array.prototype.push.apply(matches, buffer);
            }
        }
    }
    return matches;
};

GameModel.prototype.getMatches = function() {

    var matches = this.getHorizontalMatches();
    matches = matches.concat(this.getVerticalMatches());

    if (matches.length) {
        var result = new Array();
        for (var i = 0; i < this.cols; ++i) {
            result.push(new Array());
        }

        matches.forEach(function(match) {
            if (result[match.col].indexOf(match.row) === -1)
                result[match.col].push(match.row);
        });

        result.forEach(function(column) {
            column.sort();
        });

        // get all matches in array of sorted rows in each column

        return result;
    }
    else {
        return [];
    }
};

GameModel.prototype.checkPossibilities = function() {

    for (var row = 0; row < this.rows; ++row) {
        for (var col = 0; col < this.cols; ++col) {

            if (this.checkMatch(row, col, {x: 1, y: 0}, [{x: -2, y: 0}, {x: -1, y: -1}, {x: -1, y: 1}, {x: 2, y: -1}, {x: 3, y: 0}, {x: 2, y: 1}]))
                return true;

            if (this.checkMatch(row, col, {x: 2, y: 0}, [{x: 1, y: -1}, {x: 1, y: 1}]))
                return true;

            if (this.checkMatch(row, col, {x: 0, y: 1}, [{x: 0, y: -2}, {x: -1, y: -1}, {x: 1, y: -1}, {x: -1, y: 2}, {x: 1, y: 2}, {x: 0, y: 3}]))
                return true;

            if (this.checkMatch(row, col, {x: 0, y: 2}, [{x: -1, y: 1}, {x: 1, y: 1}]))
                return true;
        }
    }

    return false;
};

GameModel.prototype.checkMatch = function(row, col, mustHave, points) {

    // check if 'mustHave' chips has same shape
    if (!this.isMatch(row, col, mustHave))
        return false;

    // if at least one possible point has same shape, board has match move
    for (var i = 0; i < points.length; ++i)
        if (this.isMatch(row, col, points[i]))
            return true;

    return false;
};

GameModel.prototype.isMatch = function(row, col, cell) {

    var newRow = row + cell.y,
        newCol = col + cell.x;

    return newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols &&
           this.chips[row][col] === this.chips[newRow][newCol];
};

module.exports = GameModel;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var GameEvents = __webpack_require__(1);
var Chip       = __webpack_require__(6);

function GameView (rows, cols) {
    PIXI.Container.call(this);

    var screenWidth = window.innerWidth
    var screenHeight = window.innerHeight;

    this.cellWidth  = screenWidth>screenHeight?screenHeight/(rows+2):screenHeight/(rows+2);
    this.cellHeight = screenWidth>screenHeight?screenHeight/(rows+2):screenHeight/(rows+2);
    this.padding    = 5;
    this.chips      = [];

    var  bColor     = 0x006a8a;

    this.board = new PIXI.Container();
    this.addChild(this.board);

    // clip mask
    var mask = new PIXI.Graphics();
    mask.beginFill(0xFF0000);
    mask.drawRect(0, 0, (this.cellWidth + this.padding) * cols, (this.cellHeight + this.padding) * rows);
    mask.endFill();
    mask.attachTo(this);

    this.board.mask = mask;

    for (var row = 0; row < rows; ++row) {
        this.chips.push(new Array(cols));
        for (var col = 0; col < cols; ++col) {
            var cell = new PIXI.Graphics();
            cell.beginFill(bColor);
            cell.drawRect(0, 0, this.cellWidth, this.cellHeight);
            cell.endFill();
            cell.position = this.getCoords(row, col);
            this.board.addChild(cell);
        }
    }
};

GameView.prototype = Object.create(PIXI.Container.prototype);
GameView.prototype.constructor = GameView;

GameView.prototype.getCoords = function(row, col) {
    return {x: col * (this.cellWidth + this.padding), y: row * (this.cellHeight + this.padding)};
};

GameView.prototype.setChip = function(row, col, shape) {

    // var chip = new Chip(row, col, shape);
    var chip = new Chip(row, col, shape, this.cellWidth, this.cellHeight);
    chip.x = col * (this.cellWidth  + this.padding);
    chip.y = row * (this.cellHeight + this.padding);
    chip.on(GameEvents.CHIP_CLICKED, this.onChipClicked, this);

    this.chips[row][col] = chip;
    this.board.addChild(chip);
};

GameView.prototype.clear = function() {

    for (var row = 0; row < this.chips.length; ++row) {
        for (var col = 0; col < this.chips[row].length; ++col) {
            if (this.chips[row][col]) {
                this.chips[row][col].removeAllListeners();
                this.chips[row][col].detach();
                this.chips[row][col] = null;
            }
        }
    }
};

GameView.prototype.getChip = function(data) {
    return this.chips[data.row][data.col];
};

GameView.prototype.onChipClicked = function(event) {
    this.emit(GameEvents.CHIP_CLICKED, event);
};

GameView.prototype.selectChip = function(data) {
    this.chips[data.row][data.col].select();
};

GameView.prototype.unselectChip = function(data) {
    this.chips[data.row][data.col].unselect();
};

GameView.prototype.swap = function(first, second) {

    // swap two chips with animation
    var firstChip  = this.getChip(first),
        secondChip = this.getChip(second),
        duration = 300;

    this.chips[first.row][first.col]   = secondChip;
    this.chips[second.row][second.col] = firstChip;

    this.unselectChip(first);
    this.unselectChip(second);

    firstChip.addTween(new PIXI.Tween({x: secondChip.x, y: secondChip.y}, {duration: duration}));
    return secondChip.addTween(new PIXI.Tween({x: firstChip.x, y: firstChip.y}, {duration: duration}));
};

GameView.prototype.remove = function(matches) {

    // chip disappear animation
    var lastTween = null;

    for (var col = 0; col < matches.length; ++col)
        for (var i = 0; i < matches[col].length; ++i)
            lastTween = this.chips[matches[col][i]][col].hide();

    return lastTween;
};

GameView.prototype.animate = function(row, col, shift) {

    // slide chip animation
    var chip = this.chips[row][col];
    var origY = chip.y;
    chip.y -= shift * (this.cellHeight + this.padding);
    chip.addTween(new PIXI.Tween({y: origY}, {duration: shift * 300}));
};

module.exports = GameView;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var Shape = __webpack_require__(0).Shape;
var State = __webpack_require__(0).State;
var GameEvents = __webpack_require__(1);

function Chip(row, col, shape, shapeWidth, shapeHeight) {
  PIXI.Container.call(this);

  this.row = row;
  this.col = col;
  this.type = shape;

  this.shape = new PIXI.Container();

  switch (shape) {
    case Shape.SQUARE:
      var squareTexture = PIXI.Texture.from("./assets/img/1.svg");
      var squareSprite = new PIXI.Sprite(squareTexture);
      // squareSprite.width = 40;
      // squareSprite.height = 40;
      squareSprite.width = shapeWidth - 10;
      squareSprite.height = shapeHeight - 10;
      this.shape.addChild(squareSprite);

      break;
    case Shape.TRIANGLE:
      var triangleTexture = PIXI.Texture.from("./assets/img/2.svg");
      var triangleSprite = new PIXI.Sprite(triangleTexture);
      // triangleSprite.width = 40;
      // triangleSprite.height = 40;
      triangleSprite.width = shapeWidth - 10;
      triangleSprite.height = shapeHeight - 10;
      this.shape.addChild(triangleSprite);
      break;
    case Shape.CIRCLE:
      var circleTexture = PIXI.Texture.from("./assets/img/3.svg");
      var circleSprite = new PIXI.Sprite(circleTexture);
      // circleSprite.width = 40;
      // circleSprite.height = 40;
      circleSprite.width = shapeWidth - 10;
      circleSprite.height = shapeHeight - 10;
      this.shape.addChild(circleSprite);
      break;
    default:
      return;
  }

  this.shape.x = 5;
  this.shape.y = 5;
  this.shape.anchor.x = 0.5;
  this.shape.anchor.y = 0.5;
  this.addChild(this.shape);
  var self = this; // Capture the reference to this

  this.interactive = true;
  this.on("touchstart", this.onClick, this);
  this.on("mousedown", this.onClick, this);

  this.startTimer = function (durationMinutes) {
    var timer = durationMinutes * 60;
    let howMinuts = durationMinutes;
    var minutes, seconds;

    var intervalId = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);
      document.querySelector(".no-event").classList.add("none");
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      document.querySelector("#timer").innerHTML = minutes + ":" + seconds;

      document.querySelector("#score-res").textContent = State.Score;
      if (--timer < 0) {
        clearInterval(intervalId);
        document.querySelector(".no-event").classList.remove("none");
        // document.querySelector(".finish-game_modal").style.display = "block";
        // document.querySelector(".menu-btn").addEventListener("click", () => {
        //   location.reload();
        // });
        State.Timer = -1;
       
        setTimeout(() => {
          let storedData = JSON.parse(localStorage.getItem("my_three_game")) || {};
          let timeKey = parseInt(howMinuts);
          let modalScoreThree = document.querySelector('.score-item__three-text');
          let modalScoreFive = document.querySelector('.score-item__five-text');
          let modalScoreTen = document.querySelector('.score-item__ten-text');

          if (!(timeKey in storedData) || storedData[timeKey].score < State.Score) {
            storedData[timeKey] = { time: howMinuts, score: State.Score };
            localStorage.setItem("my_three_game", JSON.stringify(storedData));
          }

          modalScoreThree.textContent = storedData[3] ? storedData[3].score : '0';
          modalScoreFive.textContent = storedData[5] ? storedData[5].score : '0';
          modalScoreTen.textContent = storedData[10] ? storedData[10].score : '0';

          document
            .querySelector(".finish-game_btn")
            .addEventListener("click", () => {
              location.reload();
            });
          document.querySelector(".finish-game_modal").style.display = "flex";
        }, 1000);
      }
    }, 1000);
  };

  const timerItem = document.querySelectorAll(".timer_item");
  const modal = document.querySelector("#modal");

  timerItem.forEach((elem) => {
    elem.addEventListener("click", (e) => {
      modal.classList.add("none");
      if (e.target.id == "threeMin") {
        document.querySelector(".finish-game_modal").style.display = "none";
        self.startTimer(3);
      } else if (e.target.id == "fiveMin") {
        document.querySelector(".finish-game_modal").style.display = "none";
        self.startTimer(5);
      } else {
        document.querySelector(".finish-game_modal").style.display = "none";
        self.startTimer(10);
      }
    });
  });
}

Chip.prototype = Object.create(PIXI.Container.prototype);
Chip.prototype.constructor = Chip;

Chip.prototype.getShape = function () {
  return this.type;
};

Chip.prototype.onClick = function () {
  this.emit(GameEvents.CHIP_CLICKED, {
    row: this.row,
    col: this.col,
    shape: this.type,
  });
  new Audio("./assets/sounds/event.mp3").play();
};

Chip.prototype.select = function () {
  this.shape.scale.set(1.2);
  this.shape.x = 0;
  this.shape.y = 0;
};

Chip.prototype.unselect = function () {
  this.shape.scale.set(1);
  this.shape.x = 5;
  this.shape.y = 5;
};

Chip.prototype.hide = function () {
  if (State.Timer == 1) {
    this.shape.addTween(
      new PIXI.Tween({ rotation: 360 }, { duration: 1000, repeat: -1 })
    );
    var queue = new PIXI.TweenQueue();
    queue.add(new PIXI.Tween({ scale: { x: 1.2, y: 1.2 } }, { duration: 150 }));
    queue.add(new PIXI.Tween({ scale: { x: 0, y: 0 } }, { duration: 300 }));
    new Audio("./assets/sounds/magic-wand.mp3").play();
    this.shape.addTween(queue);
    return queue;
  }
  return;
};

module.exports = Chip;


/***/ })
/******/ ]);
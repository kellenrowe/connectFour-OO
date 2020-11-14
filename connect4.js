'use strict';

/** to add more than 2 players
 * need a button to add players (cant click after startgame is clicked)
 * which when clicked will add input field
 * need to accept variable number of player instances
 * 
 */

/** Connect Four
   *
   * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
   * column until a player gets four-in-a-row (horiz, vert, or diag) or until
   * board fills (tie)
   */
class Game {
  constructor(width = 7, height = 6,
    player1Color = "red", player2Color = "blue") {
    this.width = width;
    this.height = height;
    this.board = []; // array of rows, each row is array of cells  (board[y][x])

    this.currPlayer = new Player(player1Color); // active player
    this.otherPlayer = new Player(player2Color);

    this.handleClick = this.handleClick.bind(this);

    // refresh the board on DOM
    document.getElementById('board').innerHTML = "";

    this.makeBoard();
    this.makeHtmlBoard();
  }

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick); //try to put in constructor

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    setTimeout(alert, 200, msg);

    let topRow = document.querySelector("#column-top");
    topRow.removeEventListener("click", this.handleClick);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.color;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`${this.currPlayer.color} player won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // switch players
    [this.currPlayer, this.otherPlayer] = [this.otherPlayer, this.currPlayer];
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {

    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer.color
      );
    }

    let boundWin = _win.bind(this);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (boundWin(horiz) || boundWin(vert) ||
            boundWin(diagDR) || boundWin(diagDL)) {
          return true;
        }
      }
    }
  }
}


// The player class holds the color of the game pieces
class Player {
  constructor(color) {
    this.color = color;
  }
}

let startGameForm = document.querySelector("#startGame");
startGameForm.addEventListener("submit", startGame);

function startGame(evt) {
  evt.preventDefault();
  // let color1 = evt.target.p1Color.value || undefined;
  // let color2 = evt.target.p2Color.value || undefined;
  let playersList = [];
  for (let i = 0; i < numPlayers; i++) {
    let color = evt.target[`p${i + 1}Color`].value;
    let player = new Player(color);
    playersList.push(player);
  }
  
  new Game(7, 6, color1, color2);
}

let numPlayers = 2;
// add new player
let newPlayerButton = document.getElementById('newPlayerButton');
newPlayerButton.addEventListener('click', addNewPlayer);


function addNewPlayer(evt) {
  numPlayers++
  let newPlayerInput = document.createElement('input');
  newPlayerInput.setAttribute('placeholder', `Player ${numPlayers} Color`)
  newPlayerInput.setAttribute('id', `p${numPlayers}Color`)
  startGameForm.append(newPlayerInput);
}
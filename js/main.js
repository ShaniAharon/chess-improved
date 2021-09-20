var gBoard;
var gSelectedPiece = null;
const ROOK_WHITE = '♖';
const BISHOP_WHITE = '♗';
const KNIGHT_WHITE = '♘';
const QUEEN_WHITE = '♕';
const KING_WHITE = '♔';
const PAWN_WHITE = '♙';
const KING_BLACK = '♚';
const QUEEN_BLACK = '♛';
const ROOK_BLACK = '♜';
const BISHOP_BLACK = '♝';
const KNIGHT_BLACK = '♞';
const PAWN_BLACK = '♟';
const gWhitePieces = ['♙', '♖', '♗', '♘', '♕', '♔'];

function init() {
  gBoard = createBoard();
  printBoard(gBoard, '.gameBoard');
}

function createBoard() {
  var board = [];
  for (var i = 0; i < 8; i++) {
    board[i] = [];
    for (var j = 0; j < 8; j++) {
      if (i === 6) board[i][j] = PAWN_WHITE;
      else if (i === 1) board[i][j] = PAWN_BLACK;
      else board[i][j] = ``;
    }
  }
  board[7][7] = board[7][0] = ROOK_WHITE;
  board[7][2] = board[7][5] = BISHOP_WHITE;
  board[7][1] = board[7][6] = KNIGHT_WHITE;

  board[7][3] = QUEEN_WHITE;
  board[7][4] = KING_WHITE;

  board[0][7] = board[0][0] = ROOK_BLACK;
  board[0][2] = board[0][5] = BISHOP_BLACK;
  board[0][1] = board[0][6] = KNIGHT_BLACK;

  board[0][3] = QUEEN_BLACK;
  board[0][4] = KING_BLACK;

  console.table(board);
  return board;
}

function printBoard(board, selector) {
  var strHtml = '';
  board.forEach(function (cells, i) {
    strHtml += '<tr>';
    cells.forEach(function (cell, j) {
      var className = (i + j) % 2 === 0 ? 'white' : 'black';
      strHtml += `<td id="cell${i}-${j}" onclick="cellClicked(this)" class='${className}'> ${cell} </td>`;
    });
    strHtml += '</tr>';
  });
  var elBoard = document.querySelector(selector);
  elBoard.innerHTML = strHtml;
}

function cellClicked(elCell) {
  //move piece to mark location
  if (elCell.classList.contains('mark')) {
    movePiece(gSelectedPiece, elCell);
    removeMark();
    return;
  } else {
    removeMark();
  }
  gSelectedPiece = elCell;
  var pieceCoord = getCellCoord(elCell.id);
  var piece = gBoard[pieceCoord.i][pieceCoord.j];
  if (piece === ROOK_WHITE || piece === ROOK_BLACK) {
    var possibleCoords = getAllPossibleCoordsRook(pieceCoord);
    markCells(possibleCoords);
  }
  if (piece === BISHOP_WHITE || piece === BISHOP_BLACK) {
    var possibleCoords = getAllPossibleCoordsBishop(pieceCoord);
    markCells(possibleCoords);
  }
  if (piece === QUEEN_WHITE || piece === QUEEN_BLACK) {
    var possibleCoords = getAllPossibleCoordsQueen(pieceCoord);
    markCells(possibleCoords);
  }
  if (piece === KING_WHITE || piece === KING_BLACK) {
    var possibleCoords = getAllPossibleCoordsKing(pieceCoord);
    markCells(possibleCoords);
  }
  if (piece === KNIGHT_WHITE || piece === KNIGHT_BLACK) {
    var possibleCoords = getAllPossibleCoordsKnight(pieceCoord);
    markCells(possibleCoords);
  }
  if (piece === PAWN_WHITE || piece === PAWN_BLACK) {
    var possibleCoords = getAllPossibleCoordsPawn(pieceCoord);
    markCells(possibleCoords);
  }
}

// move selected piece to new marked location
function movePiece(elCellFrom, elCellTo) {
  var startPosition = getCellCoord(elCellFrom.id);
  var endPosition = getCellCoord(elCellTo.id);
  var piece = elCellFrom.innerText;
  //update MODEL
  gBoard[endPosition.i][endPosition.j] = piece;
  gBoard[startPosition.i][startPosition.j] = '';
  //update DOM
  elCellFrom.innerText = '';
  elCellTo.innerText = piece;
}

//gets cell id and return obj with i and j for the cell coord
function getCellCoord(strCellId) {
  var cellCoords = { i: 0, j: 0 };
  cellCoords.i = +strCellId.substring(4, strCellId.indexOf('-'));
  cellCoords.j = +strCellId.substring(strCellId.indexOf('-') + 1);
  return cellCoords;
}

//check if a cell is empty
function isEmptyCell(cellCoord) {
  return gBoard[cellCoord.i][cellCoord.j] === '';
}

//check if cell is white piece
function isWhite(pieceCoord) {
  var piece = gBoard[pieceCoord.i][pieceCoord.j];
  for (var i = 0; i < gWhitePieces.length; i++) {
    if (piece === gWhitePieces[i]) {
      return true;
    }
  }
  return false;
}

//mark all cells from the array of coords
function markCells(coords) {
  coords.forEach(function (coord) {
    var selector = `#cell${coord.i}-${coord.j}`;
    var elCell = document.querySelector(selector);
    elCell.classList.add('mark');
  });
}

//find all marked cells and remove the mark class
function removeMark() {
  var elTds = document.querySelectorAll('.mark');
  elTds.forEach(function (cell) {
    cell.classList.remove('mark');
  });
}

function getAllPossibleCoordsRook(pieceCoord) {
  var res = [];
  var maxLength = gBoard[pieceCoord.i].length;
  var isWhitePiece = isWhite(pieceCoord);
  //top
  for (var idx = pieceCoord.i - 1; idx >= 0; idx--) {
    var colCell = { i: idx, j: pieceCoord.j };
    //if white piece can move and eat black piece
    // else if black piece can move and eat white
    if (isWhitePiece) {
      if (!isEmptyCell(colCell) && !isWhite(colCell)) res.push(colCell);
    } else {
      if (!isEmptyCell(colCell) && isWhite(colCell)) res.push(colCell);
    }
    if (!isEmptyCell(colCell)) break;
    res.push(colCell);
  }
  //bottom
  for (var idx = pieceCoord.i + 1; idx < maxLength; idx++) {
    var colCell = { i: idx, j: pieceCoord.j };
    //if white piece can move and eat black piece
    // else if black piece can move and eat white
    if (isWhitePiece) {
      if (!isEmptyCell(colCell) && !isWhite(colCell)) res.push(colCell);
    } else {
      if (!isEmptyCell(colCell) && isWhite(colCell)) res.push(colCell);
    }
    if (!isEmptyCell(colCell)) break;
    res.push(colCell);
  }
  //right
  for (var idx = pieceCoord.j + 1; idx < maxLength; idx++) {
    var rowCell = { i: pieceCoord.i, j: idx };
    //if white piece can move and eat black piece
    // else if black piece can move and eat white
    if (isWhitePiece) {
      if (!isEmptyCell(rowCell) && !isWhite(rowCell)) res.push(rowCell);
    } else {
      if (!isEmptyCell(rowCell) && isWhite(rowCell)) res.push(rowCell);
    }
    if (!isEmptyCell(rowCell)) break;
    res.push(rowCell);
  }
  //left
  for (var idx = pieceCoord.j - 1; idx >= 0; idx--) {
    var rowCell = { i: pieceCoord.i, j: idx };
    //if white piece can move and eat black piece
    // else if black piece can move and eat white
    if (isWhitePiece) {
      if (!isEmptyCell(rowCell) && !isWhite(rowCell)) res.push(rowCell);
    } else {
      if (!isEmptyCell(rowCell) && isWhite(rowCell)) res.push(rowCell);
    }
    if (!isEmptyCell(rowCell)) break;
    res.push(rowCell);
  }
  return res;
}

function getAllPossibleCoordsBishop(pieceCoord) {
  var res = [];
  var maxLength = gBoard[pieceCoord.i].length;
  var currI = 0;
  var currJ = 0;
  var isWhitePiece = isWhite(pieceCoord);

  // top right
  currI = pieceCoord.i - 1;
  currJ = pieceCoord.j + 1;
  for (var idx = pieceCoord.j + 1; idx < maxLength; idx++) {
    var topRightDiagnolCell = { i: currI--, j: currJ++ };
    if (topRightDiagnolCell.i < 0 || topRightDiagnolCell.j < 0) break;
    //check if its white piece and allow to move to black piece and eat
    //same for black piece
    if (isWhitePiece) {
      if (!isEmptyCell(topRightDiagnolCell) && !isWhite(topRightDiagnolCell))
        res.push(topRightDiagnolCell);
    } else {
      if (!isEmptyCell(topRightDiagnolCell) && isWhite(topRightDiagnolCell))
        res.push(topRightDiagnolCell);
    }
    if (!isEmptyCell(topRightDiagnolCell)) break;
    res.push(topRightDiagnolCell);
  }

  // top left
  currI = pieceCoord.i - 1;
  currJ = pieceCoord.j - 1;
  for (var idx = pieceCoord.j - 1; idx >= 0; idx--) {
    var topLeftDiagnolCell = { i: currI--, j: currJ-- };
    if (topLeftDiagnolCell.i < 0 || topLeftDiagnolCell.j < 0) break;
    //check if its white piece and allow to move to black piece and eat
    if (isWhitePiece) {
      if (!isEmptyCell(topLeftDiagnolCell) && !isWhite(topLeftDiagnolCell))
        res.push(topLeftDiagnolCell);
    } else {
      if (!isEmptyCell(topLeftDiagnolCell) && isWhite(topLeftDiagnolCell))
        res.push(topLeftDiagnolCell);
    }
    if (!isEmptyCell(topLeftDiagnolCell)) break;
    res.push(topLeftDiagnolCell);
  }

  // bottom right
  currI = pieceCoord.i + 1;
  currJ = pieceCoord.j + 1;
  var downDis = 7 - pieceCoord.i;
  var rightDis = 7 - pieceCoord.j;
  var distance = downDis < rightDis ? downDis : rightDis;
  for (var idx = 0; idx < distance; idx++) {
    var bottomRightDiagnolCell = { i: currI++, j: currJ++ };
    if (bottomRightDiagnolCell.i < 0 || bottomRightDiagnolCell.j < 0) break;
    //check if its white piece and allow to move to black piece and eat
    //same for black piece
    if (isWhitePiece) {
      if (
        !isEmptyCell(bottomRightDiagnolCell) &&
        !isWhite(bottomRightDiagnolCell)
      )
        res.push(bottomRightDiagnolCell);
    } else {
      if (
        !isEmptyCell(bottomRightDiagnolCell) &&
        isWhite(bottomRightDiagnolCell)
      )
        res.push(bottomRightDiagnolCell);
    }
    if (!isEmptyCell(bottomRightDiagnolCell)) break;
    res.push(bottomRightDiagnolCell);
  }

  // bottom left
  currI = pieceCoord.i + 1;
  currJ = pieceCoord.j - 1;
  var downDis = 7 - pieceCoord.i;
  var distance = downDis < pieceCoord.j ? downDis : pieceCoord.j;
  for (var idx = 0; idx < distance; idx++) {
    var bottomLeftDiagnolCell = { i: currI++, j: currJ-- };
    if (bottomLeftDiagnolCell.i < 0 || bottomLeftDiagnolCell.j < 0) break;
    //check if its white piece and allow to move to black piece and eat
    //same for black piece
    if (isWhitePiece) {
      if (
        !isEmptyCell(bottomLeftDiagnolCell) &&
        !isWhite(bottomLeftDiagnolCell)
      )
        res.push(bottomLeftDiagnolCell);
    } else {
      if (!isEmptyCell(bottomLeftDiagnolCell) && isWhite(bottomLeftDiagnolCell))
        res.push(bottomLeftDiagnolCell);
    }
    if (!isEmptyCell(bottomLeftDiagnolCell)) break;
    res.push(bottomLeftDiagnolCell);
  }

  return res;
}

function getAllPossibleCoordsKing(pieceCoord) {
  var possibleMoves = [];
  var currI = pieceCoord.i - 1;
  var currJ = pieceCoord.j - 1;
  //TODO: make a  way to eat white pieces or black
  //TODO: castle
  //TODO: check ditiction
  //top
  if (pieceCoord.i) {
    for (var j = 0; j < 3; j++) {
      var cellCoord = { i: currI, j: currJ++ };
      if (!isEmptyCell(cellCoord)) continue;
      possibleMoves.push(cellCoord);
    }
  }

  //middle
  currI = pieceCoord.i;
  currJ = pieceCoord.j - 1;
  for (var j = 0; j < 3; j++) {
    var cellCoord = { i: currI, j: currJ++ };
    if (!isEmptyCell(cellCoord)) continue;
    possibleMoves.push(cellCoord);
  }

  //bottom
  currI = pieceCoord.i + 1;
  currJ = pieceCoord.j - 1;
  if (pieceCoord.i !== 7) {
    for (var j = 0; j < 3; j++) {
      var cellCoord = { i: currI, j: currJ++ };
      if (!isEmptyCell(cellCoord)) continue;
      possibleMoves.push(cellCoord);
    }
  }
  return possibleMoves;
}

function getAllPossibleCoordsPawn(pieceCoord) {
  var possibleMoves = [];
  var currI = pieceCoord.i;
  var currJ = pieceCoord.j;
  var isWhitePiece = isWhite(pieceCoord);
  //TODO: if a pawn gets to the end of board make it a queen or rook or knight

  //top

  //white pawn
  if (pieceCoord.i === 6 && isWhitePiece) {
    var cellCoord = { i: --currI, j: currJ };
    var whiteBlocked = false;
    isEmptyCell(cellCoord)
      ? possibleMoves.push(cellCoord)
      : (whiteBlocked = true);
    cellCoord = { i: --currI, j: currJ };
    isEmptyCell(cellCoord) && !whiteBlocked
      ? possibleMoves.push(cellCoord)
      : false;
  } else if (isWhitePiece && pieceCoord.i) {
    cellCoord = { i: --currI, j: currJ };
    isEmptyCell(cellCoord) ? possibleMoves.push(cellCoord) : false;
  }
  //balck pawn
  if (pieceCoord.i === 1 && !isWhitePiece) {
    var cellCoord = { i: ++currI, j: currJ };
    var blackBlocked = false;
    isEmptyCell(cellCoord)
      ? possibleMoves.push(cellCoord)
      : (blackBlocked = true);
    cellCoord = { i: ++currI, j: currJ };
    isEmptyCell(cellCoord) && !blackBlocked
      ? possibleMoves.push(cellCoord)
      : false;
  } else if (!isWhitePiece && pieceCoord.i !== 7) {
    cellCoord = { i: ++currI, j: currJ };
    isEmptyCell(cellCoord) ? possibleMoves.push(cellCoord) : false;
  }

  currI = pieceCoord.i;
  currJ = pieceCoord.j;
  if (isWhitePiece) {
    if (currJ) {
      // not the end of board
      var cellCoordLeft = { i: --currI, j: --currJ }; //left diagnol
      if (!isEmptyCell(cellCoordLeft) && !isWhite(cellCoordLeft))
        possibleMoves.push(cellCoordLeft);
    }
    currI = pieceCoord.i;
    currJ = pieceCoord.j;
    if (currJ < 7) {
      // not the end of board
      var cellCoordRIght = { i: --currI, j: ++currJ }; //right diagnol
      if (!isEmptyCell(cellCoordRIght) && !isWhite(cellCoordRIght))
        possibleMoves.push(cellCoordRIght);
    }
  } else {
    // black piece
    if (currJ) {
      // not the end of board
      var cellCoordLeft = { i: ++currI, j: --currJ }; //bottom left diagnol
      if (!isEmptyCell(cellCoordLeft) && isWhite(cellCoordLeft))
        possibleMoves.push(cellCoordLeft);
    }
    currI = pieceCoord.i;
    currJ = pieceCoord.j;
    if (currJ < 7) {
      // not the end of board
      var cellCoordRIght = { i: ++currI, j: ++currJ }; //right diagnol
      if (!isEmptyCell(cellCoordRIght) && isWhite(cellCoordRIght))
        possibleMoves.push(cellCoordRIght);
    }
  }

  return possibleMoves;
}

function getAllPossibleCoordsKnight(pieceCoord) {
  var possibleMoves = [];
  var isWhitePiece = isWhite(pieceCoord);
  var currI = pieceCoord.i - 2;
  var currJ = pieceCoord.j - 1;
  //top
  if (pieceCoord.i > 1) {
    var cellCoord = { i: currI, j: currJ };
    // top left
    if (pieceCoord.j) {
      if (isWhitePiece) {
        if (!isEmptyCell(cellCoord) && !isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      } else {
        if (!isEmptyCell(cellCoord) && isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      }
      isEmptyCell(cellCoord) ? possibleMoves.push(cellCoord) : false;
    }
    //top right
    if (pieceCoord.j !== 7) {
      cellCoord = { i: currI, j: (currJ += 2) };
      if (isWhitePiece) {
        if (!isEmptyCell(cellCoord) && !isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      } else {
        if (!isEmptyCell(cellCoord) && isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      }
      isEmptyCell(cellCoord) ? possibleMoves.push(cellCoord) : false;
    }
  }

  //bottom
  currI = pieceCoord.i + 2;
  currJ = pieceCoord.j - 1;
  if (pieceCoord.i < 6) {
    var cellCoord = { i: currI, j: currJ };
    // bottom left
    if (pieceCoord.j) {
      if (isWhitePiece) {
        if (!isEmptyCell(cellCoord) && !isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      } else {
        if (!isEmptyCell(cellCoord) && isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      }
      isEmptyCell(cellCoord) ? possibleMoves.push(cellCoord) : false;
    }
    // bottom right
    if (pieceCoord.j !== 7) {
      cellCoord = { i: currI, j: (currJ += 2) };
      if (isWhitePiece) {
        if (!isEmptyCell(cellCoord) && !isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      } else {
        if (!isEmptyCell(cellCoord) && isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      }
      isEmptyCell(cellCoord) ? possibleMoves.push(cellCoord) : false;
    }
  }

  //right
  currI = pieceCoord.i + 1;
  currJ = pieceCoord.j + 2;
  if (pieceCoord.j < 6) {
    var cellCoord = { i: currI, j: currJ };
    //right bottom
    if (pieceCoord.i !== 7) {
      if (isWhitePiece) {
        if (!isEmptyCell(cellCoord) && !isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      } else {
        if (!isEmptyCell(cellCoord) && isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      }
      isEmptyCell(cellCoord) ? possibleMoves.push(cellCoord) : false;
    }
    //right top
    if (pieceCoord.i) {
      cellCoord = { i: (currI -= 2), j: currJ };
      if (isWhitePiece) {
        if (!isEmptyCell(cellCoord) && !isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      } else {
        if (!isEmptyCell(cellCoord) && isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      }
      isEmptyCell(cellCoord) ? possibleMoves.push(cellCoord) : false;
    }
  }

  //left
  currI = pieceCoord.i + 1;
  currJ = pieceCoord.j - 2;
  if (pieceCoord.j > 1) {
    var cellCoord = { i: currI, j: currJ };
    //left bottom
    if (pieceCoord.i !== 7) {
      if (isWhitePiece) {
        if (!isEmptyCell(cellCoord) && !isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      } else {
        if (!isEmptyCell(cellCoord) && isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      }
      isEmptyCell(cellCoord) ? possibleMoves.push(cellCoord) : false;
    }
    //left top
    if (pieceCoord.i) {
      cellCoord = { i: (currI -= 2), j: currJ };
      if (isWhitePiece) {
        if (!isEmptyCell(cellCoord) && !isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      } else {
        if (!isEmptyCell(cellCoord) && isWhite(cellCoord))
          possibleMoves.push(cellCoord);
      }
      isEmptyCell(cellCoord) ? possibleMoves.push(cellCoord) : false;
    }
  }

  return possibleMoves;
}

function getAllPossibleCoordsQueen(pieceCoord) {
  var possibleMoves = [
    ...getAllPossibleCoordsRook(pieceCoord),
    ...getAllPossibleCoordsBishop(pieceCoord),
  ];
  return possibleMoves;
}

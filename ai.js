// AI code for playing tictactoe

var LINES = [ ['TL','TM','TR'], ['ML','MM','MR'], ['BL','BM','BR'],
              ['TL','ML','BL'], ['TM','MM','BM'], ['TR','MR','BR'],
              ['TL','MM','BR'], ['TR','MM','BL'] ];

var GSXToPlay = "XToPlay";
var GSOToPlay = "OToPlay";
var GSXWon = "XWon";
var GSOWon = "OWon";
var GSDraw = "Draw";
var GSUndefined = "Undefined";

//////////////////////////////////////////////////////////////////////////////
// Public functions
//////////////////////////////////////////////////////////////////////////////

var aiFlashWinRow = function(board) {
  var winLine = findWinLine(board);
  var newboard = toggleLine(board,winLine);
  return newboard;
}

var calcNewBoard = function(id,gamestate,board) {
  if (gamestate != GSXToPlay && gamestate != GSOToPlay) return board;
  var sym = board[id]; if (sym != '') return board;
  board[id] = (gamestate == GSXToPlay) ? 'X' : 'O';
  return board;
}

var calcNewGameState = function(oldgamestate,newboard) {
  var res = checkWinners(newboard);
  if (res != GSUndefined) return res;
  if (isDraw(newboard)) return GSDraw;
  if(oldgamestate == GSXToPlay) return GSOToPlay;
  return GSXToPlay;
}

//////////////////////////////////////////////////////////////////////////////
// Private functions
//////////////////////////////////////////////////////////////////////////////

var findWinLine = function(board) {
  var arrayLength = LINES.length;
  for (var i = 0; i < arrayLength; i++) {
    var res = checkLine(board,LINES[i]);
    if (res != GSUndefined) return LINES[i];
  }
  return null;
}

var toggleValue = function(val) {
  if (val == 'X') return 'X*';
  if (val == 'O') return 'O*';
  if (val == 'X*') return 'X';
  if (val == 'O*') return 'O';
  return '';
}

var toggleLine = function(board,line) {
  board[line[0]] = toggleValue(board[line[0]]);
  board[line[1]] = toggleValue(board[line[1]]);
  board[line[2]] = toggleValue(board[line[2]]);
  return board;
}

var checkLine = function(board, line) {
  var a1 = board[line[0]][0];
  var a2 = board[line[1]][0];
  var a3 = board[line[2]][0];
  if (a1 == a2 && a2 == a3) {
    if (a1 == 'X') return GSXWon;
    if (a1 == 'O') return GSOWon;
  }
  return GSUndefined;
}

var checkWinners = function(board) {
  var res = GSUndefined;
  var arrayLength = LINES.length;
  for (var i = 0; i < arrayLength; i++) {
    res = checkLine(board,LINES[i]);
    if (res != GSUndefined) return res;
  }
  return GSUndefined;
}

var isDraw = function(board) {
  var res = true;
  Object.keys(board).forEach(function(ind) {
    var a1 = board[ind];
    if (a1 != 'X' && a1 != 'O') res = false;
  });
  return res;
}

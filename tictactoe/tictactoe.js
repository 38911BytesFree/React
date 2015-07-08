/** @jsx React.DOM */

'use strict'

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

React.initializeTouchEvents(true);

//////////////////////////////////////////////////////////////////////////////
// Class Tile
//////////////////////////////////////////////////////////////////////////////

var Tile = React.createClass({
  getInitialState: function(){
    return {hovered: false};
  },
  toggleHovered: function(){
    this.setState({hovered: !this.state.hovered});
  },
  handleClick: function() {
    this.props.clicked(this.props.id);
  },
  computeClass: function() {
    if (this.props.sym != '') return this.props.sym;
    if (!this.state.hovered) return "";
    if (this.props.gamestate == GSXToPlay) return "cross over";
    if (this.props.gamestate == GSOToPlay) return "circle over";
    return "";
  },
  render: function() {
    return(<div
      className={this.props.background}
      onClick={this.handleClick}
      onMouseOver={this.toggleHovered}
      onMouseOut={this.toggleHovered}>
      <div className={this.computeClass()}></div>
      </div> );
  }
});

//////////////////////////////////////////////////////////////////////////////
// Class MsgWindow
//////////////////////////////////////////////////////////////////////////////

var MsgWindow = React.createClass({
  getInitialState: function(){
    return {hovered: false};
  },
  handleClick: function(e) {
    e.preventDefault();
    var gs = this.props.gamestate;
    if(gs == GSXWon || gs == GSOWon || gs == GSDraw)
      this.props.clicked();
  },
  toggleHovered: function(){
    this.setState({hovered: !this.state.hovered});
  },
  render: function() {
    var msg = (function() {
      var txt = "";
      if (this.props.gamestate == GSXWon) txt = "X Wins !";
      if (this.props.gamestate == GSOWon) txt = "O Wins !";
      if (this.props.gamestate == GSDraw) txt = "Draw !";
      if (txt != "" && this.state.hovered) txt = "Play Again?";
      return txt;
    }.bind(this))();
    return (
      <div
        className = "msgwindow"
        onClick={this.handleClick}
        onMouseOver={this.toggleHovered}
        onMouseOut={this.toggleHovered}>
        {msg}
      </div>
    );
  }
});

//////////////////////////////////////////////////////////////////////////////
// Class Board
//////////////////////////////////////////////////////////////////////////////

var Board = React.createClass({
  getTile: function(ind) {
    var xo = this.props.board[ind][0];
    return (('X' == xo) ? "cross" : (('O' == xo) ? "circle" : ""));
  },
  getTileBackground: function(ind) {
    var xo = this.props.board[ind];
    if (xo == 'X*' || xo == 'O*') return "cell win";
    return "cell";
  },
  render: function() {
    var tiles = [];
    Object.keys(this.props.board).forEach(function(ind) {
      tiles.push( <Tile
        id={ind} key={ind}
        sym={this.getTile(ind)}
        background={this.getTileBackground(ind)}
        gamestate={this.props.gamestate}
        clicked={this.props.clicked}
      />);
    }.bind(this));
    return (<div className="board">{tiles}</div>);
  }
});

//////////////////////////////////////////////////////////////////////////////
// Class App
//////////////////////////////////////////////////////////////////////////////

var App = React.createClass({
  getInitialState: function() {
    return {
      gamestate:GSXToPlay,
      board: { TL:'', TM:'', TR:'', ML:'', MM:'', MR:'', BL:'', BM:'', BR:'' }};
  },
  flashrow: function() {
    if (this.state.gamestate == GSXWon || this.state.gamestate == GSOWon) {
      var newboard = aiFlashWinRow(this.state.board);
      this.setState({ board: newboard });
    }
  },
  resetGame: function() {
    clearInterval(this.interval);
    this.setState(this.getInitialState());
  },
  handleClick: function(id) {
    var oldsym = this.state.board[id]; if(oldsym!='') { return; }
    var newboard = calcNewBoard(id,this.state.gamestate,this.state.board);
    var newgamestate = calcNewGameState(this.state.gamestate,newboard);
    if (newgamestate != this.state.gamestate && (newgamestate == GSXWon || newgamestate == GSOWon)) {
      this.flashrow();
      this.interval = setInterval(this.flashrow, 1000);
    }
    this.setState({
      gamestate:newgamestate,
      board: newboard});
  },
  render: function() {
    return(
      <div className="app">
      <Board
        clicked={this.handleClick}
        board={this.state.board}
        gamestate={this.state.gamestate} />
      <MsgWindow
        clicked={this.resetGame}
        gamestate={this.state.gamestate} />
      </div>);
  }
})

React.render(<App />, document.body);

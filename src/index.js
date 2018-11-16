import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const MASUNUM = 9;

class Square extends React.Component {
  /*  constructor(){
	super();
	this.state={
	value:null
	}
	}
  */
  render() {
	return (
	  <button className="square" onClick={()=>this.props.onClick()}>
		{this.props.value}	
	  </button>
    );
  }
}

class Board extends React.Component {
  /*  constructor(){
	super();
	this.state = {
	squares:Array(9).fill(null),
	xIsNext:true,
	}
    }*/
  renderSquare(j,i) {
    console.log(j + " " +i);
    return <Square key={j*MASUNUM+i} value={this.props.squares[j][i]} onClick={()=>this.props.onClick(j,i)} />;
  }
  render() {
	let a = new Array(MASUNUM).fill(null).map((_, i) => i);
    return (
	  <div>
		{a.map((y)=>
		       <div key={y} className="board-row">
		         {a.map((x)=>this.renderSquare(y,x))}
               </div>
       		  )}
	  </div>
	  /*
		</div>
		<div className="board-row">
        {this.renderSquare(0)}
        {this.renderSquare(1)}
        {this.renderSquare(2)}
        </div>
        <div className="board-row">
        {this.renderSquare(3)}
        {this.renderSquare(4)}
        {this.renderSquare(5)}
        </div>
        <div className="board-row">
        {this.renderSquare(6)}
        {this.renderSquare(7)}
        {this.renderSquare(8)}
        </div>
		</div>
	  */
    );
  }
}

class Game extends React.Component {
  constructor(){
	super();
	this.state = {
	  history:[
		{
		  squares:Array(MASUNUM).fill(null).map(()=>Array(MASUNUM).fill(null))
		}
	  ],
	  stepNumber:0,
	  xIsNext:true,
	};
    console.log("a length:" + this.state.history[0].squares.length);
  }
  render() {
	const history = this.state.history;
	const current = history[this.state.stepNumber];
	const winner = calculateWinner(current.squares);
	let status;
	if(winner){
	  status = 'winner:' + winner;
	}else{
	  status = 'next player:' + (this.state.xIsNext ? 'X' : 'O');
	}
	const moves = history.map((step,move,array) => {
	  console.log("step:"+ step.squares + " move:" + move + " array:" + array[0].squares);
	  const desc = move ? 'Move #' + move: 'Game start';
	  return (
		<li key={move}>
		  <a href="##" onClick={()=>this.jumpTo(move)}>{desc}</a>
		</li>
	  );
	});
	return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(j,i)=>this.handleClick(j,i)} />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
  handleClick(j,i){
	var history = this.state.history;
	var current = history[history.length -1];
	console.log("history rength:" + history.length);
	const squares = current.squares.slice();
	if(calculateWinner(squares) || squares[j][i]){
	  return;
	}
	squares[j][i] = this.state.xIsNext ? 'X' : 'O';
	this.setState({history:history.concat([{squares:squares}]),
				   stepNumber:history.length,
				   xIsNext: !this.state.xIsNext});
  }
  jumpTo(step){
	this.setState({
	  stepNumber:step,
	  xIsNext:(step % 2)? false : true
	});
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('container')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

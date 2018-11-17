import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const MASUNUM = 8;

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
    console.log("a length:" + JSON.stringify(this.state.history[0]["squares"][0][0]));
    this.state.history[0]["squares"][parseInt(MASUNUM/2)][parseInt(MASUNUM/2)] = 'X';
    this.state.history[0]["squares"][parseInt(MASUNUM/2)-1][parseInt(MASUNUM/2)] = 'O';
    this.state.history[0]["squares"][parseInt(MASUNUM/2)][parseInt(MASUNUM/2)-1] = 'O';
    this.state.history[0]["squares"][parseInt(MASUNUM/2)-1][parseInt(MASUNUM/2)-1] = 'X';
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
	//const squares = current.squares.slice();
    const squares = JSON.parse(JSON.stringify(current.squares));
    //	if(calculateWinner(squares) || squares[j][i]){
    let ap = searchReversiblePoints(squares,{y:j,x:i}, this.state.xIsNext ? 'X' : 'O');
    console.log("ap length:" + ap.length);
    if(ap.length === 0 || squares[j][i]){
      return;
	}
    reverseKoma(squares,ap, this.state.xIsNext ? 'X' : 'O');
    console.log("history length:" + history.length);
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

function isInBoard(p){
  return (0 <= p.y && p.y < MASUNUM) && (0 <= p.x && p.x <= MASUNUM);
}

function searchReversibleDir(squares,p,dir,player){
  let points = new Array(0);
  let pp = {y:p.y,x:p.x};
  pp.y += dir.y;
  pp.x += dir.x;
  let flag = false;
  while(isInBoard(pp)){
    if(player === squares[pp.y][pp.x]){
      flag = true;
      break;
    }else if(squares[pp.y][pp.x] === null){
      break;
    }
    points.push(Object.assign({},pp));
    pp.y += dir.y;
    pp.x += dir.x;   
  }
  if(flag){
    return points;
  }else{
    return [];
  }
}
/*
  関数概要：反転可能なマスの探索
  引数：squares ２次元配列, p 位置, player　プレイヤーの駒
  戻り値：反転可能なマス列
*/
function searchReversiblePoints(squares,p,player){
  let points = new Array(0);
  for(let j = -1;j <= 1;j++){
    for(let i = -1;i <= 1;i++){
      if(j === 0 && i === 0)continue;
      let ap = searchReversibleDir(squares,p,{y:j,x:i},player);
      if(ap.length > 0)points = points.concat(ap);
    }
  }
  return points;
}

function reverseKoma(squares,reversiblePoints,player){
  for(let p of reversiblePoints){
    console.log(p);
    squares[p.y][p.x] = player;
  }
}

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

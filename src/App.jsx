
import { useState } from "react";

function Square({ value, onSquareClick }) {
	return (
		<button type="button" className="square" onClick={onSquareClick}>
			{value}
		</button>
	);
}

function Board({ xIsNext, squares, onPlay, onRestart }) {
	//recibe los props
	function handleClick(i) {
		//cada vezz q se hace click
		if (calculateWinner(squares) || squares[i]) {
			//anaiza ganador o si tiene algo, no sigue la funcion
			return;
		}
		const nextSquares = squares.slice(); //como no hya ganador o algo, crea coipa de los array y ve a quien le toca
		if (xIsNext) {
			nextSquares[i] = "X";
		} else {
			nextSquares[i] = "O";
		}

		onPlay(nextSquares); //viene del game para que actualice el estado global
	}

	const winner = calculateWinner(squares);
	let status;
	let restartButton;
	if (winner) {
		status = `"Winner: ${winner} `;
	
	}
	else if(tie(squares)){
		status = "I'ts a tie!";
	 	restartButton = (
		<button type="button" className="restart" onClick={onRestart}>
		Restart Game
		</button>
		)
	}
	else {
		status = `Next player: ${xIsNext ? "X" : "O"}`;
	}


	const rowsBoard = [squares.slice(0, 3), squares.slice(3, 6), squares.slice(6, 9)].map( //genero las rows con slice de 3
		(row, rowIn) => {
			const key = `fila-${rowIn}`;
			return (
				<div key={key} className="rows">
					{row.map((_, column) => {
						// cuadrados de array row y sus indices
						const square = rowIn * 3 + column; 
						return (
							<Square key={square} value={squares[square]} onSquareClick={() => handleClick(square)}/> 
						);
					})}
				</div>
			);
		}
	);

	return (
		<>
			<div className="status">{status}</div>
			{restartButton}
			{rowsBoard}
		</>
	);
}

function tie(squares) {
  return squares.every(square => square !== null);
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

export default function Game() {
	const [history, setHistory] = useState([Array(9).fill(null)]); //array con un solo item, que es un
	const [currentMove, setCurrentMove] = useState(0); //numero del turno en el que estamos
	const xIsNext = currentMove % 2 === 0; //determina quien juega ahora, si e spar X si es impar O;
	const currentSquares = history[currentMove]; //tablero actual

	function handlePlay(nextSquares) {
		//disparado por onPlay(nextSquares) cada vez q hay click
		//nextSquares es el nuevo estado del tableroque viene de board
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; // aca 0, current move mas 1
		//"corta lo sobrante,mov que vamos a
		// eliminar para reemplazar con nextSquares cambiado la linea de tiempo"
		setHistory(nextHistory); //guardo nuevo historial
		setCurrentMove(nextHistory.length - 1); //guardo tablero actual
	} //llamada por el board para actualizar el juego

	function jumpTO(nextMove) {
		//nos permite movernos en el tiempo
		setCurrentMove(nextMove); //cambia el indice del talero porque currentSquares = history[currentMove].
	}

	const moves = history.map((_, move) => {
		//recorro el historial y le doy un boton a cada movimiento, si hacemos click, va a el
		let description;
		const key = `move-${move} `;
		if (move > 0) {
			description = `Go to move # + ${move}`;
		} else {
			description = ` Go to start #`;
		}
		return (
			<li key={key}>
				<button type="button" onClick={() => jumpTO(move)}>
					{description}
				</button>
			</li>
		);
	});
	function handlerRestart(){
	setHistory([Array(9).fill(null)]);
	setCurrentMove(0);
}

	//abajo le paso a board 3 props que para q ellos la controlen
	//xIsNext = de quien es el turno, squares = tablero atual,
	// onPlay= función que Board llama y actualiza el estado del juego en su padre game.
	return (
		<div className="game">
			<div className="game-board">
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} onRestart={handlerRestart} />
			</div>
			<div className="game-info">
				<ol>{moves}</ol>
			</div>
		</div>
	);
}

const Cell = () => {
	let value = 0;
	const insertValue = (v) => {
		value = v;
	}
	const getValue = () => value;
	return {insertValue, getValue};
}

const GameBoard  = (() => {
	let board = [];
	const rows = 3;
	const columns = 3

	//init the board and associating each cell to a struct
	const initBoard = () => {
		for (let i = 0; i < rows; i++){
			board[i] = [];
			for (let j = 0; j < columns; j++){
				board[i].push(Cell())
			}
		}
	}
	const getBoard = () => board;
	//get back value on each cell

	const boardValues = () => {
		return board.map((row, index) => {
			const boardWithVals = row.map((cell, _) =>  cell.getValue())
			return boardWithVals
		})
	}	
	
	return {getBoard, initBoard, boardValues};
})()

const Players = (() => {
	const player1 = {
		name : "X",
		score: 0,
	}
	const player2 = {
		name : 'Y',
		score: 0,
	}
	const incScore = (player) => {
		player.score += 1;
	}
	return {player1, player2};
})()

const gameController = (() => {

	//result 
	//turn 
	//players
	//select player
	//init the board
	GameBoard.initBoard();
	const boardValues = GameBoard.boardValues();
	//lauch a new game

	//define turn 
	//handle user input
	//check if board can be filed

	//check winner
	const alignWin = (boardValues) => {
		return boardValues.map((row) => {
			let previousValue = row[0];
			let notWin = false;
			row.map((value, index) => {
				if (previousValue !== value){
					notWin = true;
					previousValue = value;
				}
			})
			if (!notWin){
				return previousValue;
			}
		//need only for value per column/row, for winner check
		})[0]
	}

	const verticalTranspose = () =>  {
		return boardValues[0].map((_, colIndex) => {
			const columns = boardValues.map(row => row[colIndex])
			return columns
		})
	}

	const diagonalTranspose = () => {
		const leftDiagonal = boardValues.map((row, rowIndex) => row[rowIndex]);
		const rightDiagonal = boardValues.map((row, rowIndex) => row[row.length - 1 - rowIndex])
		return [leftDiagonal, rightDiagonal]
	}

	const checkWinner = () => {
		const horizontal = boardValues;
		const vertical = verticalTranspose();
		const diagonal = diagonalTranspose()
		return alignWin(horizontal) || alignWin(vertical) || alignWin(verticalTranspose(diagonal))
	} 

})()
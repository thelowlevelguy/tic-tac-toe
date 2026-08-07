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
	const getNumRow = () => rows;
	const getNumCol = () => columns;

	const boardValues = () => {
		return board.map((row, index) => {
			const boardWithVals = row.map((cell, _) =>  cell.getValue())
			return boardWithVals
		})
	}	
	
	return {getNumRow ,getNumCol ,getBoard, initBoard, boardValues};
})()

const Players = (() => {
	const player1 = {
		name : "X",
		username: "",
	}
	const player2 = {
		name : 'O',
		username: "",
	}
	return {player1, player2};
})()

const gameController = (() => {
	const numOfCell = GameBoard.getNumRow() * GameBoard.getNumCol();
	let filedCells = 0;
	const playerX = Players.player1;
	const playerO = Players.player2;
	//goole says this one plays first usually
	let turn = playerX.name;

	GameBoard.initBoard();
	let commonBoard = GameBoard.getBoard();
	let boardValues = GameBoard.boardValues();
	//lauch a new game

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
		const allLines = [...horizontal, ...vertical, ...diagonal]
		return alignWin(allLines)
	} 

	const insertionControl = () => {
		if (!checkWinner()){
			if(filedCells < numOfCell){
				//check who's player get the turn
				//const user clicked cell by row and column
				if (playerX.name === turn){
					//update board with user's piece
					commonBoard[0][2] = playerX.name
					//so now update the turn to playerO
					turn = playerO.name;
				
				}else{
					commonBoard[2][1] = playerO.name
					turn = playerX.name;
				}
				//update the board view
			}
		}
	} 
	insertionControl()
	console.log(commonBoard)

})()
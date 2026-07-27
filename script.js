const gameBoard  = (() => {
	let board = [];
	const rows = 3;
	const columns = 3

	for (let i = 0; i < rows; i++){
		board[i] = [];
		for (let j = 0; j < columns; j++){
			//define cell's value
			board[i].push()
		}
	}

	const getBoard = () => board; 

	const printBoard = () => {
		const B = board.map((row) =>
			row.map((cell) => cell.getValue())
		);
	}

	return {getBoard, printBoard};
})() 
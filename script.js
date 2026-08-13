const Cell = () => {
	let value = null;
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

	return {getBoard, initBoard};
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

const BoardDom = (() => {
	const boardContainer = document.getElementById("boardContainer");
	const renderBoard = (board) => {

		boardContainer.textContent = "";
		const boardDiv = document.createElement("div");
		boardDiv.setAttribute("id", "board");

		board.forEach((row, rowIndex) => {
			const rowDiv = document.createElement("div");
			rowDiv.setAttribute("class", "row")
			row.forEach((column, colIndex) => {
				const columnDiv = document.createElement("div");
				columnDiv.setAttribute("class", "column")
				columnDiv.setAttribute("data-id", `${rowIndex}-${colIndex}`)
				columnDiv.textContent = column.getValue();
				rowDiv.appendChild(columnDiv);
			})
			boardDiv.appendChild(rowDiv)
		})
		boardContainer.appendChild(boardDiv);
	}

	const markCell = (dataId, playerName) => {
		boardContainer.querySelector(`[data-id="${dataId}"]`).textContent = playerName;
	}

	const displayWinner = (winner) => {
		const winnerBoard = document.createElement("dialog")
		winnerBoard.id="winner-board"
		const winnerText = document.createElement("div")
		winnerText.setAttribute("id", "winner-text")
		winnerText.textContent = `${winner} Win!`
		winnerBoard.appendChild(winnerText)
		winnerBoard.style.border = "none"
		winnerBoard.style.width = "300px"
		winnerBoard.style.heigth = "100px"
		winnerBoard.style.display = "flex";
		winnerBoard.style.justifyContent = "center"
		winnerBoard.style.alignItems = "center"


		const style = document.createElement('style');
 		style.textContent = `

    		#winner-board::backdrop {
     		background: rgba(0, 0, 0, 0.6);
      		backdrop-filter: blur(3px);

    	}`;

    	document.head.appendChild(style)
    	boardContainer.appendChild(winnerBoard)
    	winnerBoard.showModal();

		setTimeout(() => {
			boardContainer.removeChild(winnerBoard)
			document.head.removeChild(style)
		}, 2000)
	}

	const resetBoard = () => {

	}

	return {renderBoard, markCell, displayWinner, renderBoard}
})()

const gameController = (() => {
	const playerX = Players.player1;
	const playerO = Players.player2;
	//goole says this one plays first usually
	let turn = playerX.name;

	GameBoard.initBoard();
	let board = GameBoard.getBoard();
	//get row's length from the first one
	const lenRow = board[0].length;

	//check winner
	const alignWin = (allLines) => {
		return allLines.some(line => {
			const first = line[0];
			if (first == null) return false;
			return line.every(value => value === first);
		})
	}

	const horizontalTranspose = () => {
		let horizontals = [];
		for (let i = 0; i < lenRow; i++){
			horizontals[i] = [];
			for (let j = 0; j < lenRow; j++){
				horizontals[i].push(board[i][j].getValue())
			}
		}
		return horizontals
	}

	const verticalTranspose = () =>  {
		const verticalRows = [];
		for (let i = 0; i < lenRow; i++){
			verticalRows[i] = [];
			for (let j = 0; j < lenRow; j++){
				verticalRows[i].push(board[j][i].getValue())
			}
		}
		return verticalRows
	}

	const diagonalTranspose = () => {
		const leftDiagonal = [];
		const rightDiagonal = [];

		for (let i = 0; i < lenRow; i++){
			leftDiagonal.push(board[i][i].getValue())
			rightDiagonal.push(board[i][lenRow - 1 - i].getValue())
		}
		return [leftDiagonal, rightDiagonal]
	}

	const checkWinner = () => {
		const horizontal = horizontalTranspose();
		const vertical = verticalTranspose();
		const diagonal = diagonalTranspose()
		const allLines = [...horizontal, ...vertical, ...diagonal]
		return alignWin(allLines)
	} 

	const insertionControl = () => {
		//check who's player get the turn
		//const user clicked cell by row and column
		let gameOver = false;
		const controller = new AbortController();
		boardContainer.addEventListener("click", (event)  => {
			if (gameOver){
				return
			}

			const dataId = event.target.getAttribute("data-id");
			if (!dataId){
				return
			}
			const [rowIndex, columnIndex] = dataId.split("-");
			if (board[rowIndex][columnIndex].getValue() === null){
				//update board with user's piece
				board[rowIndex][columnIndex].insertValue(turn)
				BoardDom.markCell(dataId, turn)
				//so now update the turn to playerO
				if (checkWinner()){
					gameOver = true
					controller.abort();
					//display winner for 2 secs
					BoardDom.displayWinner(turn);
					return
				}
				turn = turn === playerO.name ? playerX.name : playerO.name;
			}
		}, {signal : controller.signal})		
	}
	BoardDom.renderBoard(board);
	insertionControl()

})()
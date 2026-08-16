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
		mark : "X"
	}
	const player2 = {
		name : 'O',
		mark : "O",
	}

	const setPlayerName = (player, name) => {
		player.name = name;
	}
	return {player1, player2, setPlayerName};
})()

const BoardDom = (() => {
	const container = document.getElementById("container")
	const boardContainer = document.getElementById("boardContainer");
	const renderFormDialog = () => {
		
		const usernameDialog = document.createElement("dialog")
		usernameDialog.id = "username-dialog";

		const form = document.createElement("form")
		form.id = "user-form"
		const playerXBlock = document.createElement("div")
		const playerXLabel = document.createElement("label")
		const playerXInput = document.createElement("input")

		playerXLabel.textContent = "Player X";
		playerXInput.placeholder = "username"

		playerXLabel.htmlFor = "Player-X"
		playerXInput.name = "Player-X"

		playerXBlock.appendChild(playerXLabel)
		playerXBlock.appendChild(playerXInput)
		form.appendChild(playerXBlock)

		const playerOBlock = document.createElement("div")
		const playerOLabel = document.createElement("label")
		const playerOInput = document.createElement("input")

		playerOLabel.textContent = "Player O";
		playerOInput.placeholder = "username"

		playerOLabel.htmlFor = "Player-O"
		playerOInput.name = "Player-O"

		playerOBlock.appendChild(playerOLabel)
		playerOBlock.appendChild(playerOInput)
		form.appendChild(playerOBlock)

		const button = document.createElement("button")
		button.type = "submit"
		button.textContent = "Go"
		form.appendChild(button)

		usernameDialog.appendChild(form)
		container.appendChild(usernameDialog)
		usernameDialog.showModal()
	}

	const setUsername = () => {
		const dialog = document.getElementById("username-dialog")
		const form =  dialog.querySelector("#user-form")
		const formData = new FormData(form);
		let playerX = formData.get("Player-X") || "X";
		let playerO = formData.get("Player-O") || "O";	
		document.getElementById("player1").textContent = playerX;
		document.getElementById('player2').textContent = playerO;
		dialog.close()
		return [playerX, playerO]
	}

	const renderBoard = (board) => {
		boardContainer.textContent = "";
		const boardDiv = document.createElement("div");
		boardDiv.setAttribute("id", "board");

		board.forEach((row, rowIndex) => {
			const rowDiv = document.createElement("div");
			rowDiv.setAttribute("class", "row");
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

	const displayWinner = (gameResult) => {
		const winnerBoard = document.createElement("dialog")
		winnerBoard.id="winner-board"
		const winnerText = document.createElement("div")
		winnerText.setAttribute("id", "winner-text")
		winnerText.textContent = gameResult;
		winnerBoard.appendChild(winnerText)

    	boardContainer.appendChild(winnerBoard)
    	winnerBoard.showModal();

		setTimeout(() => {
			boardContainer.removeChild(winnerBoard)
		}, 2000)
	}

	const resetBoard = (board) => {
		renderBoard(board);
	}

	return {boardContainer, renderFormDialog, setUsername, markCell, displayWinner, renderBoard}
})()

const gameController = (() => {
	let playerX = Players.player1;
	let playerO = Players.player2;

	//goole says this one plays first usually
	let turn = playerX.mark;

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
		BoardDom.boardContainer.addEventListener("click", (event)  => {
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
					let winner = turn === playerO.mark ? playerO.name : playerX.name
					BoardDom.displayWinner(`${winner} win!`);
					return
				}
				turn = turn === playerO.mark ? playerX.mark : playerO.mark;
			}
			const isBoardFull = () => board.flat().every(cell => cell.getValue() !== null);
			if (isBoardFull()){
			    gameOver = true
			    controller.abort();
			    BoardDom.displayWinner("Draw"); // or a dedicated "draw" message
			    return
			}
		}, {signal : controller.signal})		
	}

	const setPlayerName = () => {
		const controller = new AbortController();
		const dialog = document.getElementById("username-dialog")
		dialog.addEventListener("submit", (event) => {
			event.preventDefault();
			players = BoardDom.setUsername()
			playerX.name = players[0]
			playerO.name = players[1]
			dialog.close()
			controller.abort()
			document.getElementById("container").removeChild(dialog)
		}, {signal : controller.signal})
	} 

	const initTurn = () =>  turn = playerX.mark;

	const startGame = () => {
		GameBoard.initBoard()	
		BoardDom.renderFormDialog();
		setPlayerName()
		BoardDom.renderBoard(board)
		initTurn()
		insertionControl()
	} 

	const restartGame = () => {
		GameBoard.initBoard()
		initTurn()
		BoardDom.renderBoard(board)
		insertionControl()
	}

	startGame()

	const startBtn = document.getElementById("start")
	startBtn.addEventListener("click", () => {
		startGame()
	})
	const restartBtn = document.getElementById("restart")
	restartBtn.addEventListener("click", () => {
		restartGame()
	})
})()
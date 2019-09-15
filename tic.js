// The goal is to have as little global code as possible using modules and factories.
// If you need one of something, use a module. If you need more than one, use a factory

// Gameboard Object

const Square = (x, y) => {
    const square = document.createElement('div');
    const fillSquare = content => {
        if (square.textContent === "") {
            square.textContent = content;
        }
    }
    const squareClicked = () => {
        logicController.squareClicked(posX, posY);
    }
    const getSquarePos = () => {
        return [posX, posY];
    }
    let posX = x;
    let posY = y;
    square.classList.add('square');
    square.addEventListener('click', squareClicked);
    return { square, fillSquare, getSquarePos };
}


const GameBoard = (() => {
    const pieces = ["X", "O"];
    const boardSideSize = 3;
    let board = [];
    for (let i = 0; i < boardSideSize; i++) {        
        for (let j = 0; j < boardSideSize; j++) {
            board.push(Square(i, j));
        }
    }
    return {
        pieces,
        board
    }
})();

const displayController = (() => {
    const render = gameBoard => {
        console.log(gameBoard)
        for (let i = 0; i < gameBoard.length; i++) {
            document.getElementById("board").appendChild(gameBoard[i].square);
        }
    }

    return {
        render
    }
})();

const logicController = (() => {
    const player = Symbol("player")
    const computer = Symbol("computer")
    let currTurn = player;
    let playSymbols = {
        player: "X",
        computer: "O"
    }

    const changePlayer = () => {
        (currTurn === player) ? currTurn = computer : currTurn = player;
    }

    const findSquare = (x, y)  => {
        return GameBoard.board.find(square => {
            let posToCheck = square.getSquarePos();
            return (posToCheck[0] === x) && (posToCheck[1] === y)
        })
    }

    const squareClicked = (x, y) => {
        let spotClicked = findSquare(x,y).square;
        console.log(spotClicked)
        if (spotClicked.textContent !== "") return;
        if (currTurn === player) {
            spotClicked.textContent = playSymbols.player;
        } else {
            spotClicked.textContent = playSymbols.computer;
        }
        let result = checkForWinner();
        if (result === false) changePlayer();
    }

    const checkForWinner = () => {
        let board = GameBoard.board;
        let boardValues = [];



    }

    return {
        squareClicked
    }
})();

function game() {
    displayController.render(GameBoard.board);
}

game();



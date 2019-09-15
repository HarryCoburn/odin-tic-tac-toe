// The goal is to have as little global code as possible using modules and factories.
// If you need one of something, use a module. If you need more than one, use a factory

// Gameboard Object

const Square = () => {
    const square = document.createElement('div');
    const fillSquare = content => {
        if (square.textContent === "") {
            square.textContent = content;
        }
        console.log(content);
    }
    square.classList.add('square');
    square.textContent = "";    
    return { square, fillSquare };
}


const gameBoard = (() => {
    const pieces = ["X", "O"];
    const boardSideSize = 3;
    let board = [];
    for (let i = 0; i < boardSideSize; i++) {
        board.push([]);
        for (let j = 0; j < boardSideSize; j++) {
            board[i][j] = Square();
        }
    }
    return {
        pieces,
        board
    }
})();

const displayController = (() => {
    const render = gameBoard => {
        for (let i = 0; i < gameBoard.length; i++) {            
            for (let j = 0; j < gameBoard.length; j++) {
                document.getElementById("board").appendChild(gameBoard[i][j].square);
            }

        }
    }

    return {
        render
    }
})();

displayController.render(gameBoard.board);

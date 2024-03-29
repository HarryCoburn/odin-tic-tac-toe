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
    const renderStartScreen = () => {
        let playerForm = document.createElement('form');
        playerForm.id = "playerNames";
        // Populate form with fields;
        let fieldNames = ["X player", "O player"]
        fieldNames.forEach(field => {
            let newField = document.createElement('input');
            newField.id = field;
            newField.type = "text";
            newField.name = field;
            let newLabel = document.createElement('label');
            newLabel.for = field;
            newLabel.textContent = field + ": "
            playerForm.appendChild(newLabel);
            playerForm.appendChild(newField);
        });
        document.getElementById("names").appendChild(playerForm)
        let startGame = document.createElement('button');
        startGame.id = "start";
        startGame.textContent = "Start Game"
        startGame.addEventListener('click', logicController.startGame)
        document.getElementById("names").appendChild(startGame)
    }


    const renderGame = (gameBoard, p1, p2) => {
        document.getElementById("board").style.visibility = "visible";
        let names = document.getElementById("names")
        names.innerHTML = `
        <p>X: ${p1}</p>
        <p>O: ${p2}</p>`        
        for (let i = 0; i < gameBoard.length; i++) {
            document.getElementById("board").appendChild(gameBoard[i].square);
        }
        let controls = document.getElementById("controls");    
        let playAgain = document.createElement('button');
        playAgain.id = "playAgain";
        playAgain.textContent = "Play Again?"
        playAgain.style.visibility = "hidden";
        playAgain.addEventListener('click', logicController.resetGame);
        controls.appendChild(playAgain);

    }

    const displayWinner = (winStr) => {
        document.getElementById("winStr").textContent = winStr;
        document.getElementById('playAgain').style.visibility = "visible";
    }
    

    return {
        renderGame,
        renderStartScreen,
        displayWinner
    }

    
})();

const logicController = (() => {
    const player = Symbol("player")
    const computer = Symbol("computer")
    const noWin = Symbol("no winner yet")
    const cat = Symbol("cat game")
    let currTurn = player;
    let playSymbols = {
        player: "X",
        computer: "O"
    }
    let p1 = "";
    let p2 = "";

    let result = noWin;

    const startGame = () => {        
        p1 = document.forms["playerNames"]["X player"].value || "Player 1";
        p2 = document.forms["playerNames"]["O player"].value || "Player 2";
        let startForm = document.getElementById("names");
        while (startForm.firstChild){
            startForm.removeChild(startForm.firstChild);
        };        
        displayController.renderGame(GameBoard.board, p1, p2);        
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
        if (spotClicked.textContent !== "" || result !== noWin) return;
        if (currTurn === player) {
            spotClicked.textContent = playSymbols.player;
        } else {
            spotClicked.textContent = playSymbols.computer;
        }
        result = winnerQ(0,1,2)  // check for 3-in-a-row horizontally
        ||  winnerQ(3,4,5) 
        ||  winnerQ(6,7,8) 
        ||  winnerQ(0,3,6)  // check for 3-in-a-row vertically
        ||  winnerQ(1,4,7) 
        ||  winnerQ(2,5,8) 
        ||  winnerQ(0,4,8)  // check for 3-in-a-row diagonally
        ||  winnerQ(6,4,2)
        ||  stalemateQ()
        || noWin;
        
        
        
        if (result === noWin) { changePlayer() }
        else {
            processWinner();
        };
    }

    const winnerQ = (p1, p2, p3) => {
        let s = (GameBoard.board.map(item => item.square.textContent)) 
        if (s[p1] === "") return false
        if (s[p1] !== s[p2]) return false
        if (s[p1] !== s[p3]) return false
        let playSymbols = {
            player: "X",
            computer: "O"
        }

        return (s[p1] === playSymbols.player)?player:computer;
    }

    const stalemateQ = () => {
        let s = (GameBoard.board.map(item => item.square.textContent))
        if (s.every(item => item !== "")) return cat;
    }    

    const processWinner = () => {
        let winStr = "";                
        if (result === player) { winStr = `${p1} Wins!` }
        if (result === computer) { winStr = `${p2} Wins!`}
        if (result === cat) { winStr = "It's a tie!"}
        displayController.displayWinner(winStr);
        
        
    }

    const resetGame = () => {
        currTurn = player;
        result = noWin;
        GameBoard.board.forEach(item => item.square.textContent = "");
        let playAgain = document.getElementById("playAgain");
        let winStr = document.getElementById("winStr");
        playAgain.style.visibility = "hidden";
        winStr.textContent = "";
    }

    return {
        squareClicked, resetGame, startGame
    }
})();

function game() {
    document.getElementById("board").style.visibility = "hidden";
    displayController.renderStartScreen();    
}

game();



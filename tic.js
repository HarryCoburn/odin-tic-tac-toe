// The goal is to have as little global code as possible using modules and factories.
// If you need one of something, use a module. If you need more than one, use a factory

// Gameboard Object

const gameBoard = (() => {
    const pieces = ["X", "O"];
    const board = [["X","X","X"],["X","X","X"],["X","X","X"]];
    return {
        pieces,
        board
    }
})();

const displayController = (() => {
    const render = gameBoard => {
        gameBoard.forEach(play => {
            let space = document.createElement('div');
            space.textContent = play;
            document.getElementById("board").appendChild(space);
        })
    }

return {
    render
}
})();

displayController.render(gameBoard.board);

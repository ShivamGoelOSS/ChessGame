var Bishop = function(config) {
    this.type = 'bishop';
    this.board = config.board;
    this.constructor(config);
};

Bishop.prototype = new Piece({});

Bishop.prototype.isValidPosition = function(targetPosition) {
    // Convert current position to row and column
    let currentCol = this.position.charAt(0);
    let currentRow = parseInt(this.position.charAt(1));

    // Convert target position to row and column
    let targetCol = targetPosition.col;
    let targetRow = parseInt(targetPosition.row);

    // Calculate column and row differences
    let colDiff = Math.abs(targetCol.charCodeAt(0) - currentCol.charCodeAt(0));
    let rowDiff = Math.abs(targetRow - currentRow);

    // Check if the move is valid (diagonal move: equal number of squares horizontally and vertically)
    if (colDiff === rowDiff) {
        // TODO: Check if the path is clear (no pieces in between)
        return true;
    }

    console.warn("Invalid move for bishop");
    return false;
};

Bishop.prototype.moveTo = function(targetPosition) {    
    if (this.isValidPosition(targetPosition)) {
        const targetPiece = this.board.getPieceAt(targetPosition);
        if (targetPiece && targetPiece.color !== this.color) {
            this.board.killPiece(targetPiece); // Kill the opponent's piece
        }
        this.position = targetPosition.col + targetPosition.row;
        this.render();
        return true;
    } else {
        // NOOP
        return false;
    }
};

Bishop.prototype.canAttack = function(targetPosition) {
    return this.isValidPosition(targetPosition);
};
Bishop.prototype.canAttack = function(targetPosition) {
    let currentCol = this.position.charAt(0);
    let currentRow = parseInt(this.position.charAt(1));
    let targetCol = targetPosition.col;
    let targetRow = parseInt(targetPosition.row);

    let colDifference = Math.abs(targetCol.charCodeAt(0) - currentCol.charCodeAt(0));
    let rowDifference = Math.abs(targetRow - currentRow);

    // Bishops move diagonally
    if (colDifference === rowDifference) {
        // Check if the diagonal path is clear
        return this.board.isDiagonalPathClear(this.position, targetPosition);
    }

    return false;
};
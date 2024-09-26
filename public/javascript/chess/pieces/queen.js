var Queen = function(config) {
    this.type = 'queen';
    this.board = config.board;
    Piece.call(this, config); // Call the Piece constructor
};

Queen.prototype = Object.create(Piece.prototype);
Queen.prototype.constructor = Queen;

Queen.prototype.isPathClear = function(targetPosition) {
    let currentCol = this.position.charCodeAt(0);
    let currentRow = parseInt(this.position.charAt(1));
    let targetCol = targetPosition.col.charCodeAt(0);
    let targetRow = parseInt(targetPosition.row);
    let colStep = targetCol > currentCol ? 1 : (targetCol < currentCol ? -1 : 0);
    let rowStep = targetRow > currentRow ? 1 : (targetRow < currentRow ? -1 : 0);

    let nextCol = currentCol + colStep;
    let nextRow = currentRow + rowStep;

    while (nextCol !== targetCol || nextRow !== targetRow) {
        if (this.board.getPieceAt({ col: String.fromCharCode(nextCol), row: nextRow })) {
            return false; // Path is blocked
        }
        nextCol += colStep;
        nextRow += rowStep;
    }

    return true; // Path is clear
};

Queen.prototype.isValidPosition = function(targetPosition) {
    // Convert current position to row and column
    let currentCol = this.position.charAt(0);
    let currentRow = parseInt(this.position.charAt(1));

    // Convert target position to row and column
    let targetCol = targetPosition.col;
    let targetRow = parseInt(targetPosition.row);

    // Calculate column and row differences
    let colDiff = Math.abs(targetCol.charCodeAt(0) - currentCol.charCodeAt(0));
    let rowDiff = Math.abs(targetRow - currentRow);

    // Check if the move is valid (same row, same column, or same diagonal)
    if ((currentCol === targetCol || currentRow === targetRow || colDiff === rowDiff) && this.isPathClear(targetPosition)) {
        return true;
    }

    console.warn("Invalid move for queen");
    return false;
};

Queen.prototype.moveTo = function(targetPosition) {    
    if (this.isValidPosition(targetPosition)) {
        const targetPiece = this.board.getPieceAt(targetPosition);
        if (targetPiece && targetPiece.color !== this.color) {
            this.board.killPiece(targetPiece); // Kill the opponent's piece
        }
        this.position = targetPosition.col + targetPosition.row;
        this.render();
        return true;
    } else {
        //NOOP
    }
};
Queen.prototype.canAttack = function(targetPosition) {
    let currentCol = this.position.charAt(0);
    let currentRow = parseInt(this.position.charAt(1));
    let targetCol = targetPosition.col;
    let targetRow = parseInt(targetPosition.row);

    let colDifference = Math.abs(targetCol.charCodeAt(0) - currentCol.charCodeAt(0));
    let rowDifference = Math.abs(targetRow - currentRow);

    // Queen can move like a Rook or a Bishop
    if (currentCol === targetCol || currentRow === targetRow) {
        // Straight line movement (like a Rook)
        return this.board.isPathClear(this.position, targetPosition);
    } else if (colDifference === rowDifference) {
        // Diagonal movement (like a Bishop)
        return this.board.isDiagonalPathClear(this.position, targetPosition);
    }

    return false;
};
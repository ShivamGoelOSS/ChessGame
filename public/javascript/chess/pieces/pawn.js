var Pawn = function(config){
    this.type = 'pawn';
    this.board = config.board;
    Piece.call(this, config); // Call the Piece constructor
};

Pawn.prototype = Object.create(Piece.prototype);

Pawn.prototype.isValidMove = function(targetPosition){
    // Convert current position to row and column
    let currentCol = this.position.charAt(0);
    let currentRow = parseInt(this.position.charAt(1));

    // Calculate the allowed move distance based on pawn color
    let moveDistance = this.color === 'white' ? 1 : -1;
    let initialRow = this.color === 'white' ? 2 : 7;

    // Check if the move is valid
    if (targetPosition.col === currentCol) {
        // Moving straight
        if (targetPosition.row === (currentRow + moveDistance).toString()) {
            // Regular one-square move
            return !this.board.getPieceAt(targetPosition); // Ensure the target position is empty
        } else if (currentRow === initialRow && targetPosition.row === (currentRow + 2 * moveDistance).toString()) {
            // Initial two-square move
            const intermediatePosition = { col: currentCol, row: (currentRow + moveDistance).toString() };
            return !this.board.getPieceAt(targetPosition) && !this.board.getPieceAt(intermediatePosition); // Ensure both positions are empty
        }
    } else if (Math.abs(targetPosition.col.charCodeAt(0) - currentCol.charCodeAt(0)) === 1 &&
               targetPosition.row === (currentRow + moveDistance).toString()) {
        // Diagonal capture
        const targetPiece = this.board.getPieceAt(targetPosition);
        if (targetPiece && targetPiece.color !== this.color) {
            return true; // Valid diagonal capture
        }
    }

    // If none of the above conditions are met, the move is invalid
    console.warn("Invalid move for pawn");
    return false;
}

Pawn.prototype.moveTo = function(targetPosition) {    
    if (this.isValidMove(targetPosition)) { // Changed to isValidMove
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
Pawn.prototype.canAttack = function(targetPosition) {
    let currentCol = this.position.charAt(0);
    let currentRow = parseInt(this.position.charAt(1));
    let targetCol = targetPosition.col;
    let targetRow = parseInt(targetPosition.row);

    let colDifference = Math.abs(targetCol.charCodeAt(0) - currentCol.charCodeAt(0));
    let rowDifference = this.color === 'white' ? targetRow - currentRow : currentRow - targetRow;

    // Pawns can attack diagonally forward one square
    return colDifference === 1 && rowDifference === 1;
};
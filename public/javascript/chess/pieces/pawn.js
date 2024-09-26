var Pawn = function(config){
    this.type = 'pawn';
    this.board = config.board;
    Piece.call(this, config); // Call the Piece constructor
};

Pawn.prototype = Object.create(Piece.prototype);

Pawn.prototype.isValidPosition = function(targetPosition){
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
            return true;
        } else if (currentRow === initialRow && targetPosition.row === (currentRow + 2 * moveDistance).toString()) {
            // Initial two-square move
            return true;
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
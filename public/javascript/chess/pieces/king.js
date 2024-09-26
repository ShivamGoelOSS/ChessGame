var King = function(config){
    this.type = 'king';
    this.board = config.board;
    Piece.call(this, config); 
};

King.prototype = Object.create(Piece.prototype); 
King.prototype.constructor = King; 

King.prototype.isValidMove = function(targetPosition){
    // Convert current position to row and column
    let currentCol = this.position.charAt(0);
    let currentRow = parseInt(this.position.charAt(1));

    // Calculate the difference between the target and current positions
    let colDifference = Math.abs(targetPosition.col.charCodeAt(0) - currentCol.charCodeAt(0));
    let rowDifference = Math.abs(targetPosition.row - currentRow);

    // The King can move exactly one square in any direction
    return colDifference <= 1 && rowDifference <= 1;
};

King.prototype.isSafePosition = function(targetPosition) {
    return !this.board.isPositionUnderAttack(targetPosition, this.color);
};

King.prototype.moveTo = function(targetPosition) {
    if (this.isValidPosition(targetPosition) && this.isSafePosition(targetPosition)) {
        const targetPiece = this.board.getPieceAt(targetPosition);
        if (targetPiece && targetPiece.color !== this.color) {
            this.board.killPiece(targetPiece); // Kill the opponent's piece
        }
        this.position = targetPosition.col + targetPosition.row;
        this.render();
        return true;
    } else {
        if (!this.isValidPosition(targetPosition)) {
            console.warn("Invalid move for king");
        } else {
            console.warn("Move would put king in check");
        }
        return false;
    }
};

King.prototype.canAttack = function(targetPosition) {
    let currentCol = this.position.charAt(0);
    let currentRow = parseInt(this.position.charAt(1));
    let targetCol = targetPosition.col;
    let targetRow = parseInt(targetPosition.row);

    let colDifference = Math.abs(targetCol.charCodeAt(0) - currentCol.charCodeAt(0));
    let rowDifference = Math.abs(targetRow - currentRow);

    // King can attack one square in any direction
    return colDifference <= 1 && rowDifference <= 1;
};
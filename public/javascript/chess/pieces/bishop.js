var Bishop = function(config){
    this.type = 'bishop';
    this.board = config.board; // Ensure board reference is set
    Piece.call(this, config); // Call the Piece constructor
};

Bishop.prototype = Object.create(Piece.prototype);
Bishop.prototype.constructor = Bishop;

// Check if the move is valid for the bishop
Bishop.prototype.isValidMove = function(targetPosition) {
    var currentCol = this.position.charCodeAt(0);
    var currentRow = parseInt(this.position.charAt(1));
    var targetCol = targetPosition.col.charCodeAt(0);
    var targetRow = parseInt(targetPosition.row);

    // Check if the move is diagonal
    if (Math.abs(targetCol - currentCol) === Math.abs(targetRow - currentRow)) {
        // Check if the path is clear
        var colStep = (targetCol > currentCol) ? 1 : -1;
        var rowStep = (targetRow > currentRow) ? 1 : -1;

        for (let i = 1; i < Math.abs(targetCol - currentCol); i++) {
            if (this.board.getPieceAt({ col: String.fromCharCode(currentCol + i * colStep), row: (currentRow + i * rowStep).toString() })) {
                return false; // Path is blocked
            }
        }

        // Check if the target position is occupied by an opponent's piece
        const targetPiece = this.board.getPieceAt(targetPosition);
        if (targetPiece && targetPiece.color !== this.color) {
            return true; // Valid capture move
        }
        return true; // Valid move
    }

    console.warn("Invalid move for bishop");
    return false; // Invalid move
};

// Move the bishop to the target position
Bishop.prototype.moveTo = function(targetPosition) {
    console.log(`Attempting to move to: ${targetPosition.col}${targetPosition.row}`);
    
    // Check if the move is valid
    if (this.isValidMove(targetPosition)) {
        const targetPiece = this.board.getPieceAt(targetPosition);
        if (targetPiece && targetPiece.color !== this.color) {
            this.board.killPiece(targetPiece); // Kill the opponent's piece
        }

        // Remove the piece from its current position
        this.deRender();
        
        // Update the position
        this.position = targetPosition.col + targetPosition.row;
        
        // Render the piece at the new position
        this.render();
        
        console.log(`Bishop moved to ${this.position}`);
        return true;
    } else {
        console.log("Invalid move for bishop");
    }
};

// Render the bishop on the board
Bishop.prototype.render = function() {
    var $square = document.querySelector(`#game-ct li[data-col="${this.position[0]}"] li[data-row="${this.position[1]}"]`);
    if ($square) {
        $square.innerHTML = `<div class="piece bishop ${this.color}"></div>`;
    }
};

// Remove the bishop from its current position
Bishop.prototype.deRender = function() {
    var $square = document.querySelector(`#game-ct li[data-col="${this.position[0]}"] li[data-row="${this.position[1]}"]`);
    if ($square) {
        $square.innerHTML = '';
    }
};
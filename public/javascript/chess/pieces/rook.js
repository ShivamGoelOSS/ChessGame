var Rook = function(config) {
    this.type = 'rook';
    this.board = config.board; // Ensure board reference is set
    Piece.call(this, config); // Call the Piece constructor
};

Rook.prototype = Object.create(Piece.prototype);
Rook.prototype.constructor = Rook;

// Check if the move is valid for the rook
Rook.prototype.isValidMove = function(targetPosition) {
    var currentCol = this.position[0].charCodeAt(0);
    var currentRow = parseInt(this.position[1]);
    var targetCol = targetPosition.col.charCodeAt(0);
    var targetRow = parseInt(targetPosition.row);
    var step = 0;

    // Rook can move only horizontally or vertically
    if (currentCol === targetCol) {
        // Vertical movement
        step = currentRow < targetRow ? 1 : -1;
        for (let i = currentRow + step; i !== targetRow; i += step) {
            if (this.board.getPieceAt({ col: targetPosition.col, row: i.toString() })) {
                return false; // Path is blocked
            }
        }
        // Check if the target position is occupied by an opponent's piece
        const targetPiece = this.board.getPieceAt(targetPosition);
        if (targetPiece && targetPiece.color !== this.color) {
            this.board.kill(targetPiece);
            return true; // Valid capture move
        }
        return true; // Valid move
    } else if (currentRow === targetRow) {
        // Horizontal movement
        step = currentCol < targetCol ? 1 : -1;
        for (let i = currentCol + step; i !== targetCol; i += step) {
            if (this.board.getPieceAt({ col: String.fromCharCode(i), row: targetPosition.row })) {
                return false; // Path is blocked
            }
        }
        // Check if the target position is occupied by an opponent's piece
        const targetPiece = this.board.getPieceAt(targetPosition);
        if (targetPiece && targetPiece.color !== this.color) {
            this.board.kill(targetPiece);
            return true; // Valid capture move
        }
        return true; // Valid move
    }
    return false; // Invalid move
};

// Move the rook to the target position
Rook.prototype.moveTo = function(targetPosition) {
    console.log(`Attempting to move to: ${targetPosition.col}${targetPosition.row}`);
    
    // Check if the move is valid
    if (this.isValidMove(targetPosition)) {
        // Check if there is an opponent's piece at the target position
        const targetPiece = this.board.getPieceAt(targetPosition);
        if (targetPiece) {
            if (targetPiece.color !== this.color) {
                // Kill the opponent's piece using the board's method
                this.board.killPiece(targetPiece);
            } else {
                console.log("Invalid move: Cannot capture your own piece");
                return;
            }
        }

        // Remove the piece from its current position
        this.deRender();
        
        // Update the position
        this.position = targetPosition.col + targetPosition.row;
        
        // Render the piece at the new position
        this.render();
        
        console.log(`Rook moved to ${this.position}`);
        return true;
    } else {
        console.log("Invalid move for rook");
    }
};

// Render the rook on the board
Rook.prototype.render = function() {
    var $square = document.querySelector(`#game-ct li[data-col="${this.position[0]}"] li[data-row="${this.position[1]}"]`);
    if ($square) {
        $square.innerHTML = `<div class="piece rook ${this.color}"></div>`;
    }
};

// Remove the rook from its current position
Rook.prototype.deRender = function() {
    var $square = document.querySelector(`#game-ct li[data-col="${this.position[0]}"] li[data-row="${this.position[1]}"]`);
    if ($square) {
        $square.innerHTML = '';
    }
};
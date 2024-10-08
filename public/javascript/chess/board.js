var Board = function(config){
    this.root_id = config.root_id;
    this.$el = document.getElementById(this.root_id);
    this.turn = 'black'; // White moves first
    this.selectedPiece = null;
    this.generateBoardDom();
    this.addListeners();
    this.initiateGame();
    this.renderAllPieces();
}

Board.prototype.addListeners = function(){
    this.$el.addEventListener('click', this.boardClicked.bind(this));
}

Board.prototype.generateBoardDom = function(config){
    let boardHTML = '<ul id="game-ct">';
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    
    for (let col of columns) {
        boardHTML += `<li data-col="${col}"><ul>`;
        for (let row = 1; row <= 8; row++) {
            boardHTML += `<li data-row="${row}"></li>`;
        }
        boardHTML += '</ul></li>';
    }
    
    boardHTML += '</ul>';
    
    this.$el.innerHTML = boardHTML;    
}

Board.prototype.getClickedBlock = function(clickEvent){
    const clickedCell = clickEvent.target.closest('li');
        
    if (clickedCell) {
        const row = clickedCell.getAttribute('data-row');
        const parentLi = clickedCell.closest('li[data-col]');
        const col = parentLi ? parentLi.getAttribute('data-col') : null;
        
        if (row !== null && col !== null) {
            return { row: row, col: col };
        }
    }
    return null;
}

Board.prototype.clearSelection = function(){
    const allPieces = document.querySelectorAll('.piece');
    allPieces.forEach(piece => {
        piece.classList.remove('selected');
    });
};

Board.prototype.boardClicked = function(event) {    
    this.clearSelection();
    
    const clickedCell = this.getClickedBlock(event);
    if (!clickedCell) return;
    
    const selectedPiece = this.getPieceAt(clickedCell);
    
    // If a piece is clicked
    if (selectedPiece) {
        // Check if it's the current player's turn
        if (selectedPiece.color !== this.turn) {
            if(this.selectedPiece.color === this.turn){
                if(this.selectedPiece.isValidMove(clickedCell)){
                    this.capturePiece(selectedPiece);
                }
                else{
                    console.warn("Invalid move");
                }
            }
            else{
                console.warn(`It's ${this.turn}'s turn`);
            }
            return; // Don't select or move the wrong piece
        }
        this.selectPiece(event.target, selectedPiece);
    } 
    // No piece is selected, try to move the selected piece
    else if (this.selectedPiece) {
        // Get the piece at the destination
        const destinationPiece = this.getPieceAt(clickedCell);
        
        // If there's no piece in the clicked cell or it's an opponent's piece
        if (!destinationPiece || destinationPiece.color !== this.selectedPiece.color) {
            // Move the selected piece if the move is valid
            if (this.selectedPiece.moveTo(clickedCell)) {
                this.switchTurn(); // Switch turn only after a valid move
                this.deselectPiece(); // Deselect after moving
            }
        }
    }
};

Board.prototype.deselectPiece = function() {
    if (this.selectedPiece) {
        // Remove the 'selected' class from the currently selected piece
        const selectedElement = document.querySelector(`.piece[data-position="${this.selectedPiece.position}"]`);
        if (selectedElement) {
            selectedElement.classList.remove('selected');
        }

        // Clear the selected piece reference
        this.selectedPiece.selected = false;
        this.selectedPiece = null; // Reset selected piece
    }
};

Board.prototype.capturePiece = function(piece) {
    // Remove the captured piece from the board and its respective collection
    const position = piece.position;

    // Move the previously selected piece to the captured piece's position
    if (this.selectedPiece) {
        this.selectedPiece.moveTo({ row: position[1], col: position[0] }); // Move to the captured piece's position
    }

    // Update the turn after capturing
    this.switchTurn(); // Switch turn after capturing a piece

    // Remove from whitePieces if it's a white piece
    if (piece.color === 'white') {
        for (let type in this.whitePieces) {
            if (Array.isArray(this.whitePieces[type])) {
                this.whitePieces[type] = this.whitePieces[type].filter(p => p.position !== position);
            } else if (this.whitePieces[type].position === position) {
                delete this.whitePieces[type];
            }
        }
    }

    // Remove from blackPieces if it's a black piece
    if (piece.color === 'black') {
        for (let type in this.blackPieces) {
            if (Array.isArray(this.blackPieces[type])) {
                this.blackPieces[type] = this.blackPieces[type].filter(p => p.position !== position);
            } else if (this.blackPieces[type].position === position) {
                delete this.blackPieces[type];
            }
        }
    }
    
    // Visually remove the piece from the board
    const pieceElement = document.querySelector(`.piece[data-position="${piece.position}"]`);
    if (pieceElement) {
        pieceElement.remove();
    }

    console.log(`${piece.color} ${piece.constructor.name} captured at ${position}`);
};

Board.prototype.getPieceAt = function(cell){
    if (!cell || !cell.row || !cell.col) return false;

    const position = cell.col + cell.row;

    // Check white pieces
    for (let pieceType in this.whitePieces) {
        if (Array.isArray(this.whitePieces[pieceType])) {
            for (let piece of this.whitePieces[pieceType]) {
                if (piece.position === position) return piece;
            }
        } else {
            if (this.whitePieces[pieceType].position === position) return this.whitePieces[pieceType];
        }
    }

    // Check black pieces
    for (let pieceType in this.blackPieces) {
        if (Array.isArray(this.blackPieces[pieceType])) {
            for (let piece of this.blackPieces[pieceType]) {
                if (piece.position === position) return piece;
            }
        } else {
            if (this.blackPieces[pieceType].position === position) return this.blackPieces[pieceType];
        }
    }

    return false;
}

Board.prototype.selectPiece = function(clickedElement, selectedPiece) {
    const clickedCell = this.getClickedBlock(event); // Get the clicked cell
    const destinationPiece = this.getPieceAt(clickedCell); // Get the piece at the clicked cell

    // If the clicked piece is an opponent's piece, capture it
    if (destinationPiece && destinationPiece.color !== this.turn) {
        this.capturePiece(destinationPiece);
        return; // Exit after capturing
    }

    // Highlight the selected piece
    if (clickedElement.classList.contains('piece')) {
        clickedElement.classList.add('selected');
    } else {
        const parentElement = clickedElement.closest('.piece');
        if (parentElement) {
            parentElement.classList.add('selected');
        }
    }
    selectedPiece.selected = true;
    this.selectedPiece = selectedPiece;
}

Board.prototype.switchTurn = function() {
    this.turn = this.turn === 'white' ? 'black' : 'white';
    console.log(`It's now ${this.turn}'s turn`);
}

Board.prototype.initiateGame = function() {
    // Create white pieces
    this.whitePieces = {
        king: new King({ color: 'white', position: 'E1', board: this }), // Pass board reference
        queen: new Queen({ color: 'white', position: 'D1', board: this }),
        bishops: [
            new Bishop({ color: 'white', position: 'C1', board: this }),
            new Bishop({ color: 'white', position: 'F1', board: this })
        ],
        knights: [
            new Knight({ color: 'white', position: 'B1', board: this }),
            new Knight({ color: 'white', position: 'G1', board: this })
        ],
        rooks: [
            new Rook({ color: 'white', position: 'A1', board: this }), // Pass board reference
            new Rook({ color: 'white', position: 'H1', board: this })
        ],
        pawns: []
    };

    for (let i = 0; i < 8; i++) {
        this.whitePieces.pawns.push(new Pawn({ color: 'white', position: String.fromCharCode(65 + i) + '2', board: this })); // Pass board reference
    }

    // Create black pieces
    this.blackPieces = {
        king: new King({ color: 'black', position: 'E8', board: this }),
        queen: new Queen({ color: 'black', position: 'D8', board: this }),
        bishops: [
            new Bishop({ color: 'black', position: 'C8', board: this }),
            new Bishop({ color: 'black', position: 'F8', board: this })
        ],
        knights: [
            new Knight({ color: 'black', position: 'B8', board: this }),
            new Knight({ color: 'black', position: 'G8', board: this })
        ],
        rooks: [
            new Rook({ color: 'black', position: 'A8', board: this }),
            new Rook({ color: 'black', position: 'H8', board: this })
        ],
        pawns: []
    };

    for (let i = 0; i < 8; i++) {
        this.blackPieces.pawns.push(new Pawn({ color: 'black', position: String.fromCharCode(65 + i) + '7', board: this })); // Pass board reference
    }
};

Board.prototype.renderAllPieces = function() {
    Object.values(this.whitePieces).forEach(piece => {
        if (Array.isArray(piece)) {
            piece.forEach(p => p.render());
        } else {
            piece.render();
        }
    });

    Object.values(this.blackPieces).forEach(piece => {
        if (Array.isArray(piece)) {
            piece.forEach(p => p.render());
        } else {
            piece.render();
        }
    });
};

Board.prototype.killPiece = function(piece) {
    const position = piece.position;

    // Remove from whitePieces if it's a white piece
    if (piece.color === 'white') {
        for (let type in this.whitePieces) {
            if (Array.isArray(this.whitePieces[type])) {
                this.whitePieces[type] = this.whitePieces[type].filter(p => p.position !== position);
            } else if (this.whitePieces[type].position === position) {
                delete this.whitePieces[type];
            }
        }
    }

    // Remove from blackPieces if it's a black piece
    if (piece.color === 'black') {
        for (let type in this.blackPieces) {
            if (Array.isArray(this.blackPieces[type])) {
                this.blackPieces[type] = this.blackPieces[type].filter(p => p.position !== position);
            } else if (this.blackPieces[type].position === position) {
                delete this.blackPieces[type];
            }
        }
    }

    // Visually remove the piece from the board
    const pieceElement = document.querySelector(`.piece[data-position="${piece.position}"]`);
    if (pieceElement) {
        pieceElement.remove();
    }

    console.log(`${piece.color} ${piece.constructor.name} captured at ${position}`);
};

Board.prototype.isDiagonalPathClear = function(start, end) {
    let startCol = start.charAt(0);
    let startRow = parseInt(start.charAt(1));
    let endCol = end.col;
    let endRow = parseInt(end.row);

    let colStep = startCol < endCol ? 1 : -1;
    let rowStep = startRow < endRow ? 1 : -1;

    let col = String.fromCharCode(startCol.charCodeAt(0) + colStep);
    let row = startRow + rowStep;

    while (col !== endCol && row !== endRow) {
        if (this.getPieceAt({col: col, row: row})) {
            return false;  // Path is blocked
        }
        col = String.fromCharCode(col.charCodeAt(0) + colStep);
        row += rowStep;
    }

    return true;  // Path is clear
};
Board.prototype.isPositionUnderAttack = function(position, color) {
    const opposingColor = color === 'white' ? 'black' : 'white';
    const opposingPieces = opposingColor === 'white' ? this.whitePieces : this.blackPieces;

    for (let pieceType in opposingPieces) {
        let pieces = opposingPieces[pieceType];
        if (Array.isArray(pieces)) {
            for (let piece of pieces) {
                if (piece.canAttack && piece.canAttack(position)) {
                    return true;
                }
            }
        } else if (pieces && pieces.canAttack && pieces.canAttack(position)) {
            return true;
        }
    }

    return false;
};
Board.prototype.isPathClear = function(start, end) {
    let startCol = start.charAt(0);
    let startRow = parseInt(start.charAt(1));
    let endCol = end.col;
    let endRow = parseInt(end.row);

    // Determine direction
    let colStep = startCol === endCol ? 0 : (startCol < endCol ? 1 : -1);
    let rowStep = startRow === endRow ? 0 : (startRow < endRow ? 1 : -1);

    let currentCol = String.fromCharCode(startCol.charCodeAt(0) + colStep);
    let currentRow = startRow + rowStep;

    while (currentCol !== endCol || currentRow !== endRow) {
        if (this.getPieceAt({col: currentCol, row: currentRow})) {
            return false;  // Path is blocked
        }
        currentCol = String.fromCharCode(currentCol.charCodeAt(0) + colStep);
        currentRow += rowStep;
    }

    return true;  // Path is clear
};

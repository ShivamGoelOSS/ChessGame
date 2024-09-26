var Board = function(config){
    this.root_id = config.root_id;
    this.$el = document.getElementById(this.root_id);
    this.generateBoardDom();
    this.addListeners();
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
    // Get the clicked block
    const clickedCell = clickEvent.target.closest('li');
        
    if (clickedCell) {
        // Extract row and column from data attributes
        const row = clickedCell.getAttribute('data-row');
        const parentLi = clickedCell.closest('li[data-col]');
        const col = parentLi ? parentLi.getAttribute('data-col') : null;
        
        if (row !== null && col !== null) {
            return {
                row: row,
                col: col
            };
        } else {
            console.warn('Unable to determine block coordinates');
        }
    } else {
        console.warn('Clicked element is not within a board square');
    }
}

Board.prototype.clearSelection = function(){
    // Remove 'selected' class from all pieces
    const allPieces = document.querySelectorAll('.piece');
    allPieces.forEach(piece => {
        piece.classList.remove('selected');
    });
};

Board.prototype.boardClicked = function(event) {    
    const clickedCell = this.getClickedBlock(event);
    const targetPiece = this.getPieceAt(clickedCell);

    if (targetPiece) {
        // If there is a piece at the clicked cell, check if it's an opponent's piece
        if (this.selectedPiece && targetPiece.color !== this.selectedPiece.color) {
            // Move the selected piece to the target cell and capture the opponent's piece
            this.selectedPiece.moveTo(clickedCell);
            this.clearSelection(); // Clear selection after moving
        } else {
            // Select the clicked piece
            this.clearSelection();
            this.selectPiece(event.target, targetPiece);
        }
    } else {
        // If no piece is clicked, move the selected piece to the new position
        if (this.selectedPiece) {
            this.selectedPiece.moveTo(clickedCell);
            this.clearSelection(); // Clear selection after moving
        }
    }
}

Board.prototype.getPieceAt = function(cell){
    if (!cell || !cell.row || !cell.col) {
        return false;
    }

    const position = cell.col + cell.row;

    // Check white pieces
    for (let pieceType in this.whitePieces) {
        if (Array.isArray(this.whitePieces[pieceType])) {
            // For arrays (pawns, bishops, knights, rooks)
            for (let piece of this.whitePieces[pieceType]) {
                if (piece.position === position) {
                    return piece;
                }
            }
        } else {
            // For single pieces (king, queen)
            if (this.whitePieces[pieceType].position === position) {
                return this.whitePieces[pieceType];
            }
        }
    }

    // Check black pieces
    for (let pieceType in this.blackPieces) {
        if (Array.isArray(this.blackPieces[pieceType])) {
            // For arrays (pawns, bishops, knights, rooks)
            for (let piece of this.blackPieces[pieceType]) {
                if (piece.position === position) {
                    return piece;
                }
            }
        } else {
            // For single pieces (king, queen)
            if (this.blackPieces[pieceType].position === position) {
                return this.blackPieces[pieceType];
            }
        }
    }
    return false;
}

Board.prototype.selectPiece = function(clickedElement, selectedPiece) {
    if (clickedElement.classList.contains('piece')) {
        // If the clicked element is a piece, add the 'selected' class
        clickedElement.classList.add('selected');
    } else {
        // If the clicked element is not a piece, check its parent
        const parentElement = clickedElement.closest('.piece');
        if (parentElement) {
            parentElement.classList.add('selected');
        }
    }
    
    // Check if the selected piece can capture another piece
    const targetCell = this.getClickedBlock(event); // Get the target cell from the click event
    const targetPiece = this.getPieceAt(targetCell); // Get the piece at the target cell
    if (targetPiece && targetPiece.color !== selectedPiece.color) {
        this.kill(targetPiece); // Capture the opponent's piece
    }

    selectedPiece.selected = true;
    this.selectedPiece = selectedPiece;
}

Board.prototype.initiateGame = function() {
    // Create white pieces
    this.whitePieces = {
        king: new King({ color: 'white', position: 'E1', board: this }),
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
            new Rook({ color: 'white', position: 'A1', board: this }),
            new Rook({ color: 'white', position: 'H1', board: this })
        ],
        pawns: []
    };

    // Create white pawns
    for (let i = 0; i < 8; i++) {
        this.whitePieces.pawns.push(new Pawn({ color: 'white', position: String.fromCharCode(65 + i) + '2', board: this }));
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

    // Create black pawns
    for (let i = 0; i < 8; i++) {
        this.blackPieces.pawns.push(new Pawn({ color: 'black', position: String.fromCharCode(65 + i) + '7', board: this }));
    }
};

Board.prototype.renderAllPieces = function() {
    // Render white pieces
    Object.values(this.whitePieces).forEach(piece => {
        if (Array.isArray(piece)) {
            piece.forEach(p => p.render());
        } else {
            piece.render();
        }
    });

    // Render black pieces
    Object.values(this.blackPieces).forEach(piece => {
        if (Array.isArray(piece)) {
            piece.forEach(p => p.render());
        } else {
            piece.render();
        }
    });
};

Board.prototype.kill = function(targetPiece) {
    if (!targetPiece) {
        console.error("No target piece found for capture");
        return;
    }

    console.log(`${targetPiece.color} ${targetPiece.type} captured at ${targetPiece.position}`);

    // Remove the piece from the appropriate collection
    if (targetPiece.color === 'white') {
        for (let pieceType in this.whitePieces) {
            if (Array.isArray(this.whitePieces[pieceType])) {
                this.whitePieces[pieceType] = this.whitePieces[pieceType].filter(p => p !== targetPiece);
            } else if (this.whitePieces[pieceType] === targetPiece) {
                delete this.whitePieces[pieceType];
            }
        }
    } else {
        for (let pieceType in this.blackPieces) {
            if (Array.isArray(this.blackPieces[pieceType])) {
                this.blackPieces[pieceType] = this.blackPieces[pieceType].filter(p => p !== targetPiece);
            } else if (this.blackPieces[pieceType] === targetPiece) {
                delete this.blackPieces[pieceType];
            }
        }
    }

    // Remove the piece visually from the board
    targetPiece.deRender();
};

export class Piece {
  constructor(name, image, side, description, moves) {
    this.name = name;
    this.image = image;
    this.side = side;
    this.description = description;
    this.moves = moves;
  }
  isValidMove = (start, end, boardState) => {
    const deltaX = (end % 8) - (start % 8);
    const deltaY = Math.floor(start / 8) - Math.floor(end / 8);
    let jumpMoves = this.moves.jump;
    for (let i = 0; i < jumpMoves.length; i++) {
      const element = jumpMoves[i];
      if (element[0] === deltaX && element[1] === deltaY) {
        return true;
      }
    }
    let directionMoves = this.moves.direction || [];
    for (let i = 0; i < directionMoves.length; i++) {
      const element = directionMoves[i];
      for (let scalar = 1; scalar < 8; scalar++) {
        if (boardState[start + element[0] * scalar - element[1] * scalar * 8] !== "") {
          break;
        }
        if (deltaX === element[0] * scalar && deltaY === element[1] * scalar)
          return true;
      }
    }

  };
  isValidCaptureMove = (start, end, boardState) => {
    const deltaX = (end % 8) - (start % 8);
    const deltaY = Math.floor(start / 8) - Math.floor(end / 8);
    let captureMoves = this.moves.capture ? this.moves.capture : this.moves;
    let jumpMoves = captureMoves.jump || [];
    for (let i = 0; i < jumpMoves.length; i++) {
      const element = jumpMoves[i];
      if (element[0] === deltaX && element[1] === deltaY) {
        return true;
      }
    }
    let directionMoves = captureMoves.direction || [];
    for (let i = 0; i < directionMoves.length; i++) {
      const element = directionMoves[i];
      for (let scalar = 1; scalar < 8; scalar++) {
        if (deltaX === element[0] * scalar && deltaY === element[1] * scalar)
          return true;
        if (boardState[start + element[0] * scalar - element[1] * scalar * 8] !== "") {
          break;
        }
      }
    }
  };
}

// export pieces
export const pieces = {
  w: {
    pawn: new Piece("pawn", "♙", "white", "classic pawn!", {
        jump: [[0, 1]],
        direction: [],
        capture: {
          jump: [[1, 1], [-1, 1]]
        }
      }
    ),
    rook: new Piece("rook", "♖", "white", "moves horizontally and vertically", {
        jump: [],
        direction: [[1, 0], [-1, 0], [0, 1], [0, -1]]
      }
    ),
    knight: new Piece("knight", "♘", "white", "fierce horse that moves in an L shape", {
        jump: [[1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]]
      }
    ),
    bishop: new Piece("bishop", "♗", "white", "diagonal mover with a sharp eye", {
        jump: [],
        direction: [[1, 1], [-1, 1], [1, -1], [-1, -1]]
      }
    ),
    queen: new Piece("queen", "♕", "white", "the most powerful piece, moves in all directions", {
        jump: [],
        direction: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]
      }
    ),
    king: new Piece("king", "♔", "white", "the royal piece, moves one square in any direction", {
        jump: [[0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0], [0, -1], [1, -1], [-1, -1]]
      }
    ),
  },
  b: {
    pawn: new Piece("pawn", "♟", "black", "classic pawn!", {
        jump: [[0, -1]],
        direction: [],
        capture: {
          jump: [[1, -1], [-1, -1]]
        }
      }
    ),
    rook: new Piece("rook", "♜", "black", "moves horizontally and vertically", {
        jump: [],
        direction: [[1, 0], [-1, 0], [0, 1], [0, -1]]
      }
    ),
    knight: new Piece("knight", "♞", "black", "fierce horse that moves in an L shape", {
        jump: [[1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]]
      }
    ),
    bishop: new Piece("bishop", "♝", "black", "diagonal mover with a sharp eye", {
        jump: [],
        direction: [[1, 1], [-1, 1], [1, -1], [-1, -1]]
      }
    ),
    queen: new Piece("queen", "♛", "black", "the most powerful piece, moves in all directions", {
        jump: [],
        direction: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]
      }
    ),
    king: new Piece("king", "♚", "black", "the royal piece, moves one square in any direction", {
        jump: [[0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0], [0, -1], [1, -1], [-1, -1]]
      }
    )
  }
};

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
    pawn: new Piece("pawn", <img src='/pieces/pawn-w.svg' alt='pawn' width='80%' />, "white", "classic pawn!", {
        jump: [[0, 1]],
        direction: [],
        capture: {
          jump: [[1, 1], [-1, 1]]
        }
      }
    ),
    rook: new Piece("rook", <img src='/pieces/rook-w.svg' alt='rook' width='80%' />, "white", "moves horizontally and vertically", {
        jump: [],
        direction: [[1, 0], [-1, 0], [0, 1], [0, -1]]
      }
    ),
    knight: new Piece("knight", <img src='/pieces/knight-w.svg' alt='knight' width='80%' />, "white", "fierce horse that moves in an L shape", {
        jump: [[1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]]
      }
    ),
    bishop: new Piece("bishop", <img src='/pieces/bishop-w.svg' alt='bishop' width='80%' />, "white", "diagonal mover with a sharp eye", {
        jump: [],
        direction: [[1, 1], [-1, 1], [1, -1], [-1, -1]]
      }
    ),
    queen: new Piece("queen", <img src='/pieces/queen-w.svg' alt='queen' width='80%' />, "white", "the most powerful piece, moves in all directions", {
        jump: [],
        direction: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]
      }
    ),
    king: new Piece("king", <img src='/pieces/king-w.svg' alt='king' width='80%' />, "white", "the royal piece, moves one square in any direction", {
        jump: [[0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0], [0, -1], [1, -1], [-1, -1]]
      }
    ),
  },
  b: {
    pawn: new Piece("pawn", <img src='/pieces/pawn-b.svg' alt='pawn' width='80%' />, "black", "classic pawn!", {
        jump: [[0, -1]],
        direction: [],
        capture: {
          jump: [[1, -1], [-1, -1]]
        }
      }
    ),
    rook: new Piece("rook", <img src='/pieces/rook-b.svg' alt='rook' width='80%' />, "black", "moves horizontally and vertically", {
        jump: [],
        direction: [[1, 0], [-1, 0], [0, 1], [0, -1]]
      }
    ),
    knight: new Piece("knight", <img src='/pieces/knight-b.svg' alt='knight' width='80%' />, "black", "fierce horse that moves in an L shape", {
        jump: [[1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]]
      }
    ),
    bishop: new Piece("bishop", <img src='/pieces/bishop-b.svg' alt='bishop' width='80%' />, "black", "diagonal mover with a sharp eye", {
        jump: [],
        direction: [[1, 1], [-1, 1], [1, -1], [-1, -1]]
      }
    ),
    queen: new Piece("queen", <img src='/pieces/queen-b.svg' alt='queen' width='80%' />, "black", "the most powerful piece, moves in all directions", {
        jump: [],
        direction: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]
      }
    ),
    king: new Piece("king", <img src='/pieces/king-b.svg' alt='king' width='80%' />, "black", "the royal piece, moves one square in any direction", {
        jump: [[0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0], [0, -1], [1, -1], [-1, -1]]
      }
    )
  }
};

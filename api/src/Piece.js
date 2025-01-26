export class Piece {
  constructor(name, image, side, description, moves) {
    this.name = name;
    this.image = image;
    this.side = side;
    this.description = description;
    this.moves = moves;
    // initialize missing fields in moves to empty arrays
    this.moves.jump = this.moves.jump || [];
    this.moves.direction = this.moves.direction || [];
    this.moves.capture = this.moves.capture || this.moves;
    this.moves.capture.jump = this.moves.capture.jump || [];
    this.moves.capture.direction = this.moves.capture.direction || [];
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
  static fromObject = (obj) => {
    let piece = new Piece(obj.name, obj.image, obj.side, obj.description, obj.moves);
    // give each attribute of obj to piece
    for (let key in obj) {
      piece[key] = obj[key];
    }
    return piece;
  }
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

// Override the pawn isValidMove function to include the initial double move
pieces.w.pawn.isValidMove = function (start, end, boardState) {
  const deltaX = (end % 8) - (start % 8);
  const deltaY = Math.floor(start / 8) - Math.floor(end / 8);

  // Initial pawn double move
  if (start > 47 && deltaX === 0 && deltaY === 2 && boardState[end] === "") {
    return true;
  }

  let jumpMoves = this.moves.jump; // Access this.moves correctly
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
      const targetIndex = start + element[0] * scalar - element[1] * scalar * 8;
      if (boardState[targetIndex] !== "") {
        break;
      }
      if (deltaX === element[0] * scalar && deltaY === element[1] * scalar) {
        return true;
      }
    }
  }

  return false;
};
pieces.w.pawn.code = "if piece['side'] == 'white':\n    for i in range(len(boardState)):\n        if boardState[i] != '' and boardState[i]['side'] == 'white' and boardState[i]['name'] == 'Phalanx':\n            continue\n        elif boardState[i] != '' and boardState[i]['side'] == 'white':\n            boardState[i]['moves']['jump'].append([0,1])\n            boardState[i]['moves']['jump'].append([0,2])\n            boardState[i]['moves']['capture']['jump'].append([1,1])\n            boardState[i]['moves']['capture']['jump'].append([-1,1])\n            boardState[i]['moves']['capture']['jump'].append([2,1])\n            boardState[i]['moves']['capture']['jump'].append([-2,1])\n            boardState[i]['moves']['capture']['jump'].append([1,2])\n            boardState[i]['moves']['capture']['jump'].append([-1,2])\n            boardState[i]['moves']['capture']['jump'].append([2,2])\n            boardState[i]['moves']['capture']['jump'].append([-2,2])\nelse:\n    for i in range(len(boardState)):\n        if boardState[i] != '' and boardState[i]['side'] == 'black' and boardState[i]['name'] == 'Phalanx':\n            continue\n        elif boardState[i] != '' and boardState[i]['side'] == 'black':\n            boardState[i]['moves']['jump'].append([0,1])\n            boardState[i]['moves']['jump'].append([0,2])\n            boardState[i]['moves']['capture']['jump'].append([1,1])\n            boardState[i]['moves']['capture']['jump'].append([-1,1])\n            boardState[i]['moves']['capture']['jump'].append([2,1])\n            boardState[i]['moves']['capture']['jump'].append([-2,1])\n            boardState[i]['moves']['capture']['jump'].append([1,2])\n            boardState[i]['moves']['capture']['jump'].append([-1,2])\n            boardState[i]['moves']['capture']['jump'].append([2,2])\n            boardState[i]['moves']['capture']['jump'].append([-2,2])"

pieces.b.pawn.isValidMove = function (start, end, boardState) {
  const deltaX = (end % 8) - (start % 8);
  const deltaY = Math.floor(start / 8) - Math.floor(end / 8);

  // Initial pawn double move
  if (start < 16 && deltaX === 0 && deltaY === -2 && boardState[end] === "") {
    return true;
  }

  let jumpMoves = this.moves.jump; // Access this.moves correctly
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
      const targetIndex = start + element[0] * scalar - element[1] * scalar * 8;
      if (boardState[targetIndex] !== "") {
        break;
      }
      if (deltaX === element[0] * scalar && deltaY === element[1] * scalar) {
        return true;
      }
    }
  }

  return false;
}
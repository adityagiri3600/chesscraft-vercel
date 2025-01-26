import axios from "axios";
import { pieces as p, Piece } from "./Piece";

export async function runPieceCode(piece, start, end, boardState, setBoardState){
  if (piece.code) {
    const pythonCode = piece.code;
    const variables = {
      self: piece,
      piece: piece,
      prevx: start % 8,
      prevy: Math.floor(start / 8),
      x: end % 8,
      y: Math.floor(end / 8),
      boardIndex: end,
      boardState: boardState,
    };
    try {
      const response = await axios.post("http://127.0.0.1:5000/run-python", {
        variables,
        code: pythonCode,
      });
      console.log(response.data);
      const newVariables = response.data;
      console.log(boardState);
      for (let i = 0; i < newVariables.boardState.length; i++) {
        if (newVariables.boardState[i] === "") continue;
        newVariables.boardState[i] = Piece.fromObject(newVariables.boardState[i]);
        if (newVariables.boardState[i].name === "pawn"){
            if (newVariables.boardState[i].side === "white"){
              newVariables.boardState[i].isValidMove = p.w.pawn.isValidMove;
            } else {
              newVariables.boardState[i].isValidMove = p.b.pawn.isValidMove;
            }
        }
      }
      console.log(newVariables.boardState);
      const updatedBoardState = newVariables.boardState.map(piece => {
        if (piece !== "" && piece.image.props) {
          piece.image = <img src={piece.image.props.src} alt={piece.image.props.alt} width={piece.image.props.width} />;
        }
        return piece;
      });
      setBoardState(updatedBoardState);

    } catch (err) {
      console.error("Error executing Python code", err);
      if (err.response) {
        console.error(err.response.data.error);
      }
    }
  }
}
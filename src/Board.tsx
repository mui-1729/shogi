import './Board.css';
import React, { useState } from 'react';

type Piece = { type:string, player: number } | null;
type Position = { row: number; col:number } | null

const initialBoard: Piece[][] = [
    [
        { type: '香', player: 1 }, { type: '桂', player: 1 }, { type: '銀', player: 1 }, { type: '金', player: 1 },
    { type: '王', player: 1 }, { type: '金', player: 1 }, { type: '銀', player: 1 }, { type: '桂', player: 1 },
    { type: '香', player: 1 }
  ],
  [
    null, { type: '飛', player: 1 }, null, null, null, null, null, { type: '角', player: 1 }, null],
    Array.from({ length: 9 }, () => ({ type: '歩', player: 1 })),
    Array(9).fill(null), 
    Array(9).fill(null), 
    Array(9).fill(null), 
    Array.from({ length: 9 }, () => ({ type: '歩', player: 2 })),
  
  [
    null, { type: '角', player: 2 }, null, null, null, null, null, { type: '飛', player: 2 }, null
  ],
  [
    { type: '香', player: 2 }, { type: '桂', player: 2 }, { type: '銀', player: 2 }, { type: '金', player: 2 },
    { type: '玉', player: 2 }, { type: '金', player: 2 }, { type: '銀', player: 2 }, { type: '桂', player: 2 },
    { type: '香', player: 2 }
  ]
];

const canMove: Record<string, (player: number) => number[][]> = {
    歩: (player: number) => [[player === 1 ? 1 : -1, 0]],
  桂: (player: number) => [[player === 1 ? 2 : -2, -1], [player === 1 ? 2 : -2, 1]],
  銀: (player: number) => [[1, 0], [1, -1], [1, 1], [-1, -1], [-1, 1]].map(([dr, dc]) => player === 1 ? [dr, dc] : [-dr, dc]),
  金: (player: number) => [[1, 0], [0, -1], [0, 1], [-1, 0], [1, -1], [1, 1]].map(([dr, dc]) => player === 1 ? [dr, dc] : [-dr, dc]),
  王: () => [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]],
  玉: () => [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]],
  香: (player: number) => Array.from({ length: 8 }, (_, i) => [player === 1 ? i + 1 : -i - 1, 0]),
  角: () => {
    const moves = [];
    for (let i = 1; i < 9; i++) {
      moves.push([i, i], [-i, -i], [i, -i], [-i, i]);
    }
    return moves;
  },
  飛: () => {
    const moves = [];
    for (let i = 1; i < 9; i++) {
      moves.push([i, 0], [-i, 0], [0, i], [0, -i]);
    }
    return moves;
  }
};

const Board: React.FC = () => { 
    const [board, setBoard] = useState <Piece[][]> (initialBoard);
    const [select, setSelect] = useState <Position> (null);
    const [turn, setTurn] = useState<number>(1);
    const [capture, setCapture] = useState<{ [key: number] : Piece[] }>({ 1: [], 2: [] });
    const [place, setPlace] = useState<Piece | null>(null);


function validMove(
    from: Position,
    to: Position,
    piece: Piece
  ): boolean {
    if (!from || !to || !piece) return false;
    if (piece.player !== turn) return false;

    const dr = to.row - from.row;
    const dc = to.col - from.col;

    const directions = canMove[piece.type](piece.player);
    for (const [ r, c ] of directions) {
        const stepR = Math.sign(dr), stepC = Math.sign(dc);
        if (r === dr && c === dc ){
            if (board[to.row][to.col] && board[to.row][to.col]?.player === piece.player) {
                return false;
            }

            if  (piece.type === '角' || piece.type === '飛' || piece.type === '香') {
                let r = from.row + stepR, c = from.col + stepC;
                while ( r !== to.row || c !== to.col) {
                    if (board[r][c] !== null) return false;
                    r += stepR;
                    c += stepC
                }
            }
            if (piece.type === '香') {
                const step = piece.player === 1 ? 1 : -1;
                for (let r = from.row + step; r !== to.row; r += step) {
                    if (board[r][from.col] !== null) return false;
                }
        }
        return true;
    }
}
    return false;
}

const handleClick = (row: number, col: number) => {
    const clickedPiece = board[row][col];

    if (placingPiece) {
      // 持ち駒を盤面に置く処理
      if (!clickedPiece) {
        const newBoard = board.map(row => row.slice());
        newBoard[row][col] = placingPiece; // 盤面に駒を配置
        setBoard(newBoard);

        // 持ち駒から削除
        setCapture(prev => ({
          ...prev,
          [turn]: prev[turn].filter(piece => piece !== placingPiece)
        }));

        setPlacingPiece(null); // 配置モード解除
        setTurn(turn === 1 ? 2 : 1);
      }
    } else {
      if (clickedPiece && clickedPiece.player === turn) {
        setSelect({ row, col });
      } else if (select) {
        const piece = board[select.row][select.col];
        if (validMove(select, { row, col }, piece)) {
          const newBoard = board.map(row => row.slice());
          newBoard[row][col] = piece;
          newBoard[select.row][select.col] = null;
          setBoard(newBoard);
          setSelect(null);
          setTurn(turn === 1 ? 2 : 1);
        }
      }
    }
  };

  const handlePlacePiece = (piece: Piece) => {
    setPlacingPiece(piece); // 持ち駒を選択して盤面に置くモードに入る
  };
  return (
    <div className="board">
      {board.map((rowArr, rowIdx) =>
        rowArr.map((cell, colIdx) => {
          const isSelected = select?.row === rowIdx && select?.col === colIdx;
          return (
            <div
              className={`cell ${isSelected ? 'selected' : ''}`}
              key={`${rowIdx}-${colIdx}`}
              onClick={() => handleClick(rowIdx, colIdx)}
            >
              {cell && <span className="piece">{cell.type}</span>}
            </div>
          );
        })
      )}
      <div className="captured">
        <div>先手の持ち駒: {capture[1].map((p, i) => <span key={i}>{p?.type}</span>)}</div>
        <div>後手の持ち駒: {capture[2].map((p, i) => <span key={i}>{p?.type}</span>)}</div>
      </div>
    </div>
  );
};

export default Board;

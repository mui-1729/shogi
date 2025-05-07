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
    Array.from({ length: 9}, () => ({type: '歩', player: 1})),
    Array(9).fill(null), 
    Array(9).fill(null), 
    Array(9).fill(null), 
    Array.from({ length: 9}, () => ({type: '歩', player: 2})),
  
  [
    null, { type: '角', player: 2 }, null, null, null, null, null, { type: '飛', player: 2 }, null
  ],
  [
    { type: '香', player: 2 }, { type: '桂', player: 2 }, { type: '銀', player: 2 }, { type: '金', player: 2 },
    { type: '玉', player: 2 }, { type: '金', player: 2 }, { type: '銀', player: 2 }, { type: '桂', player: 2 },
    { type: '香', player: 2 }
  ]
];

const Board: React.FC = () => { 
    const [board, setboard] = useState <Piece[][]> (initialBoard);
    const [select, setselect] = useState <Position> (null);
    const [nowplayer, setnowplayer] = useState<number>(1);

    type Delta = { dr: number; dc: number };

const canMove: Record<string, Delta[]> = {
  歩:   [{ dr: 1, dc: 0 }],
  桂:   [{ dr: 2, dc: -1 }, { dr: 2, dc: 1 }],
  銀:   [
    { dr: 1, dc: 0 }, { dr: 1, dc: -1 }, { dr: 1, dc: 1 },
    { dr: -1, dc: -1 }, { dr: -1, dc: 1 }
  ],
  金:   [
    { dr: 1, dc: 0 }, { dr: 0, dc: -1 }, { dr: 0, dc: 1 },
    { dr: -1, dc: 0 }, { dr: 1, dc: -1 }, { dr: 1, dc: 1 }
  ],
  王:   [
    { dr: 1, dc: 0 }, { dr: -1, dc: 0 },
    { dr: 0, dc: 1 }, { dr: 0, dc: -1 },
    { dr: 1, dc: 1 }, { dr: 1, dc: -1 },
    { dr: -1, dc: 1 }, { dr: -1, dc: -1 }
  ],
  玉:   [
    { dr: 1, dc: 0 }, { dr: -1, dc: 0 },
    { dr: 0, dc: 1 }, { dr: 0, dc: -1 },
    { dr: 1, dc: 1 }, { dr: 1, dc: -1 },
    { dr: -1, dc: 1 }, { dr: -1, dc: -1 }
  ],
  香:   [
    { dr: 1, dc: 0 }, { dr: 2, dc: 0 },
    { dr: 3, dc: 0 }, { dr: 4, dc: 0 },
    { dr: 5, dc: 0 }, { dr: 6, dc: 0 },
    { dr: 7, dc: 0 }, { dr: 8, dc: 0 }
  ],
};

function validMove(
    from: Position,
    to: Position,
    piece: Piece
  ): boolean {
    if (!from || !to || !piece) return false;
    if (piece.player !== nowplayer) return false;
  
    const dir = piece.player === 1 ? 1 : -1;

    if (canMove[piece.type]) {
      const dr = to.row - from.row;
      const dc = to.col - from.col;
  
      return canMove[piece.type]!.some(delta =>
        delta.dr * dir === dr && delta.dc === dc
      );
    }

    return false;
  }

    const click = (row: number, col: number) => {
        if (!select){
            if (board[row][col] && board[row][col]?.player === nowplayer) {
                setselect({ row , col });
            }
        } else {

            if ( validMove(select, { row, col }, board[select.row][select.col])){
                const newBoard = board.map((row) => row.slice());
                newBoard[{ row, col }.row][{ row, col }.col] = board[select.row][select.col];
                newBoard[select.row][select.col] = null;
                setboard(newBoard);
                setselect(null);
                setnowplayer(nowplayer === 1 ? 2 : 1);
            } else {
                setselect(null);
            }
        }
    };
  return (
    <div className="board">
      {board.flatMap((row, rowIndex) => 
          row.map((cell, colIndex) => {
            const isselect = select?.row === rowIndex && select?.col === colIndex;
            return(
            <div className={`cell ${isselect ? 'select' : ''}`}  key={ `${rowIndex}-${colIndex}`} onClick={() => click(rowIndex, colIndex)}>
              {cell && <span className="piece">{cell.type}</span>}
            </div>
            );
        })
        )}
    </div>
  );
};

export default Board;

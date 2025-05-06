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
    Array(9).fill({ type: '歩', player: 1 }),
    Array(9).fill(null), 
    Array(9).fill(null), 
    Array(9).fill(null), 
    Array(9).fill({ type: '歩', player: 2 }),
  
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

    const validMove = (
        from: Position,
        to: Position,
        piece: Piece,
    ): boolean => {
        if (!from || !to || !piece ) return false;
        if (piece.player !== nowplayer) return false;
        
        if (piece.type === '歩') {
          if (nowplayer === 1){
            return to!.row === from.row - 1 && to!.col === from.col;
          } else {
            return to!.row === from.row + 1 && to!.col === from.col;
          }
          }
      
        return true;
      };

    const click = (row: number, col: number) => {
        if (!select){
            if (board[row][col] && board[row][col]?.player === nowplayer) {
                setselect({ row , col });
            }
        } else {

            if ( validMove(select, { row, col }, board[select.row][select.col])){
                console.log("Checking move validity:", {nowplayer})
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

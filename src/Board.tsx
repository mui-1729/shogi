import React from 'react';
import './Board.css';

type Piece = string | null;

const initialBoard: Piece[][] = [
  ['香', '桂', '銀', '金', '王', '金', '銀', '桂', '香'],
  [null, '飛', null, null, null, null, null, '角', null],
  ['歩', '歩', '歩', '歩', '歩', '歩', '歩', '歩', '歩'],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  ['歩', '歩', '歩', '歩', '歩', '歩', '歩', '歩', '歩'],
  [null, '角', null, null, null, null, null, '飛', null],
  ['香', '桂', '銀', '金', '玉', '金', '銀', '桂', '香'],
];

const Board: React.FC = () => {
  return (
    <div className="board">
      {initialBoard.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {row.map((cell, colIndex) => (
            <div className="cell" key={colIndex}>
              {cell && <span className="piece">{cell}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;

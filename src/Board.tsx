import React, { useState } from 'react'
import './Board.css'
type Piece = { type: string; player: number } | null
type Position = { row: number; col: number } | null
const initialBoard: Piece[][] = [
  [
    { type: '香', player: 1 }, { type: '桂', player: 1 }, { type: '銀', player: 1 }, { type: '金', player: 1 },
    { type: '王', player: 1 }, { type: '金', player: 1 }, { type: '銀', player: 1 }, { type: '桂', player: 1 },
    { type: '香', player: 1 }
  ],
  [
    null, { type: '飛', player: 1 }, null, null, null, null, null, { type: '角', player: 1 }, null
  ],
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
]
const canMove: Record<string, (player: number) => number[][]> = {
  歩: (pl) => [[pl === 1 ? 1 : -1, 0]],
  桂: (pl) => [[pl === 1 ? 2 : -2, -1], [pl === 1 ? 2 : -2, 1]],
  銀: (pl) =>
    [[1, 0], [1, -1], [1, 1], [-1, -1], [-1, 1]].map(
      ([dr, dc]) => (pl === 1 ? [dr, dc] : [-dr, dc])
    ),
  金: (pl) =>
    [[1, 0], [0, -1], [0, 1], [-1, 0], [1, -1], [1, 1]].map(
      ([dr, dc]) => (pl === 1 ? [dr, dc] : [-dr, dc])
    ),
  王: () => [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]],
  玉: () => [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]],
  香: (pl) =>
    Array.from({ length: 8 }, (_, i) => [pl === 1 ? i + 1 : -i - 1, 0]),
  角: () => {
    const m: number[][] = []
    for (let i = 1; i < 9; i++) {
      m.push([i, i], [-i, -i], [i, -i], [-i, i])
    }
    return m
  },
  飛: () => {
    const m: number[][] = []
    for (let i = 1; i < 9; i++) {
      m.push([i, 0], [-i, 0], [0, i], [0, -i])
    }
    return m
  }
}
const Board: React.FC = () => {
  const [board, setBoard] = useState<Piece[][]>(initialBoard)
  const [select, setSelect] = useState<Position>(null)
  const [turn, setTurn] = useState<number>(1)
  const [capture, setCapture] = useState<{ [key: number]: Piece[] }>({ 1: [], 2: [] })
  const [placePiece, setPlacePiece] = useState<Piece>(null)
  const [placeIdx, setPlaceIdx] = useState<number | null>(null)
  
  function validMove(from: Position, to: Position, piece: Piece): boolean {
    if (!from || !to || !piece) return false
    if (piece.player !== turn) return false
    const dr = to.row - from.row
    const dc = to.col - from.col
    const directions = canMove[piece.type](piece.player)
    for (const [r, c] of directions) {
      const stepR = Math.sign(dr),
        stepC = Math.sign(dc)
      if (r === dr && c === dc) {
        if (board[to.row][to.col] && board[to.row][to.col]!.player === piece.player) {
          return false
        }
        if (piece.type === '飛' || piece.type === '角' || piece.type === '香') {
          let rr = from.row + stepR,
            cc = from.col + stepC
          while (rr !== to.row || cc !== to.col) {
            if (board[rr][cc] !== null) return false
            rr += stepR
            cc += stepC
          }
        }
        return true
      }
    }
    return false
  }
  const handleClick = (row: number, col: number) => {
    const clicked = board[row][col]
    if (placePiece && placeIdx !== null) {
      if (!clicked) {
        const nb = board.map(r => r.slice())
        nb[row][col] = placePiece
        setBoard(nb)

setCapture(prev => ({
          ...prev,
          [turn]: prev[turn].filter((_, i) => i !== placeIdx)
        }))
        setPlacePiece(null)
        setPlaceIdx(null)
        setTurn(turn === 1 ? 2 : 1)
      }
      return
    }
    if (clicked && clicked.player === turn) {
      setSelect({ row, col })
    } else if (select) {
      const fromPiece = board[select.row][select.col]
      if (fromPiece && validMove(select, { row, col }, fromPiece)) {
        const nb = board.map(r => r.slice())
        const dest = nb[row][col]
        if (dest) {
          setCapture(prev => ({
            ...prev,
            [turn]: [...prev[turn], { type: dest.type, player: turn }]
          }))
        }
        nb[row][col] = fromPiece
        nb[select.row][select.col] = null
        setBoard(nb)
        setSelect(null)
        setTurn(turn === 1 ? 2 : 1)
      }
    }
  }
  const handlePlace = (p: Piece, idx: number) => {
    if (!p) return
    setPlacePiece({ type: p.type, player: p.player })
    setPlaceIdx(idx)
  }
  return (
    <div className="board">
      {board.map((rowArr, ri) =>
        rowArr.map((cell, ci) => {
          const isSel = select?.row === ri && select?.col === ci
          return (
            <div
              key={`${ri}-${ci}`}
              className={`cell ${isSel ? 'selected' : ''}`}
              onClick={() => handleClick(ri, ci)}
            >
              {cell && <span className="piece">{cell.type}</span>}
            </div>
          )
        })
      )}
      <div className="captured">
        <div>
          先手持ち駒：
          {capture[1].map((p, idx) => (
            <span
              key={idx}
              className="piece"
              onClick={() => handlePlace(p, idx)}
            >
              {p?.type}
            </span>
          ))}
        </div>
        <div>
          後手持ち駒：
          {capture[2].map((p, idx) => (
            <span
              key={idx}
              className="piece"
              onClick={() => handlePlace(p, idx)}
            >
              {p?.type}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
export default Board
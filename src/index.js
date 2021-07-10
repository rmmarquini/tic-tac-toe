/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

const rowStyle = {
  display: 'flex'
}

const squareStyle = {
  'width':'60px',
  'height':'60px',
  'backgroundColor': '#ddd',
  'margin': '4px',
  'display': 'flex',
  'justifyContent': 'center',
  'alignItems': 'center',
  'fontSize': '20px',
  'color': 'white',
  'cursor': 'pointer'
}

const boardStyle = {
  'backgroundColor': '#eee',
  'width': '208px',
  'alignItems': 'center',
  'justifyContent': 'center',
  'display': 'flex',
  'flexDirection': 'column',
  'border': '3px #eee solid'
}

const disabledBoardStyle = {
  'backgroundColor': '#eee',
  'width': '208px',
  'alignItems': 'center',
  'justifyContent': 'center',
  'display': 'flex',
  'flexDirection': 'column',
  'border': '3px #eee solid',
  'pointerEvents': 'none',
  'opacity': '0.75'
}

const containerStyle = {
  'display': 'flex',
  'alignItems': 'center',
  'flexDirection': 'column'
}

const instructionsStyle = {
  'marginTop': '5px',
  'marginBottom': '5px',
  'fontWeight': 'bold',
  'fontSize': '16px',
}

const buttonStyle = {
  'marginTop': '15px',
  'marginBottom': '16px',
  'width': '80px',
  'height': '40px',
  'backgroundColor': '#8acaca',
  'color': 'white',
  'fontSize': '16px',
  'cursor': 'pointer'
}

function Square({ position, choosedSquare }) {
  return (
    <div 
      className="square"
      style={squareStyle}
      onClick={choosedSquare}
    >
      {position}
    </div>
  )
}

function Board() {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""])
  const [isBoardDisable, setIsBoardDisable] = useState(false)
  const [isFirstPlay, setIsFirstPlay] = useState(true)
  const [player, setPlayer] = useState("")
  const [gameResult, setGameResult] = useState({ winner: "none" })

  useEffect(() => {
    checkWinner()

    if (isFirstPlay) {
      setPlayer("X")
    } else if (!isFirstPlay && player === "X") {
      setPlayer("O");
    } else {
      setPlayer("X");
    }
    
  }, [board]);

  useEffect(() => {

    if (gameResult.winner !== "none") {
      setTimeout( () => {
        resetGame()
      }, 2000)
    }

  }, [gameResult])

  const choosedSquare = square => {

    setBoard(
      board.map( (position, index) => {
        if (index === square && position === "") {
          return player
        }
        return position
      })
    )

    setIsFirstPlay(false)

  }

  const checkWinner = () => {

    const WinningPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    WinningPatterns.forEach( currentPattern => {

      const currentPlayer = board[currentPattern[0]]
      if (currentPlayer === "") return
      
      let isFoundWinningPattern = true
      currentPattern.forEach( index => {
        if (board[index] !== currentPlayer) {
          isFoundWinningPattern = false
        }
      })

      if (isFoundWinningPattern) {
        setGameResult({ winner: player })
        setIsBoardDisable(true)
        setIsFirstPlay(true)
      }
      
    })

  }
  
  const resetGame = () => {
    setBoard(["", "", "", "", "", "", "", "", ""])
    setIsFirstPlay(true)
    setIsBoardDisable(false)
    setGameResult({ winner: "none" })
  }

  function loadBoardAndSquares() {
    const boardSize = 3
    let squares = []

    for (let rowIndex=0; rowIndex<boardSize; rowIndex++) {
      let row = []
      for (let squareIndex=0; squareIndex<boardSize; squareIndex++) {
        let position = rowIndex * boardSize + squareIndex
        row.push(
          <Square 
            key={position}
            position={board[position]}
            choosedSquare={() => {choosedSquare(position)}}
          />
        )
      }
      squares.push(
        <div 
          key={rowIndex} 
          className="board-row" 
          style={rowStyle}>
            {row}
        </div>
      )
    }

    return squares
  }

  return (
    <div style={containerStyle} className="gameBoard">
      <div id="statusArea" className="status" style={instructionsStyle}>Next player: <span>{player}</span></div>
      <div id="winnerArea" className="winner" style={instructionsStyle}>Winner: <span>{gameResult.winner}</span></div>
      <button style={buttonStyle} onClick={resetGame}>Reset</button>
      <div style={isBoardDisable ? disabledBoardStyle : boardStyle}>
        {loadBoardAndSquares()}
      </div>
    </div>
  );
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  );
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

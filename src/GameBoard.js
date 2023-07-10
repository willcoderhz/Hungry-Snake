import React, { useState, useEffect, useCallback } from 'react';
import './GameBoard.css';

const GameBoard = () => {
  const BOARD_SIZE = 30;
  const [snake, setSnake] = useState([{ row: 10, col: 10 }]);
  const [direction, setDirection] = useState({ row: 0, col: 1 });
  const [food, setFood] = useState({ row: 5, col: 5 });
  const [gameOver, setGameOver] = useState(false);

  const createBoard = BOARD_SIZE => {
    let board = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        board[row] = [...(board[row] || []), { row, col }];
      }
    }
    return board;
  };

  const board = createBoard(BOARD_SIZE);

  const moveSnake = useCallback(() => {
    const newSnake = [...snake];
    const newSnakeHead = {
      row: newSnake[0].row + direction.row,
      col: newSnake[0].col + direction.col,
    };

    if (
      snake.some(cell => cell.row === newSnakeHead.row && cell.col === newSnakeHead.col) ||
      newSnakeHead.row >= BOARD_SIZE ||
      newSnakeHead.col >= BOARD_SIZE ||
      newSnakeHead.row < 0 ||
      newSnakeHead.col < 0
    ) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(newSnakeHead);

    if (food.row === newSnakeHead.row && food.col === newSnakeHead.col) {
      let newFoodPosition;
      while (true) {
        newFoodPosition = { row: Math.floor(Math.random() * BOARD_SIZE), col: Math.floor(Math.random() * BOARD_SIZE) };
        if (!newSnake.some(cell => cell.row === newFoodPosition.row && cell.col === newFoodPosition.col)) break;
      }
      setFood(newFoodPosition);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food]);

  useEffect(() => {
    if (gameOver) return;
    
    const timerId = setInterval(moveSnake, 100);

    return () => clearInterval(timerId);
  }, [gameOver, moveSnake]);

  useEffect(() => {
    const handleKeyDown = e => {
      setDirection(prevDirection => {
        switch (e.key) {
          case 'w':
            return prevDirection.row !== 1 ? { row: -1, col: 0 } : prevDirection;
          case 's':
            return prevDirection.row !== -1 ? { row: 1, col: 0 } : prevDirection;
          case 'a':
            return prevDirection.col !== 1 ? { row: 0, col: -1 } : prevDirection;
          case 'd':
            return prevDirection.col !== -1 ? { row: 0, col: 1 } : prevDirection;
          default:
            return prevDirection;
        }
      });
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty dependency array

  return (
    <>
    {!gameOver && <h1 id="game-title">Cute Snake Game</h1>}
    <div id="game-board">
      {gameOver ? (
        <h1 id="game-title">Game Over</h1>
      ) : (
        
        board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, cellIndex) => {
              let isSnake = false;
              let isFood = false;

              if (food.row === cell.row && food.col === cell.col) {
                isFood = true;
              }

              for (const snakeCell of snake) {
                if (snakeCell.row === cell.row && snakeCell.col === cell.col) {
                  isSnake = true;
                  break;
                }
              }

              return <div key={cellIndex} className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}></div>;
            })}
          </div>
        ))
      )}
    </div>
    </>
  );
};

export default GameBoard;

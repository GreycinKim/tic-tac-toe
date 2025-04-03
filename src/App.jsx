import {useState} from "react";

// These are the custom components used in the app
import Player from "./Components/Player.jsx";
import GameBoard from "./Components/GameBoard.jsx";
import Log from "./Components/Log.jsx";
import GameOver from "./Components/GameOver.jsx";

// A list of all possible winning combinations (rows, cols, diagonals)
import { WINNING_COMBINATIONS } from "./winning-combinations.js";

// Default player names for symbol X and O
const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2',
};

// The empty 3x3 board structure
const INITIAL_GAME_BOARD = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
];

// Determines whose turn it is based on the number of turns taken
function deriveActivePlayer(gameTurns) {
    let currentPlayer = 'X';

    // If the latest turn was by 'X', the next should be 'O'
    if(gameTurns.length > 0 && gameTurns[0].player === 'X'){
        currentPlayer = 'O';
    }
    return currentPlayer
}

// Creates a 2D array representing the current board state from gameTurns
function deriveGameBoard(gameTurns) {
    // Copy the initial board to avoid modifying the original
    let gameBoard = [...INITIAL_GAME_BOARD.map(array=>[...array])];

    // Place X or O on the board based on each turn taken
    for(const turn of gameTurns){
        const {square, player} = turn;
        const { row, col } = square;

        gameBoard[row][col] = player;
    }
    return gameBoard;
}

// Checks for a winner by comparing current board state with winning combinations
function deriveWinner(gameBoard, players){
    let winner;

    for(const combination of WINNING_COMBINATIONS) {
        const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
        const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
        const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

        // All three squares must be filled and equal
        if (firstSquareSymbol &&
            firstSquareSymbol === secondSquareSymbol &&
            firstSquareSymbol === thirdSquareSymbol
        ) {
            winner = players[firstSquareSymbol]; // Get the winner's name from the players object
        }
    }

    return winner;
}

function App() {
    // State for player names (can be changed via input)
    const [players, setPlayers] = useState(PLAYERS);

    // State to track all moves (each with square and player)
    const [gameTurns, setGameTurns] = useState([]);

    // Derived values from gameTurns
    const activePlayer = deriveActivePlayer(gameTurns);
    const gameBoard = deriveGameBoard(gameTurns);
    const winner = deriveWinner(gameBoard, players);
    const hasDraw = gameTurns.length === 9 && !winner; // No winner after 9 turns = draw

    // Called when a player selects a square
    function handleSelectSquare(rowIndex, colIndex) {
        setGameTurns(prevTurns => {
            const currentPlayer = deriveActivePlayer(prevTurns);
            const updatedTurns = [
                {square:{row: rowIndex, col: colIndex}, player: currentPlayer},
                ...prevTurns,
            ];

            return updatedTurns;
        });
    }

    // Resets the game by clearing all moves
    function handleRestart(){
        setGameTurns([]);
    }

    // Allows users to rename Player X or O
    function handlePlayerNameChange(symbol, newName){
        setPlayers(prevPlayers => {
            return {
                ...prevPlayers,
                [symbol]: newName
            };
        });
    }

    // UI Layout
    return (
      <main>
        <div id="game-container">
            {/* Player Names */}
          <ol id="players" className={'highlight-player'}>
              <Player initialName={PLAYERS.X}
                      symbol={"X"}
                      isActive={activePlayer==='X'}
                      onChangeName = {handlePlayerNameChange}
              />
              <Player initialName={PLAYERS.O}
                      symbol={"O"}
                      isActive={activePlayer==='O'}
                      onChangeName = {handlePlayerNameChange}
              />
          </ol>
            {/*When game over or Draw*/}
            {(winner || hasDraw) && (
                <GameOver
                    winner={winner}
                    onRestart={handleRestart}
                />
            )}

            {/* The actual tic-tac-toe grid */}
          <GameBoard
              onSelectSquare={handleSelectSquare}
              board={gameBoard}
              turns = {gameTurns}
          />
        </div>
          {/* Displays a history log of all moves */}
          <Log turns={gameTurns}/>
      </main>
  );
}

export default App

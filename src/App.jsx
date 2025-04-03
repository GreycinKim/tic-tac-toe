import Player from "./Components/Player.jsx";

function App() {
  return (
      <main>
        <div id="game-container">
          <ol id="players">
              <Player initialName={"Player 1"} symbol={"X"}></Player>
              <Player initialName={"Player 2"} symbol={"O"}></Player>
          </ol>
          GAMEBOARD
        </div>

        LOG
      </main>
  );
}

export default App

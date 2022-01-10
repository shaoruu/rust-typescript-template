import { GameOfLife } from "../dist";

(async () => {
  const game = new GameOfLife();
  await game.initialize();

  const button = document.getElementById("start");

  button.addEventListener("click", () => {
    if (game.paused) {
      button.textContent = "pause";
      game.resume();
    } else {
      button.textContent = "start";
      game.pause();
    }
  });
})();

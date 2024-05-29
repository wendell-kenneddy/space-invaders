import { Alien } from "./lib/Alien";
import { Engine2d } from "./lib/Engine2d";
import { Renderer2d } from "./lib/Renderer2d";

import "./styles/style.css";

const canvas = document.getElementById("game-screen") as HTMLCanvasElement;
const canvasContext2d = canvas.getContext("2d") as CanvasRenderingContext2D;
const spritesheet = new Image(111, 128);
const renderer2d = new Renderer2d(canvasContext2d);
const engine2d = new Engine2d(renderer2d);
const spaceship = new Alien(
  {
    width: 24,
    height: 24,
    velocityX: 0,
    velocityY: 0,
    positionX: 308,
    positionY: canvas.height - 32,
    spriteDataOrColor: {
      cropPositionX: 180,
      cropPositionY: 90,
      cropWidth: 80,
      cropHeight: 80,
      spritesheetSrc: spritesheet,
    },
  },
  5
);

spritesheet.src = "/spritesheet-scaled.png";

function createAliensGrid() {
  const aliensPerRow = 11;
  const rows = 5;
  const spriteSpacing = 10;
  const spriteWidth = 80;
  const spriteHeight = 80;
  const finalSize = 24;
  const aliens: Alien[] = [];
  const startX =
    (canvas.width - (aliensPerRow * finalSize + spriteSpacing * (aliensPerRow - 1))) / 2;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < aliensPerRow; j++) {
      aliens.push(
        new Alien(
          {
            width: finalSize,
            height: finalSize,
            positionX: startX + j * (finalSize + spriteSpacing),
            positionY: 30 + i * (finalSize + spriteSpacing),
            velocityX: 0,
            velocityY: 0,
            spriteDataOrColor: {
              spritesheetSrc: spritesheet,
              cropPositionX: 0,
              cropPositionY: 0,
              cropWidth: spriteWidth,
              cropHeight: spriteHeight,
            },
          },
          5
        )
      );
    }
  }

  return aliens;
}

spritesheet.addEventListener("load", () => {
  const aliens = createAliensGrid();

  engine2d.addManyGameObjects(aliens);
  engine2d.addOneGameObject(spaceship);
  engine2d.startGameLoop();

  const objects = Object.values(engine2d.getEngineState().gameObjects);
  const engineState = engine2d.getEngineState();
  engineState.stores["as"] = 1;
  console.log(engineState.stores);

  console.log(objects);
});

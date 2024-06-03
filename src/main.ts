import { Alien } from "./lib/Alien";
import { AlienBehaviorScript } from "./lib/AlienBehaviorScript";
import { CollisionSystem2d } from "./lib/CollisionSystem2d";
import { Engine2d } from "./lib/Engine2d";
import { KeyboardInputSystem } from "./lib/KeyboardInputSystem";
import { ProjectileFiringScript } from "./lib/ProjectileFiringScript";
import { Renderer2d } from "./lib/Renderer2d";
import { Spaceship } from "./lib/Spaceship";

import "./styles/style.css";

const spritesheet = new Image(111, 128);
spritesheet.src = "/spritesheet-end.png";

const canvas = document.getElementById("game-screen") as HTMLCanvasElement;
const canvasContext2d = canvas.getContext("2d") as CanvasRenderingContext2D;
const renderer2d = new Renderer2d(canvasContext2d, 2, 750);
const collisionSystem2d = new CollisionSystem2d({
  screenStartX: 0,
  screenStartY: 0,
  screenEndX: canvas.width,
  screenEndY: canvas.height,
});
const keyboardInputSystem = new KeyboardInputSystem();
const engine2d = new Engine2d(renderer2d, collisionSystem2d, keyboardInputSystem);
const spaceship = new Spaceship({
  width: 24,
  height: 24,
  positionX: canvas.width / 2 - 12,
  positionY: canvas.height - 36,
  velocityX: 2.5,
  velocityY: 0,
  spriteDataOrColor: [
    {
      spritesheetSrc: spritesheet,
      cropPositionX: 20,
      cropPositionY: 540,
      cropWidth: 120,
      cropHeight: 80,
    },
  ],
});

function createAliensGrid() {
  const aliensPerRow = 12;
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
      const pointsWorth = 5 * (i + 1);
      aliens.push(
        new Alien(
          {
            width: finalSize,
            height: finalSize,
            positionX: startX + j * (finalSize + spriteSpacing),
            positionY: 20 + i * (finalSize + spriteSpacing),
            velocityX: 0.5,
            velocityY: 7,
            spriteDataOrColor: [
              {
                spritesheetSrc: spritesheet,
                cropPositionX: 0,
                cropPositionY: i * (spriteHeight + spriteSpacing),
                cropWidth: spriteWidth,
                cropHeight: spriteHeight,
              },
              {
                spritesheetSrc: spritesheet,
                cropPositionX: spriteWidth + spriteSpacing,
                cropPositionY: i * (spriteHeight + spriteSpacing),
                cropWidth: spriteWidth,
                cropHeight: spriteHeight,
              },
            ],
          },
          pointsWorth
        )
      );
    }
  }

  return aliens;
}

spritesheet.addEventListener("load", () => {
  const aliens = createAliensGrid();
  const alienBehaviorScript = new AlienBehaviorScript(true);
  const projectileFiringScript = new ProjectileFiringScript(true, spaceship.getData().id);

  engine2d.addOneGameObject(spaceship);
  engine2d.addManyGameObjects(aliens);
  engine2d.addLogicScript(alienBehaviorScript);
  engine2d.addLogicScript(projectileFiringScript);
  engine2d.startGameLoop();
  setTimeout(() => {
    console.log(engine2d.getEngineState().stores);
  }, 5000);
});

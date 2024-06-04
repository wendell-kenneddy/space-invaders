import { Engine2d } from "@core/Engine2d";
import { Renderer2d } from "@core/Renderer2d";
import { CollisionSystem2d } from "@core/CollisionSystem2d";
import { KeyboardInputSystem } from "@core/KeyboardInputSystem";
import { Alien } from "@game-objects/Alien";
import { Spaceship } from "@game-objects/Spaceship";
import { AlienBehaviorScript } from "@scripts/AlienBehaviorScript";
import { SpaceshipBehaviorScript } from "@scripts/SpaceshipBehaviorScript";

import "./styles/style.css";
import { DynamicDisplay } from "./lib/text-objects/DynamicDisplay";

const spritesheet = new Image(111, 128);
spritesheet.src = "/spritesheet-end.png";

const canvas = document.getElementById("game-screen") as HTMLCanvasElement;
const canvasContext2d = canvas.getContext("2d") as CanvasRenderingContext2D;
const renderer2d = new Renderer2d(canvasContext2d, 2, 750);
const collisionSystem2d = new CollisionSystem2d({
  screenStartX: 0,
  screenStartY: 60,
  screenEndX: canvas.width,
  screenEndY: canvas.height,
});
const keyboardInputSystem = new KeyboardInputSystem();
const engine2d = new Engine2d(renderer2d, collisionSystem2d, keyboardInputSystem);

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
            positionY: 60 + i * (finalSize + spriteSpacing),
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
  const scoreDisplay = new DynamicDisplay(true, {
    content: "Score: 0",
    color: "#fff",
    font: "24px monospace",
    maxWidth: 120,
    positionX: 20,
    positionY: 40,
    key: "score",
    defaultValue: 0,
  });
  const hpDisplay = new DynamicDisplay(true, {
    content: "hp: 3",
    color: "#fff",
    font: "24px monospace",
    maxWidth: 180,
    positionX: 180,
    positionY: 40,
    key: "spaceship-hp",
    defaultValue: 3,
  });
  const alienBehaviorScript = new AlienBehaviorScript(true);
  const spaceshipBehaviorScript = new SpaceshipBehaviorScript(true, spaceship.getData().id, 500);

  engine2d.addOneRenderableObject(scoreDisplay);
  engine2d.addOneRenderableObject(hpDisplay);
  engine2d.addOneRenderableObject(spaceship);
  engine2d.addManyRenderableObjects(aliens);
  engine2d.addLogicScript(spaceshipBehaviorScript);
  engine2d.addLogicScript(alienBehaviorScript);
  engine2d.startGameLoop();
});

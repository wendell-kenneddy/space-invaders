import { CollisionSystem2d } from "@core/CollisionSystem2d";
import { Engine2d } from "@core/Engine2d";
import { KeyboardInputSystem } from "@core/KeyboardInputSystem";
import { Renderer2d } from "@core/Renderer2d";
import { Alien } from "./interactable-objects/Alien";
import { Spaceship } from "./interactable-objects/Spaceship";
import { DynamicDisplay } from "./text-objects/DynamicDisplay";
import { AlienBehaviorScript } from "@scripts/AlienBehaviorScript";
import { SpaceshipBehaviorScript } from "@scripts/SpaceshipBehaviorScript";
import { LogicScript } from "@interfaces/LogicScript";
import { EngineState } from "@interfaces/Engine";

export class GameManager {
  private spritesheet = new Image(111, 128);
  private readonly canvas = document.getElementById("game-screen") as HTMLCanvasElement;
  private readonly context2d = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  private readonly renderer2d = new Renderer2d(this.context2d, 2, 750);
  private readonly collisionSystem2d = new CollisionSystem2d({
    screenStartX: 0,
    screenStartY: 60,
    screenEndX: this.canvas.width,
    screenEndY: this.canvas.height,
  });
  private readonly keyboardInputSystem = new KeyboardInputSystem();
  private readonly engine2d = new Engine2d(
    this.renderer2d,
    this.collisionSystem2d,
    this.keyboardInputSystem
  );
  private spaceshipId: string | null = null;

  init() {
    this.spritesheet.src = "/spritesheet-end.png";
    this.spritesheet.addEventListener("load", () => this.startNewGame());
  }

  private startNewGame(): void {
    this.addGameComponentsToEngine();
    this.engine2d.startGameLoop();
    this.engine2d.setOnGameEndFn(({ stores }: EngineState) => {
      let message: string = "The aliens got you! Press OK to play again.";
      const completionPercentage = stores["completion-percentage"] ?? 0;

      if (completionPercentage >= 1) {
        message = "Congrats, max score achieved! Press OK to play again.";
      }

      alert(message);
      this.engine2d.hardReset();
      this.startNewGame();
    });
  }

  private addGameComponentsToEngine(): void {
    const spaceship = this.createSpaceship();
    const hpDisplay = this.createHpDisplay();
    const scoreDisplay = this.createScoreDisplay();
    const alienGrid = this.createAlienGrid();
    this.spaceshipId = spaceship.getData().id;
    const scripts = this.createLogicScripts();
    this.engine2d.addOneRenderableObject(spaceship);
    this.engine2d.addOneRenderableObject(hpDisplay);
    this.engine2d.addOneRenderableObject(scoreDisplay);
    this.engine2d.addManyRenderableObjects(alienGrid);
    this.engine2d.addManyLogicScripts(scripts);
  }

  private createLogicScripts(): LogicScript[] {
    const id = String(this.spaceshipId);
    const alienBehaviorScript = new AlienBehaviorScript(true);
    const spaceshipBehaviorScript = new SpaceshipBehaviorScript(true, id, 400);
    return [alienBehaviorScript, spaceshipBehaviorScript];
  }

  private createScoreDisplay(): DynamicDisplay {
    return new DynamicDisplay(true, {
      content: "Score: 0",
      color: "#fff",
      font: "24px monospace",
      maxWidth: 120,
      positionX: 20,
      positionY: 40,
      key: "score",
      defaultValue: 0,
    });
  }

  private createHpDisplay(): DynamicDisplay {
    return new DynamicDisplay(true, {
      content: "hp: 3",
      color: "#fff",
      font: "24px monospace",
      maxWidth: 180,
      positionX: 180,
      positionY: 40,
      key: "spaceship-hp",
      defaultValue: 3,
    });
  }

  private createSpaceship(): Spaceship {
    return new Spaceship({
      width: 24,
      height: 24,
      positionX: this.canvas.width / 2 - 12,
      positionY: this.canvas.height - 36,
      velocityX: 2.5,
      velocityY: 0,
      spriteDataOrColor: [
        {
          spritesheetSrc: this.spritesheet,
          cropPositionX: 20,
          cropPositionY: 540,
          cropWidth: 120,
          cropHeight: 80,
        },
      ],
    });
  }

  private createAlienGrid(): Alien[] {
    const aliensPerRow = 11;
    const rows = 5;
    const spriteSpacing = 10;
    const spriteWidth = 80;
    const spriteHeight = 80;
    const finalSize = 24;
    const aliens: Alien[] = [];
    const startX =
      (this.canvas.width - (aliensPerRow * finalSize + spriteSpacing * (aliensPerRow - 1))) / 2;

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
              velocityX: 1,
              velocityY: 6,
              spriteDataOrColor: [
                {
                  spritesheetSrc: this.spritesheet,
                  cropPositionX: 0,
                  cropPositionY: i * (spriteHeight + spriteSpacing),
                  cropWidth: spriteWidth,
                  cropHeight: spriteHeight,
                },
                {
                  spritesheetSrc: this.spritesheet,
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
}

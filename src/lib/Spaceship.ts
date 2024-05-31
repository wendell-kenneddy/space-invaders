import { v4 } from "uuid";
import { GameObject, GameObjectConfig } from "./interfaces/GameObject";
import { EngineState } from "./interfaces/Engine";

export interface SpaceshipConfig extends GameObjectConfig {}

export class Spaceship implements GameObject {
  private readonly id = v4();
  private readonly canBeDestroyed = true;

  constructor(private readonly config: Omit<GameObjectConfig, "id" | "canBeDestroyed">) {}

  getData(): SpaceshipConfig {
    return {
      id: this.id,
      canBeDestroyed: this.canBeDestroyed,
      ...this.config,
    };
  }

  fire(): void {
    console.log("Fire!");
  }

  update({ collisionSystem, inputSystemState }: EngineState): void {
    const inputData = inputSystemState.inputData;
    const horizontalBoundsCollision = collisionSystem.checkIfIsOutOfBounds(this, "horizontal");

    if (inputData["ArrowLeft"] && horizontalBoundsCollision != "left") {
      this.config.positionX -= this.config.velocityX;
    }

    if (inputData["ArrowRight"] && horizontalBoundsCollision != "right") {
      this.config.positionX += this.config.velocityX;
    }
  }
}

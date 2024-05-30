import { v4 } from "uuid";
import { GameObject, GameObjectConfig } from "./interfaces/GameObject";

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

  fire() {
    console.log("Fire!");
  }

  update(): void {}
}

import { v4 } from "uuid";
import { GameObject, GameObjectConfig } from "./interfaces/GameObject";

export interface AlienConfig extends GameObjectConfig {
  pointsWorth: number;
}

export class Alien implements GameObject {
  private readonly id = v4();
  private readonly canBeDestroyed = true;

  constructor(
    private readonly config: Omit<GameObjectConfig, "id" | "canBeDestroyed">,
    private readonly pointsWorth: number
  ) {}

  getData(): AlienConfig {
    return {
      id: this.id,
      canBeDestroyed: this.canBeDestroyed,
      pointsWorth: this.pointsWorth,
      ...this.config,
    };
  }

  update(): void {}
}

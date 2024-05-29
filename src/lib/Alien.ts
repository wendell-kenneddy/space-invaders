import { v4 } from "uuid";
import { GameObject, GameObjectConfig } from "./interfaces/GameObject";

export interface AlienConfig extends GameObjectConfig {
  pointsWorth: number;
}

export class Alien implements GameObject {
  readonly id = v4();
  readonly canBeDestroyed: boolean = true;

  constructor(private readonly config: GameObjectConfig, private readonly pointsWorth: number) {}

  getData(): AlienConfig {
    return { ...this.config, pointsWorth: this.pointsWorth };
  }

  update(): void {}
}

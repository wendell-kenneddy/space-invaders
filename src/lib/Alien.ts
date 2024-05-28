import { GameObject, GameObjectConfig } from "./GameObject";

export interface AlienConfig extends GameObjectConfig {
  pointsWorth: number;
}

export class Alien extends GameObject {
  constructor(config: GameObjectConfig, private readonly pointsWorth: number) {
    super(config);
  }

  update(): void {}

  getData(): AlienConfig {
    return { ...this.config, pointsWorth: this.pointsWorth };
  }
}

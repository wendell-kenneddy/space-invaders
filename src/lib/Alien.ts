import { v4 } from "uuid";
import { GameObject, GameObjectConfig } from "./interfaces/GameObject";
import { EngineState } from "./interfaces/Engine";

export type AlienMotion = 1 | -1;

export interface AlienConfig extends GameObjectConfig {
  pointsWorth: number;
  motion: AlienMotion;
}

export class Alien implements GameObject {
  private readonly id = v4();
  private readonly canBeDestroyed = true;
  private currentMotion: AlienMotion = 1;

  constructor(
    private readonly config: Omit<GameObjectConfig, "id" | "canBeDestroyed">,
    private readonly pointsWorth: number
  ) {
    config.velocityX < 0 && (this.currentMotion = -1);
  }

  getData(): AlienConfig {
    return {
      id: this.id,
      canBeDestroyed: this.canBeDestroyed,
      pointsWorth: this.pointsWorth,
      motion: this.currentMotion,
      ...this.config,
    };
  }

  update(engineState: EngineState): void {
    const stores = engineState.stores;
    const velocityMultiplier = stores["velocity-multiplier"] ?? 1;
    const motion = stores["motion"] ?? this.currentMotion;
    if (motion != this.currentMotion) {
      this.currentMotion = -this.currentMotion as AlienMotion;
      this.config.velocityX = -this.config.velocityX;
      this.config.positionY += this.config.velocityY;
    }

    this.config.positionX += this.config.velocityX * velocityMultiplier;
  }
}

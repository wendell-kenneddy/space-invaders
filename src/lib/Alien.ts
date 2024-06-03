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

  update({ stores }: EngineState): void {
    const completionPercentage: number = stores["completion-percentage"] ?? 0;
    let velocityMultiplier: number = 1;

    if (completionPercentage > 0) {
      // since the game ends when completionPercentage reaches 100% (55/55 aliens dead), 1/55
      // is added to ensure velocity is at max when only 1 alien
      velocityMultiplier += 1 * (completionPercentage + 1 / 55);
    }

    const motion = stores["motion"] ?? this.currentMotion;
    if (motion != this.currentMotion) {
      this.currentMotion = -this.currentMotion as AlienMotion;
      this.config.velocityX = -this.config.velocityX;
      this.config.positionY += this.config.velocityY;
    }

    this.config.positionX += Math.min(this.config.velocityX * velocityMultiplier);
  }
}

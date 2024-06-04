import { v4 } from "uuid";
import { LogicScript, LogicScriptData } from "@interfaces/LogicScript";
import { EngineState } from "@interfaces/Engine";
import { Projectile } from "@game-objects/Projectile";
import { GameObjectConfig } from "@interfaces/GameObject";

export class ProjectileFiringScript implements LogicScript {
  private readonly id = v4();
  private hasBeenExecuted: boolean = false;
  private lastShotTimestamp: number | null = null;
  // don't set this too low otherwise some weird shit might happen, keep it >300
  private readonly fireIntervalInMilliseconds: number = 500;
  private currentEngineState: EngineState | null = null;

  constructor(private readonly canBeDestroyed: boolean, private readonly spaceshipId: string) {}

  execute(engineState: EngineState): void {
    !this.hasBeenExecuted && (this.hasBeenExecuted = true);
    this.currentEngineState = engineState;

    if (engineState.inputSystemState.inputData["x"]) {
      if (!this.lastShotTimestamp) {
        this.fireProjectile();
        return;
      }

      const delta = performance.now() - this.lastShotTimestamp;
      delta >= this.fireIntervalInMilliseconds && this.fireProjectile();
    }
  }

  getScriptData(): LogicScriptData {
    return {
      id: this.id,
      canBeDestroyed: this.canBeDestroyed,
      hasBeenExecuted: this.hasBeenExecuted,
    };
  }

  private fireProjectile(): void {
    const { requestGameObjectAdd, requestStoresEdit, stores } = this
      .currentEngineState as EngineState;
    const projectileIds: string[] = stores["ally-projectile-ids"] ?? [];
    const projectile = this.createNewProjectile();

    requestGameObjectAdd(projectile);
    this.lastShotTimestamp = performance.now();
    requestStoresEdit("ally-projectile-ids", [...projectileIds, projectile.getData().id], false);
  }

  private createNewProjectile(): Projectile {
    const spaceshipData = this.currentEngineState?.gameObjects[
      this.spaceshipId
    ].getData() as GameObjectConfig;
    const width = 4;
    const height = 4;
    const positionX = spaceshipData.positionX + spaceshipData.width / 2 - width / 2;
    const positionY = spaceshipData.positionY - height;
    const projectile = new Projectile(
      {
        width,
        height,
        spriteDataOrColor: "#fff",
        velocityX: 0,
        velocityY: -5,
        positionY,
        positionX,
      },
      true,
      "ally"
    );
    return projectile;
  }
}

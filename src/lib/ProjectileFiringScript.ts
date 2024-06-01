import { v4 } from "uuid";
import { LogicScript, LogicScriptData } from "./interfaces/LogicScript";
import { EngineState } from "./interfaces/Engine";
import { Projectile } from "./Projectile";
import { GameObjectConfig } from "./interfaces/GameObject";

export class ProjectileFiringScript implements LogicScript {
  private readonly id = v4();
  private hasBeenExecuted: boolean = false;
  private lastShotTimestamp: number | null = null;
  private readonly fireIntervalInMilliseconds: number = 650;
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
    const projectile = this.createNewProjectile();
    requestGameObjectAdd(projectile);
    this.lastShotTimestamp = performance.now();

    if (!stores["projectile-ids"]) {
      requestStoresEdit("projectile-ids", [projectile.getData().id], false);
      return;
    }
    requestStoresEdit(
      "projectile-ids",
      [...stores["projectile-ids"], projectile.getData().id],
      false
    );
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
        velocityY: 5,
        positionY,
        positionX,
      },
      true
    );
    return projectile;
  }
}

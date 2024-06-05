import { v4 } from "uuid";
import { LogicScript, LogicScriptData } from "@interfaces/LogicScript";
import { EngineState } from "@interfaces/Engine";
import { Projectile } from "../interactable-objects/Projectile";
import { InteractableObjectConfig } from "@interfaces/InteractableObject";

export class SpaceshipBehaviorScript implements LogicScript {
  private readonly id = v4();
  private hasBeenExecuted: boolean = false;
  private lastShotTimestamp: number | null = null;
  private currentEngineState: EngineState | null = null;

  constructor(
    private readonly canBeDestroyed: boolean,
    private readonly spaceshipId: string,
    private readonly fireIntervalInMilliseconds: number
  ) {}

  execute(engineState: EngineState): void {
    !this.hasBeenExecuted && (this.hasBeenExecuted = true);
    this.currentEngineState = engineState;
    this.resolveEnemyProjectileHits();

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

  private resolveEnemyProjectileHits(): void {
    if (!this.currentEngineState) return;
    const {
      stores,
      renderableObjects,
      collisionSystem,
      requestRenderableObjectDestruction,
      requestStoresEdit,
      requestGameStop,
    } = this.currentEngineState;
    const enemyProjectileIds: string[] = stores["enemy-projectile-ids"] ?? [];

    for (let i = 0; i < enemyProjectileIds.length; i++) {
      const projectile = renderableObjects[enemyProjectileIds[i]];
      if (!projectile) continue;
      const isBeingHit = collisionSystem.checkOneAgainstOne(
        renderableObjects[this.spaceshipId],
        projectile,
        "both"
      );

      if (isBeingHit) {
        const hp = stores["spaceship-hp"] ?? 3;
        if (hp - 1 == 0) return requestGameStop();

        requestRenderableObjectDestruction(enemyProjectileIds[i]);
        requestStoresEdit("spaceship-hp", hp - 1, false);
      }
    }
  }

  private fireProjectile(): void {
    const { requestRenderableObjectAdd, requestStoresEdit, stores } = this
      .currentEngineState as EngineState;
    const projectileIds: string[] = stores["ally-projectile-ids"] ?? [];
    const projectile = this.createNewProjectile();

    requestRenderableObjectAdd(projectile);
    requestStoresEdit("ally-projectile-ids", [...projectileIds, projectile.getData().id], false);
    this.lastShotTimestamp = performance.now();
  }

  private createNewProjectile(): Projectile {
    const spaceshipData = this.currentEngineState?.renderableObjects[
      this.spaceshipId
    ].getData() as InteractableObjectConfig;
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
        velocityY: -10,
        positionY,
        positionX,
      },
      true,
      "ally"
    );
    return projectile;
  }
}

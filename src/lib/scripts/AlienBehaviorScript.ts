import { v4 } from "uuid";
import { LogicScript, LogicScriptData } from "@interfaces/LogicScript";
import { EngineState } from "@interfaces/Engine";
import { Alien } from "../interactable-objects/Alien";
import { Projectile } from "../interactable-objects/Projectile";

export class AlienBehaviorScript implements LogicScript {
  private readonly id = v4();
  private hasBeenExecuted: boolean = false;
  private projectileIds: string[] = [];
  private currentEngineState: EngineState | null = null;
  private readonly baseFiringChance = 0.15;
  private readonly maxFiringChance = 0.55;
  private firingInterval = 500;
  private lastShotTimestamp: number | null = null;
  private alienCooldowns: Record<string, number> = {};

  constructor(private readonly canBeDestroyed: boolean) {}

  execute(engineState: EngineState): void {
    !this.hasBeenExecuted && (this.hasBeenExecuted = true);
    this.currentEngineState = engineState;
    let alienCount: number = 0;

    const { renderableObjects } = engineState;

    for (const gameObject of Object.values(renderableObjects)) {
      if (!(gameObject instanceof Alien)) continue;
      alienCount++;
      const shouldFire = this.checkFiringChance();
      const now = performance.now();

      this.checkCollisionWithProjectile(gameObject);
      this.handleMotion(gameObject);

      if (!this.lastShotTimestamp || now - this.lastShotTimestamp >= this.firingInterval) {
        const alienId = gameObject.getData().id;

        if (this.alienCooldowns[alienId] && this.alienCooldowns[alienId] > 0) {
          this.alienCooldowns[alienId]--;
          return;
        }

        shouldFire && this.fireProjectile(alienId);
        this.alienCooldowns[alienId] = 2;
        this.lastShotTimestamp = now;
      }
    }

    alienCount == 0 && engineState.requestGameStop();
  }

  getScriptData(): LogicScriptData {
    return {
      id: this.id,
      canBeDestroyed: this.canBeDestroyed,
      hasBeenExecuted: this.hasBeenExecuted,
    };
  }

  private fireProjectile(alienId: string): void {
    if (!this.currentEngineState) return;
    const { requestRenderableObjectAdd, requestStoresEdit, stores, renderableObjects } =
      this.currentEngineState;
    const alienData = renderableObjects[alienId].getData();
    const projectileIds: string[] = stores["enemy-projectile-ids"] ?? [];
    const width = 4;
    const height = 4;
    const projectile = new Projectile(
      {
        width,
        height,
        spriteDataOrColor: "red",
        velocityX: 0,
        velocityY: 5,
        positionY: alienData.positionY + height,
        positionX: alienData.positionX + alienData.width / 2 - width / 2,
      },
      true,
      "enemy"
    );

    requestRenderableObjectAdd(projectile);
    requestStoresEdit("enemy-projectile-ids", [...projectileIds, projectile.getData().id], false);
  }

  private checkFiringChance(): boolean {
    const { stores } = this.currentEngineState as EngineState;
    const completionPercentage: number = stores["completion-percentage"] ?? 0;
    const rolledNumber: number = Math.random() * 1;
    let finalChance = this.baseFiringChance;

    if (completionPercentage > 0) {
      finalChance += (this.maxFiringChance - this.baseFiringChance) * completionPercentage + 1 / 55;
    }

    return rolledNumber <= finalChance;
  }

  private checkCollisionWithProjectile(currentAlien: Alien) {
    if (!this.currentEngineState) return;
    const { renderableObjects, collisionSystem, stores } = this.currentEngineState;
    this.projectileIds = stores["ally-projectile-ids"] ?? [];
    if (!this.projectileIds.length) return;

    for (let i = 0; i < this.projectileIds.length; i++) {
      const projectile = renderableObjects[this.projectileIds[i]] as Projectile;
      if (!projectile) continue;
      const isBeingHit = collisionSystem.checkOneAgainstOne(projectile, currentAlien, "both");

      if (isBeingHit) this.handleProjectileCollision(currentAlien, projectile);
    }
  }

  private handleProjectileCollision(alien: Alien, projectile: Projectile) {
    if (!this.currentEngineState) return;
    const { requestRenderableObjectDestruction, requestStoresEdit, stores } =
      this.currentEngineState;
    const projectileId = projectile.getData().id;
    const filteredProjectileIds = this.projectileIds.filter((id) => id != projectileId);
    const currentCompletionPercentage = stores["completion-percentage"] ?? 0;
    const currentScore = stores["score"] ?? 0;
    requestStoresEdit("ally-projectile-ids", filteredProjectileIds, false);
    requestStoresEdit("completion-percentage", currentCompletionPercentage + 1 / 55, false);
    requestStoresEdit("score", currentScore + alien.getData().pointsWorth, false);
    requestRenderableObjectDestruction(projectileId);
    requestRenderableObjectDestruction(alien.getData().id);
  }

  private handleMotion(currentAlien: Alien) {
    if (!this.currentEngineState) return;

    const { stores, collisionSystem, requestStoresEdit, requestGameStop } = this.currentEngineState;
    const motion = stores["motion"] ?? currentAlien.getData().motion;
    const horizontalBoundsCollision = collisionSystem.checkIfIsOutOfBounds(
      currentAlien,
      "horizontal"
    );
    const verticalBoundsCollision = collisionSystem.checkIfIsOutOfBounds(currentAlien, "vertical");

    if (horizontalBoundsCollision != null) {
      requestStoresEdit("motion", -motion, false);
    }

    if (verticalBoundsCollision == "bottom") {
      return requestGameStop();
    }
  }
}

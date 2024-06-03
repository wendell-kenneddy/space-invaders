import { v4 } from "uuid";
import { LogicScript, LogicScriptData } from "./interfaces/LogicScript";
import { EngineState } from "./interfaces/Engine";
import { Alien } from "./Alien";
import { Projectile } from "./Projectile";

export class AlienBehaviorScript implements LogicScript {
  private readonly id = v4();
  private hasBeenExecuted: boolean = false;
  private projectileIds: string[] = [];
  private currentEngineState: EngineState | null = null;
  private readonly baseFiringChance = 0.15;
  private readonly maxFiringChance = 0.4;
  private firingInterval = 500;
  private lastShotTimestamp: number | null = null;
  private alienCooldowns: Record<string, number> = {};

  constructor(private readonly canBeDestroyed: boolean) {}

  execute(engineState: EngineState): void {
    !this.hasBeenExecuted && (this.hasBeenExecuted = true);
    this.currentEngineState = engineState;

    const { gameObjects } = engineState;

    for (const gameObject of Object.values(gameObjects)) {
      if (!(gameObject instanceof Alien)) continue;
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
        return;
      }
    }
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
    const { requestGameObjectAdd, requestStoresEdit, stores, gameObjects } =
      this.currentEngineState;
    const alienData = gameObjects[alienId].getData();
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
    requestGameObjectAdd(projectile);

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
    const { gameObjects, collisionSystem, stores } = this.currentEngineState;
    this.projectileIds = stores["ally-projectile-ids"] ?? [];
    if (!this.projectileIds.length) return;

    for (let i = 0; i < this.projectileIds.length; i++) {
      const projectile = gameObjects[this.projectileIds[i]] as Projectile;
      const isBeingHit = collisionSystem.checkOneAgainstOne(projectile, currentAlien, "both");

      if (isBeingHit) this.handleProjectileCollision(currentAlien, projectile);
    }
  }

  private handleProjectileCollision(alien: Alien, projectile: Projectile) {
    if (!this.currentEngineState) return;
    const { requestGameObjectDestruction, requestStoresEdit, stores } = this.currentEngineState;
    const projectileId = projectile.getData().id;
    const filteredProjectileIds = this.projectileIds.filter((id) => id != projectileId);
    const currentCompletionPercentage = stores["completion-percentage"] ?? 0;
    requestStoresEdit("ally-projectile-ids", filteredProjectileIds, false);
    requestStoresEdit("completion-percentage", currentCompletionPercentage + 1 / 55, false);
    requestGameObjectDestruction(projectileId);
    requestGameObjectDestruction(alien.getData().id);
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

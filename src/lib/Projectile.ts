import { v4 } from "uuid";
import { GameObject, GameObjectConfig } from "./interfaces/GameObject";
import { EngineState } from "./interfaces/Engine";

export class Projectile implements GameObject {
  private readonly id = v4();

  constructor(
    private readonly config: Omit<GameObjectConfig, "id" | "canBeDestroyed">,
    private readonly canBeDestroyed: boolean,
    private readonly origin: "ally" | "enemy"
  ) {}

  getData(): GameObjectConfig {
    return {
      id: this.id,
      canBeDestroyed: this.canBeDestroyed,
      ...this.config,
    };
  }

  update({
    collisionSystem,
    requestGameObjectDestruction,
    stores,
    requestStoresEdit,
  }: EngineState): void {
    const isOutOfBounds = collisionSystem.checkIfIsOutOfBounds(this, "vertical");
    if (isOutOfBounds) {
      const key = `${this.origin}-projectile-ids`;
      const projectileIds: string[] = stores[key] ?? [];
      const filteredProjectileIds = projectileIds.filter((id) => id != this.id);
      requestStoresEdit(key, filteredProjectileIds, false);
      requestGameObjectDestruction(this.id);
      return;
    }

    this.config.positionY += this.config.velocityY;
  }
}

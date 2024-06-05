import { v4 } from "uuid";
import { InteractableObject, InteractableObjectConfig } from "@interfaces/InteractableObject";
import { EngineState } from "@interfaces/Engine";

export class Projectile implements InteractableObject {
  private readonly id = v4();

  constructor(
    private readonly config: Omit<InteractableObjectConfig, "id" | "canBeDestroyed">,
    private readonly canBeDestroyed: boolean,
    private readonly origin: "ally" | "enemy"
  ) {}

  getData(): InteractableObjectConfig {
    return {
      id: this.id,
      canBeDestroyed: this.canBeDestroyed,
      ...this.config,
    };
  }

  update({
    collisionSystem,
    requestRenderableObjectDestruction,
    stores,
    requestStoresEdit,
  }: EngineState): void {
    const isOutOfBounds = collisionSystem.checkIfIsOutOfBounds(this, "vertical");
    if (isOutOfBounds) {
      const key = `${this.origin}-projectile-ids`;
      const projectileIds: string[] = stores[key] ?? [];
      const filteredProjectileIds = projectileIds.filter((id) => id != this.id);
      requestStoresEdit(key, filteredProjectileIds, false);
      requestRenderableObjectDestruction(this.id);
      return;
    }

    this.config.positionY += this.config.velocityY;
  }
}

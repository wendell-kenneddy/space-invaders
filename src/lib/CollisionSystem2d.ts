import { CollisionAxis, CollisionSystem, ScreenBoundaries } from "./interfaces/CollisionSystem";
import { GameObject, GameObjectConfig } from "./interfaces/GameObject";

export class CollisionSystem2d implements CollisionSystem {
  constructor(private readonly boundaries: ScreenBoundaries) {}

  checkOneAgainstOne(collider1: GameObject, collider2: GameObject, axis: CollisionAxis) {
    const collider1Data = collider1.getData();
    const collider2Data = collider2.getData();
    let collisionDetected: boolean = false;

    switch (axis) {
      case "horizontal":
        collisionDetected = this.checkOneToOneHorizontalCollision(collider1Data, collider2Data);
        break;
      case "vertical":
        collisionDetected = this.checkOneToOneVerticalCollision(collider1Data, collider2Data);
        break;
      default:
        collisionDetected =
          this.checkOneToOneHorizontalCollision(collider1Data, collider2Data) &&
          this.checkOneToOneVerticalCollision(collider1Data, collider2Data);
        break;
    }

    return collisionDetected;
  }

  checkIfIsOutOfBounds(gameObject: GameObject, axis: CollisionAxis) {
    const { width, height, positionX, positionY, velocityX, velocityY } = gameObject.getData();
    const { screenStartX, screenEndX, screenStartY, screenEndY } = this.boundaries;

    if (axis == "horizontal" && positionX - Math.abs(velocityX) <= screenStartX) return "left";
    if (axis == "horizontal" && positionX + width + velocityX >= screenEndX) return "right";
    if (axis == "vertical" && positionY - Math.abs(velocityY) <= screenStartY) return "top";
    if (axis == "vertical" && positionY + height + velocityY >= screenEndY) return "bottom";
    return null;
  }

  private checkOneToOneHorizontalCollision(
    collider1Data: GameObjectConfig,
    collider2Data: GameObjectConfig
  ) {
    if (
      collider1Data.positionX + collider1Data.width >= collider2Data.positionX &&
      collider1Data.positionX + collider1Data.width <= collider2Data.positionX + collider2Data.width
    )
      return true;
    return false;
  }

  private checkOneToOneVerticalCollision(
    collider1Data: GameObjectConfig,
    collider2Data: GameObjectConfig
  ) {
    if (
      collider1Data.positionY <= collider2Data.positionY + collider2Data.height ||
      collider1Data.positionY + collider1Data.height >= collider2Data.positionY
    )
      return true;
    return false;
  }
}

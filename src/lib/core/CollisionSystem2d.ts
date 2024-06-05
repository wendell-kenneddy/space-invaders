import { CollisionAxis, CollisionSystem, ScreenBoundaries } from "@interfaces/CollisionSystem";
import { InteractableObject, InteractableObjectConfig } from "@interfaces/InteractableObject";

export class CollisionSystem2d implements CollisionSystem {
  constructor(private readonly boundaries: ScreenBoundaries) {}

  checkOneAgainstOne(
    collider1: InteractableObject,
    collider2: InteractableObject,
    axis: CollisionAxis
  ) {
    const collider1Data = collider1.getData();
    const collider2Data = collider2.getData();

    if (axis == "horizontal")
      return this.checkOneToOneHorizontalCollision(collider1Data, collider2Data);
    if (axis == "vertical")
      return this.checkOneToOneVerticalCollision(collider1Data, collider2Data);
    return (
      this.checkOneToOneHorizontalCollision(collider1Data, collider2Data) &&
      this.checkOneToOneVerticalCollision(collider1Data, collider2Data)
    );
  }

  checkIfIsOutOfBounds(interactableObject: InteractableObject, axis: CollisionAxis) {
    const { width, height, positionX, positionY, velocityX, velocityY } =
      interactableObject.getData();
    const { screenStartX, screenEndX, screenStartY, screenEndY } = this.boundaries;

    if (axis == "horizontal" && positionX - Math.abs(velocityX) <= screenStartX) return "left";
    if (axis == "horizontal" && positionX + width + velocityX >= screenEndX) return "right";
    if (axis == "vertical" && positionY - Math.abs(velocityY) <= screenStartY) return "top";
    if (axis == "vertical" && positionY + height + velocityY >= screenEndY) return "bottom";
    return null;
  }

  private checkOneToOneHorizontalCollision(
    collider1Data: InteractableObjectConfig,
    collider2Data: InteractableObjectConfig
  ) {
    if (
      (collider1Data.positionX <= collider2Data.positionX &&
        collider1Data.positionX + collider1Data.width > collider2Data.positionX) ||
      (collider1Data.positionX >= collider2Data.positionX &&
        collider1Data.positionX <= collider2Data.positionX + collider2Data.width)
    ) {
      return true;
    }
    return false;
  }

  private checkOneToOneVerticalCollision(
    collider1Data: InteractableObjectConfig,
    collider2Data: InteractableObjectConfig
  ) {
    if (
      (collider1Data.positionY <= collider2Data.positionY &&
        collider1Data.positionY + collider1Data.height > collider2Data.positionY) ||
      (collider1Data.positionY >= collider2Data.positionY &&
        collider1Data.positionY < collider2Data.positionY + collider2Data.height)
    ) {
      return true;
    }
    return false;
  }
}

import { InteractableObject } from "./InteractableObject";

export interface ScreenBoundaries {
  screenStartX: number;
  screenEndX: number;
  screenStartY: number;
  screenEndY: number;
}

export type CollisionAxis = "horizontal" | "vertical" | "both";
export type BoundaryCollision = "right" | "left" | "top" | "bottom" | null;

export abstract class CollisionSystem {
  abstract checkOneAgainstOne: (
    collider1: InteractableObject,
    collider2: InteractableObject,
    axis: CollisionAxis
  ) => boolean;
  abstract checkIfIsOutOfBounds: (
    interactableObject: InteractableObject,
    axis: CollisionAxis
  ) => BoundaryCollision;
}

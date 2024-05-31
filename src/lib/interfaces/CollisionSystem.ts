import { GameObject } from "./GameObject";

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
    collider1: GameObject,
    collider2: GameObject,
    axis: CollisionAxis
  ) => boolean;
  abstract checkIfIsOutOfBounds: (gameObject: GameObject, axis: CollisionAxis) => BoundaryCollision;
}

import { v4 } from "uuid";

export interface SpriteData {
  spritesheetSrc: CanvasImageSource;
  cropPositionX: number;
  cropPositionY: number;
  scaledWidth: number;
  scaledHeight: number;
}

export interface GameObjectConfig {
  positionX: number;
  positionY: number;
  velocityX: number;
  velocityY: number;
  width: number;
  height: number;
  spriteDataOrColor: string | SpriteData;
}

export abstract class GameObject {
  readonly id = v4();

  constructor(protected readonly config: GameObjectConfig) {}

  abstract getData(): GameObjectConfig;
  abstract update(): void;
}

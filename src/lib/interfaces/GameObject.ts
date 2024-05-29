export interface SpriteData {
  spritesheetSrc: CanvasImageSource;
  cropPositionX: number;
  cropPositionY: number;
  cropWidth: number;
  cropHeight: number;
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
  abstract readonly id: string;
  abstract readonly canBeDestroyed: boolean;

  abstract getData(): GameObjectConfig;
  abstract update(): void;
}

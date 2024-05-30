export interface SpriteData {
  spritesheetSrc: CanvasImageSource;
  cropPositionX: number;
  cropPositionY: number;
  cropWidth: number;
  cropHeight: number;
}

export interface GameObjectConfig {
  canBeDestroyed: boolean;
  id: string;
  positionX: number;
  positionY: number;
  velocityX: number;
  velocityY: number;
  width: number;
  height: number;
  spriteDataOrColor: string | SpriteData[];
}

export abstract class GameObject {
  abstract getData(): GameObjectConfig;
  abstract update(): void;
}

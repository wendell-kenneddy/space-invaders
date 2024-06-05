import { EngineState } from "./Engine";

export interface SpriteData {
  spritesheetSrc: CanvasImageSource;
  cropPositionX: number;
  cropPositionY: number;
  cropWidth: number;
  cropHeight: number;
}

export interface InteractableObjectConfig {
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

export abstract class InteractableObject {
  abstract getData(): InteractableObjectConfig;
  abstract update(engineState: EngineState): void;
}

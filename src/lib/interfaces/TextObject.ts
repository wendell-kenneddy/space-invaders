import { EngineState } from "./Engine";

export interface TextObjectConfig {
  id: string;
  canBeDestroyed: boolean;
  content: string;
  font: string;
  color: string;
  positionX: number;
  positionY: number;
  maxWidth: number;
}

export abstract class TextObject {
  abstract getData(): TextObjectConfig;
  abstract update(engineState: EngineState): void;
}

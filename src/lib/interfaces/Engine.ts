import { CollisionSystem } from "./CollisionSystem";
import { InputSystemState } from "./InputSystem";
import { LogicScript } from "./LogicScript";

export type GameState = "running" | "not-running" | "triggered-to-stop";

export interface EngineState {
  renderableObjects: Record<string, any>;
  stores: Record<string, any>;
  gameState: GameState;
  collisionSystem: CollisionSystem;
  inputSystemState: InputSystemState;
  requestStoresEdit: (key: string, newValue: any, toDelete: boolean) => void;
  requestGameStop: () => void;
  requestRenderableObjectAdd: (RenderableObject: any) => void;
  requestRenderableObjectDestruction: (id: string) => void;
}

export abstract class Engine {
  abstract startGameLoop(): void;
  abstract stopGameLoop(): void;
  abstract addOneRenderableObject(newRenderableObject: any): void;
  abstract addManyRenderableObjects(newRenderableObjects: any[]): void;
  abstract destroyRenderableObject(id: string): void;
  abstract addOneLogicScript(script: LogicScript): void;
  abstract addManyLogicScripts(scripts: LogicScript[]): void;
  abstract destroyLogicScript(id: any): void;
  abstract getEngineState(): EngineState;
  abstract hardReset(): void;
  abstract setOnGameEndFn: (callback: (finalEngineState: EngineState) => void | null) => void;
}

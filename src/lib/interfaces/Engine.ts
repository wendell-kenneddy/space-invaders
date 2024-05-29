import { GameObject } from "./GameObject";
import { LogicScript } from "./LogicScript";

export type GameState = "running" | "not-running" | "triggered-to-stop";

export interface EngineState {
  gameObjects: Record<string, GameObject>;
  stores: Record<string, any>;
  gameState: GameState;
  requestStoresEdit: (key: string, callback: (value: any) => void) => void;
}

export abstract class Engine {
  abstract startGameLoop(): void;
  abstract stopGameLoop(): void;
  abstract addOneGameObject(newGameObject: GameObject): void;
  abstract addManyGameObjects(newGameObjects: GameObject[]): void;
  abstract requestGameObjectDestruction(id: string): void;
  abstract addLogicScript(script: LogicScript): void;
  abstract requestLogicScriptDestruction(id: any): void;
  abstract getEngineState(): EngineState;
}

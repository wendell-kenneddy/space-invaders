import { CollisionSystem } from "./CollisionSystem";
import { GameObject } from "./GameObject";
import { InputSystemState } from "./InputSystem";
import { LogicScript } from "./LogicScript";

export type GameState = "running" | "not-running" | "triggered-to-stop";

export interface EngineState {
  gameObjects: Record<string, GameObject>;
  stores: Record<string, any>;
  gameState: GameState;
  collisionSystem: CollisionSystem;
  inputSystemState: InputSystemState;
  requestStoresEdit: (key: string, newValue: any) => void;
  requestGameStop: () => void;
  requestGameObjectAdd: (gameObject: GameObject) => void;
  requestGameObjectDestruction: (id: string) => void;
}

export abstract class Engine {
  abstract startGameLoop(): void;
  abstract stopGameLoop(): void;
  abstract addOneGameObject(newGameObject: GameObject): void;
  abstract addManyGameObjects(newGameObjects: GameObject[]): void;
  abstract destroyGameObject(id: string): void;
  abstract addLogicScript(script: LogicScript): void;
  abstract requestLogicScriptDestruction(id: any): void;
  abstract getEngineState(): EngineState;
}

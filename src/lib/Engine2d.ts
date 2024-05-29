import { Engine, GameState } from "./interfaces/Engine";
import { GameObject } from "./interfaces/GameObject";
import { LogicScript } from "./interfaces/LogicScript";
import { Renderer2d } from "./interfaces/Renderer";

export class Engine2d implements Engine {
  private gameObjects: Record<string, GameObject> = {};
  private logicScripts: Record<string, LogicScript> = {};
  private stores: Record<string, any> = {};
  private gameState: GameState = "not-running";
  private gameLoopAnimationId: number | null = null;

  constructor(private readonly renderer2d: Renderer2d) {}

  startGameLoop() {
    if (this.gameState == "running") return;
    this.gameState = "running";
    this.runGameLoop();
  }

  stopGameLoop() {}

  addOneGameObject(newGameObject: GameObject) {
    this.gameObjects[newGameObject.id] = newGameObject;
  }

  addManyGameObjects(newGameObjects: GameObject[]) {
    for (let i = 0; i < newGameObjects.length; i++) {
      this.gameObjects[newGameObjects[i].id] = newGameObjects[i];
    }
  }

  requestGameObjectDestruction(id: string): void {
    const gameObject = this.gameObjects[id];
    if (!gameObject.canBeDestroyed) throw new Error(`Game Object ${id} can't be destroyed.`);
    delete this.gameObjects[id];
  }

  addLogicScript(script: LogicScript) {
    this.logicScripts[script.id] = script;
  }

  requestLogicScriptDestruction(id: string) {
    const script = this.logicScripts[id];
    if (!script.canBeDestroyed) throw new Error(`Logic Script ${id} can't be destroyed.`);
  }

  private handleStoresEditRequest(key: string, callback: (value: any) => void) {
    callback(this.stores[key]);
  }

  private runGameLoop() {
    if (this.gameState == "triggered-to-stop") return this.stopGameLoop();

    const renderableGameObjects = Object.values(this.gameObjects);
    for (let i = 0; i < renderableGameObjects.length; i++) {
      this.renderer2d.render(renderableGameObjects[i]);
    }

    this.gameLoopAnimationId = window.requestAnimationFrame(() => this.runGameLoop());
  }

  getEngineState() {
    // TODO: deep freeze this so nothing can be edited without the engine's permission
    const engineState = {
      stores: this.stores,
      gameState: this.gameState,
      gameObjects: this.gameObjects,
      requestStoresEdit: this.handleStoresEditRequest,
    } as const;
    return engineState;
  }
}

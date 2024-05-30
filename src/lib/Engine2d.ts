import { Engine, GameState } from "./interfaces/Engine";
import { GameObject } from "./interfaces/GameObject";
import { LogicScript } from "./interfaces/LogicScript";
import { Renderer } from "./interfaces/Renderer";

export class Engine2d implements Engine {
  private gameObjects: Record<string, GameObject> = {};
  private logicScripts: Record<string, LogicScript> = {};
  private stores: Record<string, any> = {};
  private gameState: GameState = "not-running";

  constructor(private readonly renderer: Renderer) {}

  startGameLoop() {
    if (this.gameState == "running") return;
    this.gameState = "running";
    this.runGameLoop();
  }

  stopGameLoop() {}

  addOneGameObject(newGameObject: GameObject) {
    const { id } = newGameObject.getData();
    this.gameObjects[id] = newGameObject;
  }

  addManyGameObjects(newGameObjects: GameObject[]) {
    for (let i = 0; i < newGameObjects.length; i++) {
      const { id } = newGameObjects[i].getData();
      this.gameObjects[id] = newGameObjects[i];
    }
  }

  requestGameObjectDestruction(id: string): void {
    const gameObject = this.gameObjects[id];
    const { canBeDestroyed } = gameObject.getData();
    if (!canBeDestroyed) throw new Error(`Game Object ${id} can't be destroyed.`);
    delete this.gameObjects[id];
  }

  addLogicScript(script: LogicScript) {
    this.logicScripts[script.id] = script;
  }

  requestLogicScriptDestruction(id: string) {
    const script = this.logicScripts[id];
    if (!script.canBeDestroyed) throw new Error(`Logic Script ${id} can't be destroyed.`);
  }

  private requestStoresEdit(key: string, callback: (value: any) => void) {
    callback(this.stores[key]);
  }

  private runGameLoop() {
    if (this.gameState == "triggered-to-stop") return this.stopGameLoop();
    this.renderer.clearScreen();

    const renderableGameObjects = Object.values(this.gameObjects);
    for (let i = 0; i < renderableGameObjects.length; i++) {
      this.renderer.render(renderableGameObjects[i]);
    }

    window.requestAnimationFrame(() => this.runGameLoop());
  }

  getEngineState() {
    const engineState = {
      stores: { ...this.stores },
      gameState: this.gameState,
      gameObjects: { ...this.gameObjects },
      requestStoresEdit: this.requestStoresEdit,
    } as const;
    return engineState;
  }
}

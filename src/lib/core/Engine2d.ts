import { CollisionSystem } from "../interfaces/CollisionSystem";
import { Engine, GameState } from "../interfaces/Engine";
import { GameObject } from "../interfaces/GameObject";
import { InputSystem } from "../interfaces/InputSystem";
import { LogicScript } from "../interfaces/LogicScript";
import { Renderer } from "../interfaces/Renderer";

export class Engine2d implements Engine {
  private gameObjects: Record<string, GameObject> = {};
  private logicScripts: Record<string, LogicScript> = {};
  private stores: Record<string, any> = {};
  private gameState: GameState = "not-running";

  constructor(
    private readonly renderer: Renderer,
    private readonly collisionSystem: CollisionSystem,
    private readonly inputSystem: InputSystem
  ) {}

  getEngineState() {
    const engineState = {
      stores: { ...this.stores },
      gameState: this.gameState,
      gameObjects: { ...this.gameObjects },
      collisionSystem: this.collisionSystem,
      inputSystemState: this.inputSystem.getInputSystemState(),
      requestStoresEdit: (key: string, newValue: any, toDelete: boolean) =>
        this.requestStoresEdit(key, newValue, toDelete),
      requestGameStop: () => this.triggerGameStop(),
      requestGameObjectAdd: (gameObject: GameObject) => this.addOneGameObject(gameObject),
      requestGameObjectDestruction: (id: string) => this.destroyGameObject(id),
    } as const;
    return engineState;
  }

  startGameLoop() {
    if (this.gameState == "running") return;
    this.gameState = "running";
    this.inputSystem.start();
    this.runGameLoop();
  }

  stopGameLoop() {
    this.gameState = "not-running";
    this.inputSystem.stop();
  }

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

  destroyGameObject(id: string): void {
    const { canBeDestroyed } = this.gameObjects[id].getData();
    if (!canBeDestroyed) throw new Error(`Game Object ${id} can't be destroyed.`);
    delete this.gameObjects[id];
  }

  addLogicScript(script: LogicScript) {
    this.logicScripts[script.getScriptData().id] = script;
  }

  requestLogicScriptDestruction(id: string) {
    const { canBeDestroyed } = this.logicScripts[id].getScriptData();
    if (!canBeDestroyed) throw new Error(`Logic Script ${id} can't be destroyed.`);
    delete this.logicScripts[id];
  }

  private requestStoresEdit(key: string, newValue: any, toDelete: boolean) {
    if (toDelete) {
      delete this.stores[key];
      return;
    }

    this.stores[key] = newValue;
  }

  private executeLogicScripts() {
    for (const id in this.logicScripts) {
      this.logicScripts[id].execute(this.getEngineState());
    }
  }

  private renderGameObjects() {
    for (const [, object] of Object.entries(this.gameObjects)) {
      object.update(this.getEngineState());
      this.renderer.render(object);
    }
  }

  private triggerGameStop() {
    this.gameState = "triggered-to-stop";
  }

  private runGameLoop() {
    if (this.gameState == "triggered-to-stop") return this.stopGameLoop();

    this.renderer.clearScreen();
    this.executeLogicScripts();
    this.renderGameObjects();

    window.requestAnimationFrame(() => this.runGameLoop());
  }
}

import { CollisionSystem } from "@interfaces/CollisionSystem";
import { Engine, EngineState, GameState } from "@interfaces/Engine";
import { InteractableObject } from "@interfaces/InteractableObject";
import { InputSystem } from "@interfaces/InputSystem";
import { LogicScript } from "@interfaces/LogicScript";
import { Renderer } from "@interfaces/Renderer";
import { TextObject } from "@interfaces/TextObject";
import { clearRecord } from "../utils/clearObject";

export type RenderableObject = InteractableObject | TextObject;

export class Engine2d implements Engine {
  private renderableObjects: Record<string, any> = {};
  private logicScripts: Record<string, LogicScript> = {};
  private stores: Record<string, any> = {};
  private gameState: GameState = "not-running";
  private onGameEndCallback: ((finalEngineState: EngineState) => void) | null = null;

  constructor(
    private readonly renderer: Renderer,
    private readonly collisionSystem: CollisionSystem,
    private readonly inputSystem: InputSystem
  ) {}

  getEngineState() {
    const engineState = {
      stores: { ...this.stores },
      gameState: this.gameState,
      renderableObjects: { ...this.renderableObjects },
      collisionSystem: this.collisionSystem,
      inputSystemState: this.inputSystem.getInputSystemState(),
      requestStoresEdit: (key: string, newValue: any, toDelete: boolean) =>
        this.requestStoresEdit(key, newValue, toDelete),
      requestGameStop: () => this.triggerGameStop(),
      requestRenderableObjectAdd: (renderableObject: RenderableObject) =>
        this.addOneRenderableObject(renderableObject),
      requestRenderableObjectDestruction: (id: string) => this.destroyRenderableObject(id),
    } as const;
    return engineState;
  }

  hardReset(): void {
    clearRecord(this.renderableObjects);
    clearRecord(this.logicScripts);
    clearRecord(this.stores);
    this.onGameEndCallback = null;
  }

  setOnGameEndFn(callback: (finalEngineState: EngineState) => void | null): void {
    this.onGameEndCallback = callback;
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
    this.onGameEndCallback && this.onGameEndCallback(this.getEngineState());
  }

  addOneRenderableObject(newRenderableObject: RenderableObject) {
    const { id } = newRenderableObject.getData();
    this.renderableObjects[id] = newRenderableObject;
  }

  addManyRenderableObjects(newRenderableObjects: RenderableObject[]) {
    for (let i = 0; i < newRenderableObjects.length; i++) {
      const { id } = newRenderableObjects[i].getData();
      this.renderableObjects[id] = newRenderableObjects[i];
    }
  }

  destroyRenderableObject(id: string): void {
    const { canBeDestroyed } = this.renderableObjects[id].getData();
    if (!canBeDestroyed) throw new Error(`Game Object ${id} can't be destroyed.`);
    delete this.renderableObjects[id];
  }

  addOneLogicScript(script: LogicScript) {
    this.logicScripts[script.getScriptData().id] = script;
  }

  addManyLogicScripts(scripts: LogicScript[]): void {
    for (let i = 0; i < scripts.length; i++) {
      const { id } = scripts[i].getScriptData();
      this.logicScripts[id] = scripts[i];
    }
  }

  destroyLogicScript(id: string) {
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

  private renderObjects() {
    for (const [, object] of Object.entries(this.renderableObjects)) {
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
    this.renderObjects();

    window.requestAnimationFrame(() => this.runGameLoop());
  }
}

import { InputData, InputSystem, InputSystemState } from "../interfaces/InputSystem";

export class KeyboardInputSystem implements InputSystem {
  private isRunning: boolean = false;
  private inputData: InputData = {};

  start(): void {
    this.inputData = {};
    this.isRunning = true;
    this.manageEventListeners("add");
  }

  stop(): void {
    this.isRunning = false;
    this.manageEventListeners("remove");
  }

  getInputSystemState(): InputSystemState {
    return {
      isRunning: this.isRunning,
      inputData: this.inputData,
    };
  }

  private manageEventListeners(action: "add" | "remove"): void {
    if (action == "add") {
      window.addEventListener("keydown", (event) => this.handleKeyDown(event));
      window.addEventListener("keyup", (event) => this.handleKeyUp(event));
      return;
    }

    window.removeEventListener("keydown", (event) => this.handleKeyDown(event));
    window.removeEventListener("keyup", (event) => this.handleKeyUp(event));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    this.inputData[event.key] = true;
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.inputData[event.key] = false;
  }
}

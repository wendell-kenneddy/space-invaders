export type InputData = Record<string, any>;

export interface InputSystemState {
  isRunning: boolean;
  inputData: InputData;
}

export abstract class InputSystem {
  abstract start(): void;
  abstract stop(): void;
  abstract getInputSystemState(): InputSystemState;
}

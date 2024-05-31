import { EngineState } from "./Engine";

export interface LogicScriptData {
  id: string;
  canBeDestroyed: boolean;
  hasBeenExecuted: boolean;
}

export abstract class LogicScript {
  abstract execute(engineState: EngineState): void;
  abstract getScriptData(): LogicScriptData;
}

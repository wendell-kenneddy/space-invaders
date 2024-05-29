import { EngineState } from "./Engine";

export abstract class LogicScript {
  abstract readonly id: string;
  abstract readonly canBeDestroyed: boolean;

  abstract execute(engineState: EngineState): void;
}

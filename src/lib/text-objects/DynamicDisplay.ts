import { EngineState } from "@interfaces/Engine";
import { TextObject, TextObjectConfig } from "@interfaces/TextObject";
import { v4 } from "uuid";

export interface DynamicDisplayConfig extends TextObjectConfig {
  key: string;
  defaultValue: any;
}

export class DynamicDisplay implements TextObject {
  private readonly id: string = v4();

  constructor(
    private readonly canBeDestroyed: boolean,
    private readonly config: Omit<DynamicDisplayConfig, "id" | "canBeDestroyed">
  ) {}

  getData(): DynamicDisplayConfig {
    return {
      id: this.id,
      canBeDestroyed: this.canBeDestroyed,
      ...this.config,
    };
  }

  update({ stores }: EngineState): void {
    const value = stores[this.config.key] ?? this.config.defaultValue;
    this.config.content = `${this.config.key}: ${value}`;
  }
}

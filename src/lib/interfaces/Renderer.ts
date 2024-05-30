import { GameObject } from "./GameObject";

export abstract class Renderer {
  abstract render(gameObject: GameObject): void;
  abstract clearScreen(): void;
}

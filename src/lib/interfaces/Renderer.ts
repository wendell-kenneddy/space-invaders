import { RenderableObject } from "@core/Engine2d";

export abstract class Renderer {
  abstract render(renderableObject: RenderableObject): void;
  abstract clearScreen(): void;
}

import { GameObject, GameObjectConfig, SpriteData } from "./interfaces/GameObject";
import { Renderer } from "./interfaces/Renderer";

type RenderableRectData = Omit<
  GameObjectConfig,
  "velocityX" | "velocityY" | "spriteDataOrColor"
> & { color: string };

type RenderableSpriteData = Omit<
  GameObjectConfig,
  "velocityX" | "velocityY" | "spriteDataOrColor"
> &
  SpriteData;

export class Renderer2d extends Renderer {
  constructor(private readonly canvasContext2d: CanvasRenderingContext2D) {
    super();
  }

  render(gameObject: GameObject) {
    const { width, height, positionX, positionY, spriteDataOrColor } = gameObject.getData();
    const base = { width, height, positionX, positionY };

    if (typeof spriteDataOrColor != "string") {
      this.renderSprite({ ...base, ...spriteDataOrColor });
      return;
    }

    this.renderRect({ ...base, color: spriteDataOrColor });
  }

  private renderRect({ width, height, positionX, positionY, color }: RenderableRectData): void {
    this.canvasContext2d.fillStyle = color;
    this.canvasContext2d.fillRect(positionX, positionY, width, height);
  }

  private renderSprite({
    cropPositionX,
    cropPositionY,
    height,
    width,
    positionX,
    positionY,
    spritesheetSrc,
    cropWidth,
    cropHeight,
  }: RenderableSpriteData): void {
    this.canvasContext2d.drawImage(
      spritesheetSrc,
      cropPositionX,
      cropPositionY,
      cropWidth,
      cropHeight,
      positionX,
      positionY,
      width,
      height
    );
  }
}

import { GameObject, GameObjectConfig, SpriteData } from "./GameObject";

type RenderableRectData = Omit<GameObjectConfig, "velocityX" | "velocityY">;

type RenderableSpriteData = Omit<
  GameObjectConfig,
  "velocityX" | "velocityY" | "spriteDataOrColor"
> &
  SpriteData;

export class Renderer {
  constructor(private readonly canvasContext2d: CanvasRenderingContext2D) {}

  render(gameObject: GameObject) {
    const { width, height, positionX, positionY, spriteDataOrColor } =
      gameObject.getData();
    const base = { width, height, positionX, positionY };

    if (typeof spriteDataOrColor != "string") {
      this.renderSprite({ ...base, ...spriteDataOrColor });
      return;
    }

    this.renderRect({ ...base, spriteDataOrColor });
  }

  private renderRect({
    width,
    height,
    positionX,
    positionY,
    spriteDataOrColor,
  }: RenderableRectData): void {
    this.canvasContext2d.fillStyle = spriteDataOrColor as string;
    this.canvasContext2d.fillRect(positionX, positionY, width, height);
  }

  private renderSprite({
    cropPositionX,
    cropPositionY,
    height,
    width,
    positionX,
    positionY,
    scaledHeight,
    scaledWidth,
    spritesheetSrc,
  }: RenderableSpriteData): void {
    this.canvasContext2d.drawImage(
      spritesheetSrc,
      cropPositionX,
      cropPositionY,
      width,
      height,
      positionX,
      positionY,
      scaledWidth,
      scaledHeight
    );
  }
}

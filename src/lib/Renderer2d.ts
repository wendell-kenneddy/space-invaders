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

export class Renderer2d implements Renderer {
  private currentSpriteIndex: number = 0;
  private frameCount: number = 0;

  constructor(
    private readonly canvasContext2d: CanvasRenderingContext2D,
    private readonly spritesPerAnimation: number,
    private readonly animationFrameInterval: number
  ) {}

  render(gameObject: GameObject) {
    const { width, height, positionX, positionY, spriteDataOrColor, canBeDestroyed, id } =
      gameObject.getData();
    const base = { width, height, positionX, positionY, canBeDestroyed, id };

    this.changeFrameData();

    if (spriteDataOrColor instanceof Array) {
      const spriteData =
        spriteDataOrColor.length > 1
          ? spriteDataOrColor[this.currentSpriteIndex]
          : spriteDataOrColor[0];

      this.renderSprite({ ...base, ...spriteData });
      return;
    }

    this.renderRect({ ...base, color: spriteDataOrColor as string });
  }

  clearScreen() {
    const width = this.canvasContext2d.canvas.width;
    const height = this.canvasContext2d.canvas.height;
    this.canvasContext2d.clearRect(0, 0, width, height);
  }

  private changeFrameData() {
    if (this.frameCount >= this.animationFrameInterval) {
      if (this.currentSpriteIndex == this.spritesPerAnimation - 1) {
        this.currentSpriteIndex = 0;
      } else {
        this.currentSpriteIndex++;
      }

      this.frameCount = 0;
      return;
    }

    this.frameCount++;
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

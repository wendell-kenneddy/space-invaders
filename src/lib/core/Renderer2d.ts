import { GameObject, GameObjectConfig, SpriteData } from "@interfaces/GameObject";
import { Renderer } from "@interfaces/Renderer";

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
  private lastSpriteChange: number | null = null;

  constructor(
    private readonly canvasContext2d: CanvasRenderingContext2D,
    private readonly spritesPerAnimation: number,
    private readonly animationInterval: number
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
    const now = performance.now();

    if (!this.lastSpriteChange) {
      if (this.currentSpriteIndex == this.spritesPerAnimation - 1) {
        this.currentSpriteIndex = 0;
      } else {
        this.currentSpriteIndex++;
      }

      this.lastSpriteChange = now;
      return;
    }

    const delta = now - this.lastSpriteChange;

    if (delta >= this.animationInterval) {
      if (this.currentSpriteIndex == this.spritesPerAnimation - 1) {
        this.currentSpriteIndex = 0;
      } else {
        this.currentSpriteIndex++;
      }

      this.lastSpriteChange = now;
      return;
    }
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

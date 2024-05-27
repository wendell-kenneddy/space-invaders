import "./styles/style.css";

const canvas = document.getElementById("game-screen") as HTMLCanvasElement;
const canvasContext2d = canvas.getContext("2d") as CanvasRenderingContext2D;
const spritesheet = new Image(111, 128);

spritesheet.src = "/spritesheet-scaled.png";

spritesheet.addEventListener("load", () => {
  for (let i = 0; i < 4; i++) {
    const spriteSpacing = 10;
    const spriteWidth = 80;
    const spriteHeight = 80;
    const finalSize = 64;

    canvasContext2d.drawImage(
      spritesheet,
      i * (spriteSpacing + spriteWidth),
      0,
      spriteWidth,
      spriteHeight,
      i * (spriteSpacing + spriteWidth),
      0,
      finalSize,
      finalSize
    );

    canvasContext2d.drawImage(
      spritesheet,
      i * (spriteSpacing + spriteWidth),
      spriteSpacing + spriteHeight,
      spriteWidth,
      spriteHeight,
      i * (spriteSpacing + spriteWidth),
      90,
      finalSize,
      finalSize
    );

    canvasContext2d.drawImage(
      spritesheet,
      0,
      180,
      160,
      80,
      270,
      90,
      120,
      finalSize
    );
  }
});

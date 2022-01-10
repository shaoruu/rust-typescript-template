import { Universe } from "../pkg";

import { init } from "./wasm";

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

export class GameOfLife {
  universe!: Universe;
  memory!: WebAssembly.Memory;
  animationId = null as any;

  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;

  paused = true;

  public async initialize(): Promise<void> {
    const { memory } = await init();
    this.memory = memory;

    // Construct the universe, and get its width and height.
    this.universe = Universe.new();
    this.createCanvas();

    this.drawGrid();
    this.drawCells();
  }

  public resume = () => {
    this.animationId = requestAnimationFrame(this.renderLoop);
    this.paused = false;
  };

  public pause = () => {
    cancelAnimationFrame(this.animationId);
    this.animationId = null;
    this.paused = true;
  };

  private createCanvas = () => {
    this.canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
    this.canvas.height = (CELL_SIZE + 1) * this.height + 1;
    this.canvas.width = (CELL_SIZE + 1) * this.width + 1;

    if (!this.canvas) {
      this.canvas = document.createElement("canvas");
      this.canvas.id = "game-canvas";
      document.body.appendChild(this.canvas);
    }

    this.canvas.addEventListener("click", (event) => {
      const boundingRect = this.canvas.getBoundingClientRect();

      const scaleX = this.canvas.width / boundingRect.width;
      const scaleY = this.canvas.height / boundingRect.height;

      const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
      const canvasTop = (event.clientY - boundingRect.top) * scaleY;

      const row = Math.min(
        Math.floor(canvasTop / (CELL_SIZE + 1)),
        this.height - 1
      );
      const col = Math.min(
        Math.floor(canvasLeft / (CELL_SIZE + 1)),
        this.width - 1
      );

      this.universe.toggleCell(row, col);

      this.drawCells();
    });

    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  };

  private drawGrid = () => {
    this.ctx.beginPath();
    this.ctx.strokeStyle = GRID_COLOR;

    // Vertical lines.
    for (let i = 0; i <= this.width; i++) {
      this.ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
      this.ctx.lineTo(
        i * (CELL_SIZE + 1) + 1,
        (CELL_SIZE + 1) * this.height + 1
      );
    }

    // Horizontal lines.
    for (let j = 0; j <= this.height; j++) {
      this.ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
      this.ctx.lineTo(
        (CELL_SIZE + 1) * this.width + 1,
        j * (CELL_SIZE + 1) + 1
      );
    }

    this.ctx.stroke();
  };

  private drawCells = () => {
    const cellsPtr = this.universe.cells();
    const cells = new Uint8Array(
      this.memory.buffer,
      cellsPtr,
      (this.width * this.height) / 8
    );

    this.ctx.beginPath();

    // Alive cells.
    this.ctx.fillStyle = ALIVE_COLOR;
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const idx = this.getIndex(row, col);
        if (!this.bitIsSet(idx, cells)) {
          continue;
        }

        this.ctx.fillRect(
          col * (CELL_SIZE + 1) + 1,
          row * (CELL_SIZE + 1) + 1,
          CELL_SIZE,
          CELL_SIZE
        );
      }
    }

    // Dead cells.
    this.ctx.fillStyle = DEAD_COLOR;
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const idx = this.getIndex(row, col);
        if (this.bitIsSet(idx, cells)) {
          continue;
        }

        this.ctx.fillRect(
          col * (CELL_SIZE + 1) + 1,
          row * (CELL_SIZE + 1) + 1,
          CELL_SIZE,
          CELL_SIZE
        );
      }
    }

    this.ctx.stroke();
  };

  private renderLoop = () => {
    this.universe.tick();
    this.drawCells();
    this.animationId = requestAnimationFrame(this.renderLoop);
  };

  private getIndex = (row: number, column: number) => {
    return row * this.width + column;
  };

  private bitIsSet = (n: number, arr: Uint8Array) => {
    const byte = Math.floor(n / 8);
    const mask = 1 << n % 8;
    return (arr[byte] & mask) === mask;
  };

  private get width() {
    return this.universe.width();
  }

  private get height() {
    return this.universe.height();
  }
}

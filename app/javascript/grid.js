export const COLOURS = ['red', 'green', 'blue', 'yellow'];
const MAX_X = 10;
const MAX_Y = 10;

export class Block {
  constructor(x, y, colour = Math.floor(Math.random() * COLOURS.length)) {
    this.x = x;
    this.y = y;
    this.colour = COLOURS[colour];
  }
}

export class BlockGrid {
  constructor(grid = null, maxX = MAX_X, maxY = MAX_Y) {
    this.grid = [];
    this.maxX = maxX;
    this.maxY = maxY;

    if (grid) {
      this.grid = grid;
      return this;
    }

    for (let x = 0; x < this.maxX; x++) {
      let col = [];
      for (let y = 0; y < this.maxY; y++) {
        col.push(new Block(x, y));
      }

      this.grid.push(col);
    }

    return this;
  }

  render(el = document.querySelector('#gridEl')) {
    for (let x = 0; x < this.maxX; x++) {
      let id = 'col_' + x;
      let colEl = document.createElement('div');
      colEl.className = 'col';
      colEl.id = id;
      el.appendChild(colEl);

      for (let y = this.maxY - 1; y >= 0; y--) {
        let block = this.grid[x][y],
          id = `block_${x}x${y}`,
          blockEl = document.createElement('div');

        blockEl.id = id;
        blockEl.className = 'block';
        blockEl.style.background = block.colour;
        blockEl.addEventListener('click', evt => this.blockClicked(evt, block));
        colEl.appendChild(blockEl);
      }
    }

    return this;
  }

  removeConnection(x, y, colour) {
    const blocks = [];

    if (!this.grid[x][y]) {
      return;
    }

    blocks.push(this.grid[x][y])

    this.grid[x][y] = null;

    if (x < this.maxX - 1 && this.grid[x + 1][y] && this.grid[x + 1][y].colour === colour) {
      blocks.push(...this.removeConnection(x + 1, y, colour));
    }
    if (x > 0 && this.grid[x - 1][y] && this.grid[x - 1][y].colour === colour) {
      blocks.push(...this.removeConnection(x - 1, y, colour));
    }
    if (y < this.maxY - 1 && this.grid[x][y + 1] && this.grid[x][y + 1].colour === colour) {
      blocks.push(...this.removeConnection(x, y + 1, colour));
    }
    if (y > 0 && this.grid[x][y - 1] && this.grid[x][y - 1].colour === colour) {
      blocks.push(...this.removeConnection(x, y - 1, colour));
    }

    return blocks;
  }

  removeConnections(block) {
    const { x, y, colour } = block;
    const blocks = this.removeConnection(x, y, colour);

    if (blocks.length > 1) {
      return blocks;
    } else {
      this.grid[x][y] = block;
    }
    return [];
  }

  removeInGrid(block) {
    const blocks = this.removeConnections(block);

    blocks.forEach(block => {
      const blockEl = document.getElementById(`block_${block.x}x${block.y}`);
      blockEl.parentNode.removeChild(blockEl);
    });
    this.move();
  }

  move() {
    this.grid = this.grid.map((col, index) => {
      const blocks = col.filter(block => !!block);
      const padding = new Array(this.maxX - blocks.length).fill(null);
      return [...blocks, ...padding].map((b, index) => {
        if (b) {
          document.getElementById(`block_${b.x}x${b.y}`).id = `block_${b.x}x${index}`;
          b.y = index;
        }
        return b;
      });
    });
  }

  blockClicked(e, block) {
    this.removeInGrid(block);
  }
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid().render());

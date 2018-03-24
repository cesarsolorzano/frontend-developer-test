import { Block, BlockGrid, COLOURS } from './grid';
import { assert } from 'chai';

describe('Block', () => {
  it('should be created with correct coordinates and one of the valid colours', () => {
    let testCoords = [[1, 2], [4, 9], [0, 0]];

    testCoords.forEach(testCoord => {
      let block = new Block(...testCoord);
      assert.equal(block.x, testCoord[0], 'x is set correctly');
      assert.equal(block.y, testCoord[1], 'y is set correctly');
      assert.ok(COLOURS.indexOf(block.colour) > -1, 'colour is valid');
    });
  });
});

describe('BlockGrid', () => {
  it('should return grid', () => {
    let testCoords = [
      [new Block(0, 0, 0), new Block(0, 1, 1), new Block(0, 1, 2)]
    ];
    const blockGrid = new BlockGrid(testCoords, 1, 3);
    assert.deepEqual(blockGrid.grid, testCoords);
  });

  it('should return the blocks to be removed', () => {
    let testCoords = [
      [new Block(0, 0, 0), new Block(0, 1, 1), new Block(0, 1, 1)]
    ];
    const blockGrid = new BlockGrid(testCoords, 1, 3);
    assert.deepEqual(blockGrid.removeConnections(testCoords[0][0]), []);

    assert.deepEqual(blockGrid.removeConnections(testCoords[0][1]), [new Block(0, 1, 1), new Block(0, 1, 1)]);
  });

  it('should remove all blocks from center', () => {
    const testCoords = [
      [new Block(0, 0, 1), new Block(0, 1, 1), new Block(0, 2, 1)],
      [new Block(1, 0, 1), new Block(1, 1, 1), new Block(1, 2, 1)],
      [new Block(2, 0, 1), new Block(2, 1, 1), new Block(2, 2, 1)],
    ];

    const blockGrid = new BlockGrid(testCoords, 3, 3);
    blockGrid.removeConnections(testCoords[1][1]);

    assert.deepEqual(blockGrid.grid, [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
  });

  it('should remove all blocks from right bottom', () => {
    const testCoords = [
      [new Block(0, 0, 1), new Block(0, 1, 1), new Block(0, 2, 1)],
      [new Block(1, 0, 1), new Block(1, 1, 1), new Block(1, 2, 1)],
      [new Block(2, 0, 1), new Block(2, 1, 1), new Block(2, 2, 1)],
    ];

    const blockGrid = new BlockGrid(testCoords, 3, 3);
    blockGrid.removeConnections(testCoords[2][2]);

    assert.deepEqual(blockGrid.grid, [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
  });

  it('should remove all blocks from left top', () => {
    const testCoords = [
      [new Block(0, 0, 1), new Block(0, 1, 1), new Block(0, 2, 0)],
      [new Block(1, 0, 0), new Block(1, 1, 1), new Block(1, 2, 0)],
      [new Block(2, 0, 0), new Block(2, 1, 1), new Block(2, 2, 1)],
    ];

    const blockGrid = new BlockGrid(testCoords, 3, 3);
    blockGrid.removeConnections(testCoords[2][2]);

    assert.deepEqual(blockGrid.grid, [
      [null, null, new Block(0, 2, 0)],
      [new Block(1, 0, 0), null, new Block(1, 2, 0)],
      [new Block(2, 0, 0), null, null],
    ]);
  });

  it('should remove connected blocks', () => {
    const testCoords = [
      [new Block(0, 0, 0), new Block(0, 1, 1), new Block(0, 2, 0)],
      [new Block(1, 0, 1), new Block(1, 1, 1), new Block(1, 2, 0)],
      [new Block(2, 0, 0), new Block(2, 1, 1), new Block(2, 2, 1)],
    ];

    const blockGrid = new BlockGrid(testCoords, 3, 3);
    blockGrid.removeConnections(testCoords[1][0]);

    assert.deepEqual(blockGrid.grid, [
      [new Block(0, 0, 0), null, new Block(0, 2, 0)],
      [null, null, new Block(1, 2, 0)],
      [new Block(2, 0, 0), null, null],
    ]);
  });

  it('shouldn\'t remove any blocks', () => {
    const testCoords = [
      [new Block(0, 0, 0), new Block(0, 1, 1), new Block(0, 2, 2)],
      [new Block(1, 0, 2), new Block(1, 1, 0), new Block(1, 2, 1)],
      [new Block(2, 0, 1), new Block(2, 1, 2), new Block(2, 2, 0)],
    ];

    const blockGrid = new BlockGrid(testCoords, 3, 3);
    blockGrid.removeConnections(testCoords[0][0]);

    assert.deepEqual(blockGrid.grid, testCoords);
  });

  it('should render and remove connected blocks', () => {
    const testCoords = [
      [new Block(0, 0, 1), new Block(0, 1, 1), new Block(0, 2, 2)],
      [new Block(1, 0, 1), new Block(1, 1, 2), new Block(1, 2, 0)],
      [new Block(2, 0, 0), new Block(2, 1, 0), new Block(2, 2, 1)],
    ];

    const gridEl = document.createElement('div');
    gridEl.id = 'gridEl';
    document.body.appendChild(gridEl);

    const blockGrid = new BlockGrid(testCoords, 3, 3);
    blockGrid.render();
  
    blockGrid.removeInGrid(blockGrid.grid[0][0]);
    assert.deepEqual(blockGrid.grid, [
      [new Block(0, 0, 2), null, null],
      [new Block(1, 0, 2), new Block(1, 1, 0), null],
      [new Block(2, 0, 0), new Block(2, 1, 0), new Block(2, 2, 1)],
    ]);

    blockGrid.removeInGrid(blockGrid.grid[0][0]);
    assert.deepEqual(blockGrid.grid, [
      [null, null, null],
      [new Block(1, 0, 0), null, null],
      [new Block(2, 0, 0), new Block(2, 1, 0), new Block(2, 2, 1)],
    ]);

    blockGrid.removeInGrid(blockGrid.grid[1][0]);
    assert.deepEqual(blockGrid.grid, [
      [null, null, null],
      [null, null, null],
      [new Block(2, 0, 1), null, null],
    ]);

    blockGrid.removeInGrid(blockGrid.grid[2][0]);
    assert.deepEqual(blockGrid.grid, [
      [null, null, null],
      [null, null, null],
      [new Block(2, 0, 1), null, null],
    ]); 
  });
});

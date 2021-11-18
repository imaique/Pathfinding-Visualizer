import { NodeStates } from '../components/grid/NodeStates';
const createEmptyBoard = (width, height) => {
  let grid = new Array(height);
  for (let i = 0; i < height; i++) {
    let row = new Array(width);
    for (let j = 0; j < width; j++) {
      row[j] = { nodeState: NodeStates.unvisited, weight: 1 };
    }
    grid[i] = row;
  }

  return grid;
};

export default createEmptyBoard;

import { NodeStates } from '../components/grid/NodeStates';

export const isValid = (x, y, grid, visited) => {
  return (
    x >= 0 &&
    x < grid[0].length &&
    y >= 0 &&
    y < grid.length &&
    !visited.has(`${y}_${x}`) &&
    grid[y][x].nodeState !== NodeStates.wall
  );
};

export const getNeighborIncrements = (isDiagonalNeighbors) => {
  let neighbors = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      // if diagonal neighbors are not allowed and the current is diagonal, skip
      if (!isDiagonalNeighbors && i !== 0 && j !== 0) continue;

      // you can't be your own neighbor
      if (i === 0 && j === 0) continue;

      neighbors.push({ x: j, y: i });
    }
  }
  return neighbors;
};

export const getPath = (lastNode) => {
  let path = [];
  while ('prev' in lastNode) {
    path.push({ x: lastNode.x, y: lastNode.y });
    lastNode = lastNode.prev;
  }
  return path.reverse();
};

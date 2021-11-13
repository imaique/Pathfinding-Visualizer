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

export const getPath = (lastNode) => {
  let path = [];
  while ('prev' in lastNode) {
    path.push({ x: lastNode.x, y: lastNode.y });
    lastNode = lastNode.prev;
  }
  return path.reverse();
};

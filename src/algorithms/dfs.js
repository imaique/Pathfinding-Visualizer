import Stack from '../data_structures/Stack';
import { getPath, isValid, getNeighborIncrements } from './shared';

export const dfs = (start, end, grid, isDiagonalNeighbors) => {
  const neighbors = getNeighborIncrements(isDiagonalNeighbors);

  const stack = new Stack();
  const visitedOrder = [];
  const visited = new Set();

  stack.push(start);
  visited.add(`${start.y}_${start.x}`);

  while (!stack.isEmpty()) {
    const current = stack.pop();

    for (let increments of neighbors) {
      const neighbor = {
        x: current.x + increments.x,
        y: current.y + increments.y,
      };
      if (isValid(neighbor.x, neighbor.y, grid, visited)) {
        if (neighbor.x === end.x && neighbor.y === end.y) {
          let path = getPath(current);
          return [visitedOrder, path];
        }
        neighbor.prev = current;
        stack.push(neighbor);
        visitedOrder.push(neighbor);
        visited.add(`${neighbor.y}_${neighbor.x}`);
      }
    }
  }
  return [visitedOrder, []];
};

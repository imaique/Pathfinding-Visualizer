import { getPath, isValid, getNeighborIncrements } from './shared';
import PriorityQueue from '../data_structures/PriorityQueue';

export const djikstra = (start, end, grid, isDiagonalNeighbors) => {
  const neighbors = getNeighborIncrements(isDiagonalNeighbors);
  const queue = new PriorityQueue();
  const visitedOrder = [];
  const visited = new Set();
  start.cost = 0;
  queue.push(start, 0);
  visited.add(`${start.y}_${start.x}`);

  while (!(queue.size === 0)) {
    const current = queue.pop();
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
        neighbor.cost = current.cost + grid[neighbor.y][neighbor.x].weight;
        // if diagonal, increase the cost by 1 to prevent weird paths;
        if (
          Math.abs(neighbor.x - current.x) + Math.abs(neighbor.y - current.y) >
          1
        )
          neighbor.cost++;

        queue.push(neighbor, neighbor.cost);
        visitedOrder.push(neighbor);
        visited.add(`${neighbor.y}_${neighbor.x}`);
      }
    }
  }
  return [visitedOrder, []];
};

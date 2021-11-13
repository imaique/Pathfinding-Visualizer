import Queue from '../data_structures/Queue';
import { getPath, isValid } from './shared';

export const bfs = (start, end, grid, isDiagonalNeighbors) => {
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

  const queue = new Queue();
  const visitedOrder = [];
  const visited = new Set();

  queue.enqueue(start);
  visited.add(`${start.y}_${start.x}`);

  while (!queue.isEmpty()) {
    const current = queue.dequeue();

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
        queue.enqueue(neighbor);
        visitedOrder.push(neighbor);
        visited.add(`${neighbor.y}_${neighbor.x}`);
      }
    }
  }
  return [visitedOrder, []];
};

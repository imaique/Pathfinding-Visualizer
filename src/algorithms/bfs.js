import Queue from '../data_structures/Queue';
import { NodeStates } from '../components/grid/NodeStates';

const isValid = (x, y, grid, visited) => {
  return (
    x >= 0 &&
    x < grid[0].length &&
    y >= 0 &&
    y < grid.length &&
    !visited.has(`${x}_${y}`) &&
    grid[y][x].nodeState !== NodeStates.wall
  );
};

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
  queue.enqueue(start);
  const visitedOrder = [];
  const visited = new Set();
  visited.add(`${start.x}_${start.y}`);
  console.log('calls?');
  while (!queue.isEmpty()) {
    const current = queue.dequeue();

    for (let increments of neighbors) {
      const neighbor = {
        x: current.x + increments.x,
        y: current.y + increments.y,
      };
      if (isValid(neighbor.x, neighbor.y, grid, visited)) {
        if (neighbor.x === end.x && neighbor.y === end.y) {
          console.log('yo!!!!');
          return [visitedOrder, []];
        }
        queue.enqueue(neighbor);
        visitedOrder.push(neighbor);
        visited.add(`${neighbor.x}_${neighbor.y}`);
      }
    }
  }
  return [visitedOrder, []];
};

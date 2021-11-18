import { useState } from 'react';
import { astar } from '../../algorithms/astar';
import { bfs } from '../../algorithms/bfs';
import { dfs } from '../../algorithms/dfs';
import { djikstra } from '../../algorithms/dijkstra';
import { greedy } from '../../algorithms/greedy';
import './PathfinderAlgorithms.css';
const algorithms = [
  { name: 'A* Algorithm', algorithm: astar },
  { name: "Dijkstra's algorithm", algorithm: djikstra },
  { name: 'Greedy Best-First Search', algorithm: greedy },
  { name: 'Breadth First Search', algorithm: bfs },
  { name: 'Depth First Search', algorithm: dfs },
];
const PathfinderAlgorithms = () => {
  const [currentPathfindingAlgorithm, setPathfindingAlgorithm] = useState(
    algorithms[0]
  );
  return (
    <div className="path-select">
      <div className="select-title">Pathfinding Algorithms</div>
      <div className="path-choices">
        {algorithms.map((algo) => (
          <div
            key={algo.name}
            className={
              'algorithm-choice' +
              (algo === currentPathfindingAlgorithm ? ' selected' : '')
            }
            onClick={() => setPathfindingAlgorithm(algo)}
          >
            {algo.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PathfinderAlgorithms;

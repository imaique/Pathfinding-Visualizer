import './PathFinderBoard.css';
import React, { useEffect, useState } from 'react';
import { bfs } from '../../algorithms/bfs';
import { NodeStates } from './NodeStates';
import { BoardNode } from './BoardNode';

const PathFinderBoard = () => {
  const createBoardNodeGrid = (width, height) => {
    console.log('createnewone');
    let grid = new Array(height);
    for (let i = 0; i < height; i++) {
      let row = new Array(width);
      for (let j = 0; j < width; j++) {
        row[j] = new BoardNode(j, i);
      }
      grid[i] = row;
    }
    const middleRow = ~~(height / 2);
    const startCol = ~~(width / 4);
    const endCol = width - ~~(width / 4);
    grid[middleRow][startCol].nodeState = NodeStates.start;
    grid[middleRow][endCol].nodeState = NodeStates.end;
    BoardNode.startNode = grid[middleRow][startCol];
    BoardNode.endNode = grid[middleRow][endCol];

    return grid;
  };

  window.addEventListener('mouseup', () => {
    BoardNode.draggedState = null;
    BoardNode.revertPreviousNode = null;
  });
  const width = 60;
  const height = 30;

  const grid = createBoardNodeGrid(width, height);
  console.log(grid);

  const [currentGrid, setGrid] = useState(grid);
  const [isVisualized, setIsVisualized] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [visitedNodes, setVisitedNodes] = useState([]);

  const visualize = async function () {
    if (isAnimating) return;
    if (isVisualized) cleanUpVisitedNodes(visitedNodes);
    setIsVisualized(true);
    setIsAnimating(true);
    const start = { x: BoardNode.startNode.x, y: BoardNode.startNode.y };
    const end = { x: BoardNode.endNode.x, y: BoardNode.endNode.y };
    const [visitedOrder, takenPath] = bfs(start, end, currentGrid, false);
    setVisitedNodes(visitedOrder);
    if (visitedOrder.length === 0) return;

    let index = 0;
    const interval = setInterval(async () => {
      const x = visitedOrder[index].x;
      const y = visitedOrder[index].y;
      index++;
      const nodeState = currentGrid[y][x].nodeState;
      if (nodeState !== NodeStates.end && nodeState !== NodeStates.start)
        currentGrid[y][x].setState(NodeStates.visited);
      if (index === visitedOrder.length) {
        clearInterval(interval);
        await visualizePath(takenPath);
        setIsAnimating(false);
      }
    }, 0.5);
  };

  const cleanUpVisitedNodes = (visitedNodes) => {
    for (let node of visitedNodes) {
      const x = node.x;
      const y = node.y;
      const nodeState = currentGrid[y][x].nodeState;
      if (nodeState === NodeStates.path || nodeState === NodeStates.visited)
        currentGrid[node.y][node.x].setState(NodeStates.unvisited);
    }
  };

  const visualizePath = function (takenPath) {
    return new Promise((resolve) => {
      if (takenPath.length === 0) resolve();
      let index = 0;
      const pathInterval = setInterval(() => {
        const x = takenPath[index].x;
        const y = takenPath[index].y;
        index++;
        const nodeState = currentGrid[y][x].nodeState;
        if (nodeState !== NodeStates.end && nodeState !== NodeStates.start)
          currentGrid[y][x].setState(NodeStates.path);
        if (index === takenPath.length) {
          clearInterval(pathInterval);
          resolve();
        }
      }, 20);
    });
  };

  shouldComponentUpdate(() => {
    return false;
  });
  useEffect(() => {
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const currentNode = currentGrid[i][j];
        currentNode.NodeDOM = document.getElementById(
          `${currentNode.y}_${currentNode.x}`
        );
      }
    }
  });

  return (
    <React.Fragment>
      <button type="button" onClick={visualize} title="Visualize">
        Visualize!
      </button>
      <table className="board">
        <tbody onContextMenu={(e) => e.preventDefault()}>
          {currentGrid.map((row) => (
            <tr className="row">
              {row.map((node) => (
                <td
                  className={'node ' + node.nodeState}
                  id={`${node.y}_${node.x}`}
                  onMouseDown={node.click}
                  onMouseOver={node.mouseOver}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

export default PathFinderBoard;

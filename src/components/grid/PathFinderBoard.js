import './PathFinderBoard.css';
import React, { useEffect, useState, useRef } from 'react';
import { bfs } from '../../algorithms/bfs';
import { NodeStates } from './NodeStates';
import { BoardNode } from './BoardNode';

const PathFinderBoard = () => {
  const createBoardNodeGrid = (width, height) => {
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

  const currentGrid = useRef(grid);
  const isVisualized = useRef(false);
  const isAnimating = useRef(false);
  const visitedNodes = useRef([]);

  const visualize = async function () {
    if (isAnimating.current) return;
    if (isVisualized.current) cleanUpVisitedNodes(visitedNodes.current);
    isVisualized.current = true;
    isAnimating.current = true;
    const start = { x: BoardNode.startNode.x, y: BoardNode.startNode.y };
    const end = { x: BoardNode.endNode.x, y: BoardNode.endNode.y };
    const [visitedOrder, takenPath] = bfs(
      start,
      end,
      currentGrid.current,
      false
    );
    visitedNodes.current = visitedOrder;
    if (visitedOrder.length === 0) return;

    let index = 0;
    const interval = setInterval(async () => {
      const x = visitedOrder[index].x;
      const y = visitedOrder[index].y;
      index++;
      const nodeState = currentGrid.current[y][x].nodeState;
      if (nodeState !== NodeStates.end && nodeState !== NodeStates.start)
        currentGrid.current[y][x].setState(NodeStates.visited);
      if (index === visitedOrder.length) {
        clearInterval(interval);
        await visualizePath(takenPath);
        isAnimating.current = false;
      }
    }, 0.5);
  };

  const cleanUpVisitedNodes = (visitedNodes) => {
    for (let node of visitedNodes) {
      const x = node.x;
      const y = node.y;
      const nodeState = currentGrid.current[y][x].nodeState;
      if (nodeState === NodeStates.path || nodeState === NodeStates.visited)
        currentGrid.current[node.y][node.x].setState(NodeStates.unvisited);
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
        const nodeState = currentGrid.current[y][x].nodeState;
        if (nodeState !== NodeStates.end && nodeState !== NodeStates.start)
          currentGrid.current[y][x].setState(NodeStates.path);
        if (index === takenPath.length) {
          clearInterval(pathInterval);
          resolve();
        }
      }, 20);
    });
  };

  useEffect(() => {
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const currentNode = currentGrid.current[i][j];
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
          {currentGrid.current.map((row) => (
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

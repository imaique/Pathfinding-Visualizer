import './PathFinderBoard.css';
import React, { useEffect, useState } from 'react';
import { bfs } from '../../algorithms/bfs';
import { NodeStates } from './NodeStates';
import { BoardNode } from './BoardNode';

const PathFinderBoard = (props) => {
  window.addEventListener('mouseup', () => {
    BoardNode.draggedState = null;
    BoardNode.revertPreviousNode = null;
  });
  const width = 60;
  const height = 30;

  let grid = new Array(height);
  for (let i = 0; i < height; i++) {
    let row = new Array(width);
    for (let j = 0; j < width; j++) {
      row[j] = new BoardNode(j, i);
    }
    grid[i] = row;
  }
  grid[~~(height / 2)][~~(width / 4)].nodeState = NodeStates.start;
  grid[~~(height / 2)][width - ~~(width / 4)].nodeState = NodeStates.end;
  BoardNode.startNode = grid[~~(height / 2)][~~(width / 4)];
  BoardNode.endNode = grid[~~(height / 2)][width - ~~(width / 4)];
  const [currentGrid, setGrid] = useState(grid);

  const visualize = async function () {
    const start = { x: BoardNode.startNode.x, y: BoardNode.startNode.y };
    const end = { x: BoardNode.endNode.x, y: BoardNode.endNode.y };
    const [visitedOrder, shortestPath] = bfs(start, end, currentGrid, false);
    console.log(visitedOrder);
    let index = 0;
    const interval = setInterval(() => {
      let x = visitedOrder[index].x;
      let y = visitedOrder[index].y;
      index++;
      currentGrid[y][x].setState(NodeStates.visited);
      if (index === visitedOrder.length) clearInterval(interval);
    }, 1);
  };

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

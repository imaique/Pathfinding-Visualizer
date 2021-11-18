import './PathFinderBoard.css';
import React, { useEffect, useState, useRef } from 'react';
import { dfs } from '../../algorithms/dfs';
import { bfs } from '../../algorithms/bfs';
import { NodeStates } from './NodeStates';
import { BoardNode } from './BoardNode';
import { djikstra } from '../../algorithms/dijkstra';
import { astar } from '../../algorithms/astar';
import { greedy } from '../../algorithms/greedy';
import PathfinderAlgorithms from './PathfinderAlgorithms';
import Node from './Node';
import createEmptyBoard from '../../utils/createEmptyBoard';
import deepCopyBoard from '../../utils/deepCopyGrid';

const PathFinderBoard = () => {
  const [currentGrid, setGrid] = useState([]);
  const [draggedState, setDraggedState] = useState(null);
  const [isAnimating, setAnimating] = useState(false);
  const [isVisualized, setVisualized] = useState(false);
  const [visitedNodes, setVisitedNodes] = useState([]);
  //const [pathfindingAlgorithm, setPathfindingAlgorithm] = useState(astar);
  const [startNode, setStartNode] = useState();
  const [endNode, setEndNode] = useState();
  // const isVisualized = useRef(false);

  window.addEventListener('mouseup', () => {
    setDraggedState(null);
    // find replacement logic
    //BoardNode.revertPreviousNode = null;
  });

  useEffect(() => {
    freshGrid();
  }, []);

  function freshGrid() {
    const width = 60;
    const height = 30;
    const newBoard = createEmptyBoard(width, height);

    const middleRow = ~~(height / 2);
    const startCol = ~~(width / 4);
    const endCol = width - ~~(width / 4);
    newBoard[middleRow][startCol].nodeState = NodeStates.start;
    setStartNode({ y: middleRow, x: startCol });
    newBoard[middleRow][endCol].nodeState = NodeStates.end;
    setEndNode({ y: middleRow, x: endCol });
    setGrid(newBoard);
  }

  const visualize = async function () {
    if (isAnimating) return;
    if (isVisualized) cleanUpVisitedNodes();
    setVisualized(true);
    setAnimating(true);
    const [visitedOrder, takenPath] = bfs(
      startNode,
      endNode,
      currentGrid,
      true
    );
    setVisitedNodes(visitedOrder);
    if (visitedOrder.length === 0) return;

    let index = 0;
    const interval = setInterval(async () => {
      const x = visitedOrder[index].x;
      const y = visitedOrder[index].y;
      index++;
      if (!isStart(y, x) && !isEnd(y, x)) {
        console.time();
        setGrid((prevGrid) =>
          prevGrid.map((row, xIdx) => {
            if (x === xIdx) {
              return row.map((cell, yIdx) => {
                if (y === yIdx) {
                  return {
                    ...cell,
                    nodestate: NodeStates.visited,
                  };
                }
                return cell;
              });
            }
            return row;
          })
        );
        console.timeEnd();
      }
      if (index === visitedOrder.length) {
        clearInterval(interval);
        await visualizePath(takenPath);
        setAnimating(false);
      }
    }, 0.1);
  };

  const cleanUpVisitedNodes = () => {
    setGrid((prevGrid) => {
      const newBoard = deepCopyBoard(prevGrid);
      for (let node of visitedNodes) {
        const x = node.x;
        const y = node.y;
        const nodeState = newBoard[y][x].nodeState;
        if (nodeState === NodeStates.path || nodeState === NodeStates.visited)
          newBoard[y][x].nodeState = NodeStates.unvisited;
      }
    });
  };
  const isEnd = (y, x) => {
    return y === endNode.y && x === endNode.x;
  };
  const isStart = (y, x) => {
    return y === startNode.y && x === startNode.x;
  };

  const visualizePath = function (takenPath) {
    return new Promise((resolve) => {
      if (takenPath.length === 0) {
        resolve();
        return;
      }
      let index = 0;
      const pathInterval = setInterval(() => {
        const x = takenPath[index].x;
        const y = takenPath[index].y;
        index++;
        if (!isStart(y, x) && !isEnd(y, x)) {
          setGrid((prevGrid) =>
            prevGrid.map((row, xIdx) => {
              if (x === xIdx) {
                return row.map((cell, yIdx) => {
                  if (y === yIdx) {
                    return {
                      ...cell,
                      nodeState: NodeStates.visited,
                    };
                  }
                  return cell;
                });
              }
              return row;
            })
          );
        }
        if (index === takenPath.length) {
          clearInterval(pathInterval);
          resolve();
        }
      }, 20);
    });
  };
  const handleMouseDownNode = (y, x) => {};
  const handleMouseOverNode = (y, x) => {
    if (
      BoardNode.draggedState === null ||
      this.nodeState === NodeStates.start ||
      this.nodeState === NodeStates.end
    )
      return;

    if (
      BoardNode.draggedState === NodeStates.unvisited &&
      (this.nodeState === NodeStates.path ||
        this.nodeState === NodeStates.visited)
    )
      return;

    if (
      BoardNode.draggedState !== NodeStates.wall &&
      BoardNode.revertPreviousNode !== null
    ) {
      BoardNode.revertPreviousNode();
      this.setThisAsPrevious();
    }
    this.setState(BoardNode.draggedState);
    if (BoardNode.draggedState === NodeStates.wall) {
      BoardNode.walls.add(this.getKey());
    } else if (BoardNode.draggedState === NodeStates.unvisited) {
      BoardNode.walls.delete(this.getKey());
    } else if (BoardNode.draggedState === NodeStates.start) {
      BoardNode.startNode = this;
    } else if (BoardNode.draggedState === NodeStates.end) {
      BoardNode.endNode = this;
    }
  };

  return (
    <React.Fragment>
      <PathfinderAlgorithms />
      <button type="button" onClick={visualize} title="Visualize">
        Visualize!
      </button>
      <table className="board">
        <tbody onContextMenu={(e) => e.preventDefault()}>
          {currentGrid.map((row, index1) => (
            <tr className="row" key={index1}>
              {row.map((node, index2) => (
                <Node
                  key={index2}
                  state={node.nodeState}
                  //onMouseOverNode={() => handleMouseOverNode(node.y, node.x)}
                  //onMouseDownNode={() => handleMouseDownNode(node.y, node.x)}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

export default PathFinderBoard;

import './PathFinderBoard.css';
import { useEffect, useRef, useState } from 'react';

const NodeStates = {
  start: 'start',
  end: 'end',
  visited: 'visited',
  unvisited: 'unvisited',
  wall: 'wall',
};

class Node {
  static draggedState = null;
  static revertPreviousNode = null;
  static walls = new Set();
  constructor(x, y) {
    this.weight = 1;
    this.x = x;
    this.y = y;
    this.nodeState = NodeStates.unvisited;
    this.setState = this.setState.bind(this);
    this.click = this.click.bind(this);
    this.mouseOver = this.mouseOver.bind(this);
  }
  mouseOver(event) {
    if (
      Node.draggedState === null ||
      this.nodeState === NodeStates.start ||
      this.nodeState === NodeStates.end
    )
      return;
    //if (this.nodeState === NodeStates.unvisited)

    if (
      Node.draggedState !== NodeStates.wall &&
      Node.revertPreviousNode !== null
    ) {
      Node.revertPreviousNode();
      this.setThisAsPrevious();
    }
    this.setState(Node.draggedState);
    if (Node.draggedState === NodeStates.wall) {
      Node.walls.add(this.getKey());
    } else if (Node.draggedState === NodeStates.unvisited) {
      Node.walls.delete(this.getKey());
    }
  }
  getKey() {
    return `${this.y}_${this.x}`;
  }
  // e.button === 0: the left button is clicked
  // e.button === 1: the middle button is clicked
  // e.button === 2: the right button is clicked
  // e.button === 3: the `Browser Back` button is clicked
  // e.button === 4: the `Browser Forward` button is clicked
  click(event) {
    const which = event.button;
    event.preventDefault();
    if (which === 0) {
      Node.draggedState = this.nodeState;
      if (this.nodeState === NodeStates.unvisited) {
        Node.draggedState = NodeStates.wall;
        this.setState(NodeStates.wall);
        Node.walls.add(this.getKey());
      } else {
        this.setThisAsPrevious(NodeStates.unvisited);
      }
    } else if (which === 2) {
      Node.draggedState = NodeStates.unvisited;
      if (this.nodeState === NodeStates.wall) {
        this.setState(NodeStates.unvisited);
        Node.walls.delete(this.getKey());
      }
    }
  }
  setThisAsPrevious(state = this.nodeState) {
    Node.revertPreviousNode = this.setState.bind(this, state);
  }
  setState(state) {
    if (state === undefined) state = NodeStates.unvisited;
    //why bug?

    //if (state === this.state) return;
    this.NodeDOM.className = 'node ' + NodeStates[state];
    this.nodeState = state;
  }
}

const PathFinderBoard = () => {
  window.addEventListener('mouseup', () => {
    Node.draggedState = null;
    Node.revertPreviousNode = null;
  });
  const width = 60;
  const height = 30;

  let grid = new Array(height);
  for (let i = 0; i < height; i++) {
    let row = new Array(width);
    for (let j = 0; j < width; j++) {
      row[j] = new Node(j, i);
    }
    grid[i] = row;
  }
  grid[~~(height / 2)][~~(width / 4)].nodeState = NodeStates.start;
  grid[~~(height / 2)][width - ~~(width / 4)].nodeState = NodeStates.end;
  const [currentGrid, setGrid] = useState(grid);

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
  );
};

export default PathFinderBoard;

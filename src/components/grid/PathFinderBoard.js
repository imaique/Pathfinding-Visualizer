import './PathFinderBoard.css';
import { useEffect } from 'react';

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
  }
  click(event) {
    event.preventDefault();
    Node.draggedState = this.nodeState;
    if (this.nodeState === NodeStates.unvisited) {
      Node.draggedState = NodeStates.wall;
      this.setState(NodeStates.wall);
    } else {
      this.setThisAsPrevious(NodeStates.unvisited);
    }
  }
  setThisAsPrevious(state = this.nodeState) {
    Node.revertPreviousNode = this.setState.bind(this, state);
  }
  setState(state) {
    if (state === undefined) state = NodeStates.unvisited;
    this.NodeDOM.className = 'node ' + NodeStates[state];
    this.nodeState = state;
  }
}

const PathFinderBoard = () => {
  window.addEventListener('mouseup', () => (Node.draggedState = null));
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

  useEffect(() => {
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const currentNode = grid[i][j];
        currentNode.NodeDOM = document.getElementById(
          `${currentNode.y}_${currentNode.x}`
        );
      }
    }
  });

  return (
    <table className="board">
      <tbody>
        {grid.map((row) => (
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

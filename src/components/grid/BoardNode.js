import { NodeStates } from './NodeStates';

export class BoardNode {
  static startNode = null;
  static endNode = null;
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
      BoardNode.draggedState = this.nodeState;
      if (
        this.nodeState === NodeStates.path ||
        this.nodeState === NodeStates.visited
      ) {
        BoardNode.draggedState = NodeStates.wall;
      } else if (this.nodeState === NodeStates.unvisited) {
        BoardNode.draggedState = NodeStates.wall;
        this.setState(NodeStates.wall);
        BoardNode.walls.add(this.getKey());
      } else {
        this.setThisAsPrevious(NodeStates.unvisited);
      }
    } else if (which === 2) {
      BoardNode.draggedState = NodeStates.unvisited;
      if (this.nodeState === NodeStates.wall) {
        this.setState(NodeStates.unvisited);
        BoardNode.walls.delete(this.getKey());
      }
    }
  }
  setThisAsPrevious(state = this.nodeState) {
    BoardNode.revertPreviousNode = this.setState.bind(this, state);
  }
  setState(state) {
    if (state === undefined) state = NodeStates.unvisited;
    //why bug?

    //if (state === this.state) return;
    this.NodeDOM.className = 'node ' + NodeStates[state];
    this.nodeState = state;
  }
}

import './PathFinderBoard.css';

const NodeStates = {
  start: 0,
  end: 1,
  visited: 2,
  unvisited: 3,
};

class Node {
  constructor(x, y) {
    this.weight = 1;
    this.x = x;
    this.y = y;
    this.nodeState = NodeStates.unvisited;
  }
  setState(state) {
    const NodeDOM = document.getElementById(`${this.y}_${this.x}`);
    switch (state) {
      case NodeStates.start:
        NodeDOM.className = 'node start';
    }
  }
}

const PathFinderBoard = () => {
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
  console.log(grid);
  const startNode = grid[~~(height / 2)][~~(width / 4)];
  const endNode = grid[~~(height / 2)][width - ~~(width / 4)];
  return (
    <table className="board">
      <tbody>
        {grid.map((row) => (
          <tr className="row">
            {row.map((node) => (
              <td
                className={
                  'node ' +
                  (node === startNode
                    ? 'start'
                    : node === endNode
                    ? 'end'
                    : 'unvisited')
                }
                id={`${node.y}_${node.x}`}
              ></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PathFinderBoard;

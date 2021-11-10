import './PathFinderBoard.css';

class Node {
  constructor(x, y) {
    this.weight = 1;
    this.x = x;
    this.y = y;
  }
}

const PathFinderBoard = () => {
  const width = 30;
  const height = 15;
  let grid = new Array(height);
  for (let i = 0; i < height; i++) {
    let row = new Array(width);
    for (let j = 0; j < width; j++) {
      row[j] = new Node(j, i);
    }
    grid[i] = row;
  }
  return (
    <table className="board">
      <tbody>
        {grid.map((row) => (
          <tr className="row">
            {row.map((node) => (
              <td className="node unvisited" id={`${node.y}_${node.x}`}></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PathFinderBoard;

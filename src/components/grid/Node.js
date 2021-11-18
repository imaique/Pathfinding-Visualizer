import { memo } from 'react';

const Node = ({ y, x, state, onMouseOverNode, onMouseDownNode }) => {
  return (
    <td
      className={'node ' + state}
      onMouseDown={onMouseDownNode}
      onMouseOver={onMouseOverNode}
    ></td>
  );
};

export default Node;

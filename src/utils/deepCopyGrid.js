const deepCopyBoard = (prevBoard) => {
  return prevBoard.map((row) =>
    row.map((o) => {
      return { ...o };
    })
  );
};

export default deepCopyBoard;

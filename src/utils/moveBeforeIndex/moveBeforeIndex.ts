export const moveBeforeIndex = <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
  if (fromIndex === toIndex) {
    return array;
  }

  const item = array[fromIndex];
  const newArray = [...array];
  newArray.splice(fromIndex, 1);

  // If dragging downward, target shifts up after removal
  const insertIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;

  newArray.splice(insertIndex, 0, item);
  return newArray;
};

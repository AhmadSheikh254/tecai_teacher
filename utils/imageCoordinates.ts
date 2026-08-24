export const calculateScaledCoordinates = (x: number, y: number, containerWidth: number, containerHeight: number) => {
  return {
    scaledX: (x / 100) * containerWidth,
    scaledY: (y / 100) * containerHeight,
  };
};

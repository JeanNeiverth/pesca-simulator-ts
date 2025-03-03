export const FishingLine = ({
  params,
}: {
  params: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    curvature: number;
  };
}) => {
  // Generate a simple parabolic curve path
  const generateParabolicPath = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    curvature: number
  ) => {
    // Calculate control point for the quadratic bezier curve
    // This creates a simple parabola
    const midX = (x1 + x2) / 2;

    // Calculate the linear midpoint y
    const midY = (y1 + y2) / 2;

    // Calculate the distance between the points
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    // Calculate the perpendicular direction to create the control point
    const dx = x2 - x1;
    const dy = y2 - y1;

    // Calculate perpendicular vector (swap x/y and negate one)
    let perpX = -dy;
    let perpY = dx;

    // Normalize the perpendicular vector
    const perpLength = Math.sqrt(perpX * perpX + perpY * perpY);
    perpX = perpX / perpLength;
    perpY = perpY / perpLength;

    // Calculate control point offset using the perpendicular vector
    // Negative value curves downward (typical for a hanging line)
    // const curvature = -saturation(Math.abs(dx) / 3000, 0.15);
    const controlOffsetDistance = distance * curvature;
    const controlX = midX + perpX * controlOffsetDistance;
    const controlY = midY + perpY * controlOffsetDistance;

    // Create the path string for a quadratic bezier curve
    return `M ${x1} ${y1} Q ${controlX} ${controlY}, ${x2} ${y2}`;
  };

  // Generate the path for our parabolic curve
  const pathData = generateParabolicPath(
    params.x1,
    params.y1,
    params.x2,
    params.y2,
    params.curvature
  );

  return (
    <svg
      className="absolute left-0 top-0 pointer-events-none"
      width="1920"
      height="1080"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={pathData} fill="none" stroke="gray" strokeWidth="1" />
    </svg>
  );
};

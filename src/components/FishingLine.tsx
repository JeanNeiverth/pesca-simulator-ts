export const FishingLine = ({
  params,
}: {
  params: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
}) => {
  return (
    <svg
      className="absolute left-0 top-0 pointer-events-none"
      width="1920"
      height="1080"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1={`${params.x1}`}
        y1={`${params.y1}`}
        x2={`${params.x2}`}
        y2={`${params.y2}`}
        stroke="gray"
        strokeWidth="1"
      />
    </svg>
  );
};

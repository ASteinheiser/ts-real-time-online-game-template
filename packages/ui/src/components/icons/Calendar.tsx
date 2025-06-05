interface CalendarProps {
  size?: number;
  className?: string;
}

export const Calendar = ({ size = 24, className }: CalendarProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className={className}
    >
      <path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6zm13-4v4M8 2v4m-5 4h18" />
    </svg>
  );
};

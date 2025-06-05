interface ChevronDownProps {
  size?: number;
  className?: string;
}

export const ChevronDown = ({ size = 24, className }: ChevronDownProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className={className}
    >
      <path d="M21 9l-9 5l-9-5" />
    </svg>
  );
};

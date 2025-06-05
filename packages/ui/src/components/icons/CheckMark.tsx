interface CheckMarkProps {
  size?: number;
  className?: string;
}

export const CheckMark = ({ size = 24, className }: CheckMarkProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className={className}
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  );
};

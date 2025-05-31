interface PersonProps {
  size?: number;
  className?: string;
}

export const Person = ({ size = 24, className }: PersonProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className={className}
    >
      <path
        d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM6 20c0-3.314 2.686-6 6-6s6 2.686 6 6"
        strokeLinecap="round"
      />
    </svg>
  );
};

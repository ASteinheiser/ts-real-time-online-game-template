export const LoadingSpinner = () => {
  return (
    <div className="relative">
      <div className="w-10 h-10 border-4 border-t-transparent border-b-transparent border-primary rounded-full animate-[spin_1.25s_linear_infinite]" />
      <div className="absolute top-2 left-2 w-6 h-6 border-4 border-t-transparent border-b-transparent border-primary rounded-full animate-[spin_1.25s_linear_infinite_reverse]" />
    </div>
  );
};

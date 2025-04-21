interface CustomBadgeProps {
  count: number;
  className?: string;
}

const CustomBadge: React.FC<CustomBadgeProps> = ({ count, className }) => {
  return (
      <span
          className={`flex items-center justify-center text-sm font-semibold text-gray-800 bg-gray-200 rounded-full w-7 h-5 ${className}`}
      >
          {count}
      </span>
  );
};

export default CustomBadge;
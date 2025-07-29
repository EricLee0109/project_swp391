import { categories } from "@/types/categories";

interface FilterPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export const FilterPill: React.FC<FilterPillProps> = ({
  label,
  active,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
      active
        ? "bg-primary text-white shadow-md"
        : "bg-white text-gray-700 hover:bg-gray-100"
    }`}
  >
    {categories
      .filter((cat) => cat.value === label)
      .map((cate) => cate.label) || label}
  </button>
);

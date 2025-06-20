interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

// --- HELPER COMPONENT FOR DISPLAYING DETAILS ---
export const DetailItem: React.FC<DetailItemProps> = ({
  icon,
  label,
  value,
}) => {
  if (!value && typeof value !== "number") return null;
  return (
    <div className="flex items-start text-sm">
      <div className="flex-shrink-0 w-6 h-6 text-gray-500 mr-3">{icon}</div>
      <div>
        <p className="font-semibold text-gray-700">{label}</p>
        <p className="text-gray-600">{value}</p>
      </div>
    </div>
  );
};

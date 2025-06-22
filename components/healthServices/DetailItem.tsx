// interface DetailItemProps {
//   icon: React.ReactNode;
//   label: string;
//   value: React.ReactNode;
// }

// --- HELPER COMPONENT FOR DISPLAYING DETAILS ---
// Trong DetailItem.tsx:
export function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode; // đổi từ string thành React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <span>{icon}</span>
      <div>
        <div className="font-semibold">{label}</div>
        <div>{value}</div>
      </div>
    </div>
  );
}


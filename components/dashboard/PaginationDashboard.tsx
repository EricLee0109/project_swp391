import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// components/dashboard/PaginationDashboard.tsx
interface PaginationDashboardProps {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function PaginationDashboard({
  page,
  total,
  limit,
  onPageChange,
}: PaginationDashboardProps) {
  const totalPages = Math.ceil(total / limit);

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <div className="flex justify-end w-full ">
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={handlePrev} href="#" />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={i + 1 === page}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext onClick={handleNext} href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
    </div>
    
  );
}


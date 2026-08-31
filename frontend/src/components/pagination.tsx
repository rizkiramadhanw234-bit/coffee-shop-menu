"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useProductStore } from "@/stores/product.store";

type PaginationProps = {
  totalPages: number;
};

export default function PaginationPage({ totalPages }: PaginationProps) {
  const { page, setPage } = useProductStore();
  return (
    <>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(Math.max(page - 1, 1))}
            />
          </PaginationItem>

          {page > 1 && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(page - 1)}>
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink onClick={() => setPage(page)} isActive>
              {page}
            </PaginationLink>
          </PaginationItem>

          {page + 1 <= totalPages && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(page + 1)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {page + 2 <= totalPages && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(page + 2)}>
                {page + 2}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>

          {page < totalPages && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(Math.min(page + 1, totalPages))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}

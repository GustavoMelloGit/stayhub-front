import type { ReactNode } from 'react';
import type { DataTableProps, JsonDataTableRow } from './types';
import { DataTableDesktop } from './DataTableDesktop';
import { DataTableMobile } from './DataTableMobile';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const renderPagination = (
  page: number,
  totalPages: number,
  onPageChange: (page: number) => void
): ReactNode => {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [];

    if (page <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    } else if (page >= totalPages - 2) {
      pages.push(1);
      pages.push('ellipsis');
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('ellipsis');
      for (let i = page - 1; i <= page + 1; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={e => {
              e.preventDefault();
              if (page > 1) {
                onPageChange(page - 1);
              }
            }}
            className={
              page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
            }
            href='#'
          />
        </PaginationItem>
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === 'ellipsis') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                isActive={pageNum === page}
                onClick={e => {
                  e.preventDefault();
                  onPageChange(pageNum);
                }}
                className='cursor-pointer'
                href='#'
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            onClick={e => {
              e.preventDefault();
              if (page < totalPages) {
                onPageChange(page + 1);
              }
            }}
            className={
              page === totalPages
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
            href='#'
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export function DataTable<T extends JsonDataTableRow>(
  props: DataTableProps<T>
) {
  const { pagination } = props;

  return (
    <>
      <div className='hidden md:block'>
        <DataTableDesktop {...props} />
      </div>
      <div className='block md:hidden'>
        <DataTableMobile {...props} />
      </div>
      {pagination && (
        <div className='mt-4'>
          {renderPagination(
            pagination.page,
            pagination.totalPages,
            pagination.onPageChange
          )}
        </div>
      )}
    </>
  );
}

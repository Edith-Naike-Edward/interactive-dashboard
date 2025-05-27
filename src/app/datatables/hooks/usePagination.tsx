// src/hooks/usePagination.ts
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export function usePagination(filteredData: any[], defaultItemsPerPage = 10) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      updateUrlParams({ page });
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    const newItems = Number(newItemsPerPage);
    setItemsPerPage(newItems);
    setCurrentPage(1);
    updateUrlParams({ page: 1, limit: newItems });
  };

  const updateUrlParams = (params: { page?: number; limit?: number }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (params.page) newParams.set('page', params.page.toString());
    if (params.limit) newParams.set('limit', params.limit.toString());
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  // Initialize from URL params
  useEffect(() => {
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    
    if (pageParam) {
      const pageNumber = parseInt(pageParam, 10);
      if (!isNaN(pageNumber)) {
        setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
      }
    }
    
    if (limitParam) {
      const limitNumber = parseInt(limitParam, 10);
      if (!isNaN(limitNumber)) {
        setItemsPerPage(Math.max(5, Math.min(limitNumber, 100))); // Limit between 5-100
      }
    }
  }, [searchParams]);

  // Validate current page when data changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    currentItems,
    handlePageChange,
    handleItemsPerPageChange,
    totalItems: filteredData.length
  };
}
import React from 'react';
import clsx from 'clsx';
import { usePagination, DOTS } from '@/lib/hooks/usePagination';
import './pagination.css';

interface paginationProps {
    onPageChange: (value: number | string) => void,
    totalCount: number,
    siblingCount?: number,
    currentPage: number | string,
    limit: number,
    className: string
  }

const Pagination = (props: paginationProps) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    limit,
    className
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    limit
  }) as (string | number)[];

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange?.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage as number + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage as number - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul
      className={clsx('pagination-container ', { [className]: className })}
    >
       {/* Left navigation arrow */}
      <li
        className={clsx('pagination-item dark:text-white', {
          disabled: currentPage === 1
        })}
        onClick={onPrevious}
      >
        <div className="arrow left dark:before:border-t-white dark:before:border-r-white " />
      </li>
      {paginationRange?.map((pageNumber, i) => {
         
        // If the pageItem is a DOT, render the DOTS unicode character
        if (pageNumber === DOTS) {
          return <li key={i} className="pagination-item dots">&#8230;</li>;
        }
		
        // Render our Page Pills
        return (
          <li
            key={i}
            className={clsx('pagination-item dark:text-white', {
              selected: pageNumber === currentPage
            })}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}
      {/*  Right Navigation arrow */}
      <li
        className={clsx('pagination-item dark:text-white', {
          disabled: currentPage === lastPage
        })}
        onClick={onNext}
      >
        <div className="arrow right dark:before:border-t-white dark:before:border-r-white dark:disabled:before:border-t-white dark:disabled:before:border-r-white" />
      </li>
    </ul>
  );
};

export default Pagination;
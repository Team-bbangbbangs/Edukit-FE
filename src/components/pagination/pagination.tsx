import Link from 'next/link';

interface PaginationProps {
  categoryId?: string;
  nowPage?: string;
  maxPage: number;
}

const paginationStyle = 'rounded-md min-w-8 h-8 flex items-center justify-center text-center p-1';

export default function Pagination({ categoryId, nowPage = '1', maxPage }: PaginationProps) {
  const currentPage = parseInt(nowPage, 10);

  const blockSize = 5;
  const startPageNumber = Math.floor((currentPage - 1) / blockSize) * blockSize + 1;
  const endPageNumber = Math.min(startPageNumber + blockSize - 1, maxPage);

  const pageArr = Array.from(
    { length: endPageNumber - startPageNumber + 1 },
    (_, i) => startPageNumber + i,
  );

  const makeQuery = (page: number) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    if (categoryId) {
      params.set('categoryId', categoryId);
    }
    return `?${params.toString()}`;
  };

  return (
    <section className="flex items-center justify-center gap-2">
      {startPageNumber > 5 ? (
        <Link
          href={makeQuery(startPageNumber - 1)}
          className={`${paginationStyle} hover:bg-slate-200`}
        >
          {'<'}
        </Link>
      ) : (
        <span className={`${paginationStyle} text-slate-300`}>{'<'}</span>
      )}

      {pageArr.map((page) =>
        page !== currentPage ? (
          <Link
            key={page}
            href={makeQuery(page)}
            className={`${paginationStyle} hover:bg-slate-200`}
          >
            {page}
          </Link>
        ) : (
          <span key={page} className={`${paginationStyle} bg-slate-300 font-bold`}>
            {page}
          </span>
        ),
      )}

      {endPageNumber !== maxPage ? (
        <Link
          href={makeQuery(endPageNumber + 1)}
          className={`${paginationStyle} hover:bg-slate-200`}
        >
          {'>'}
        </Link>
      ) : (
        <span className={`${paginationStyle} text-slate-300`}>{'>'}</span>
      )}
    </section>
  );
}

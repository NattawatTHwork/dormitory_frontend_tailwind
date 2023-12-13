import React from 'react';

const PaginatedList = ({ items, itemsPerPage, currentPage, onPageChange, totalPages }) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      {currentItems.map(item => (
        <div key={item.user_id} className="p-4 border border-gray-300">
          {item.first_name}
        </div>
      ))}
      <div className="mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1 bg-blue-500 text-white disabled:opacity-50"
        >
          หน้าก่อนหน้า
        </button>
        <button
          disabled={indexOfLastItem >= items.length}
          onClick={() => onPageChange(currentPage + 1)}
          className="ml-2 px-3 py-1 bg-blue-500 text-white disabled:opacity-50"
        >
          หน้าถัดไป
        </button>
        <p className="mt-2">
          หน้า {currentPage} จากทั้งหมด {totalPages} หน้า
        </p>
      </div>
    </div>
  );
};

export default PaginatedList;

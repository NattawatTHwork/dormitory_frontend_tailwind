import React, { useState } from 'react';
import PaginatedList from '../../components/PaginatedList';

const items = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `Item ${index + 1}`,
}));

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const onPageChange = newPage => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">รายการแบ่งหน้า</h1>
      <PaginatedList
        items={items}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={onPageChange}
        totalPages={totalPages}
      />
    </div>
  );
};

export default Home;

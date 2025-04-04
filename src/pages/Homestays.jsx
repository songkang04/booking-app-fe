import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/layouts/Header';
import HomestayFilters from '../components/HomestayFilters';
import HomestayList from '../components/HomestayList';

const Homestays = () => {
  const [homestays, setHomestays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHomestays = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3000/api/homestays/search', {
        params: {
          ...params,
          page: currentPage,
          limit: 8
        }
      });
      
      setHomestays(response.data.data.homestays);
      setTotalPages(response.data.data.totalPages);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách homestay. Vui lòng thử lại sau.');
      console.error('Error fetching homestays:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomestays();
  }, [currentPage]);

  const handleFilter = (filterParams) => {
    setCurrentPage(1); // Reset to first page when filtering
    fetchHomestays(filterParams);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-20">
        {/* Hero section with gradient background */}
        <div className="relative isolate overflow-hidden">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{
              clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
            }} />
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
            <div className="mx-auto max-w-2xl text-center mb-8">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                Tìm Homestay
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Khám phá những homestay tuyệt vời với không gian sống độc đáo và tiện nghi đầy đủ
              </p>
            </div>

            <HomestayFilters onFilter={handleFilter} />
          </div>
        </div>

        {/* Homestay listings */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
          <HomestayList 
            homestays={homestays} 
            loading={loading} 
            error={error} 
          />

          {/* Pagination */}
          {!loading && !error && homestays.length > 0 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                  ${currentPage === 1 
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                Trước
              </button>
              <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                  ${currentPage === totalPages 
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Homestays;
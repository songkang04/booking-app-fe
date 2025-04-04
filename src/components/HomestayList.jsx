import React from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60';

const HomestayList = ({ homestays, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
        {error}
      </div>
    );
  }

  if (!homestays?.length) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center mt-4 p-8">
        Không tìm thấy homestay nào phù hợp với tiêu chí tìm kiếm của bạn.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {homestays.map((homestay) => (
        <Link 
          key={homestay.id}
          to={`/homestays/${homestay.id}`}
          className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-200 hover:shadow-xl"
        >
          <div className="aspect-w-16 aspect-h-9 overflow-hidden">
            <img
              src={homestay.images?.[0] || DEFAULT_IMAGE}
              alt={homestay.name}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-200"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_IMAGE;
              }}
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              {homestay.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {homestay.address}
            </p>
            <div className="flex justify-between items-center mt-4">
              <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(homestay.price)}
                <span className="text-sm text-gray-500 dark:text-gray-400">/đêm</span>
              </p>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
                  {homestay.rating || '4.5'}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default HomestayList;
import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

/**
 * Hiển thị số sao dựa trên đánh giá
 * @param {Object} props - Component props
 * @param {number} props.rating - Điểm đánh giá (0-5)
 * @param {string} props.size - Kích thước icon (small, medium, large)
 */
const StarRating = ({ rating = 0, size = 'medium' }) => {
  // Làm tròn điểm đánh giá đến 0.5 gần nhất
  const roundedRating = Math.round(rating * 2) / 2;
  
  // Tạo mảng 5 ngôi sao
  const stars = [];
  
  // Xác định kích thước
  const sizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };
  
  // Hiển thị từng ngôi sao
  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      // Sao đầy đủ
      stars.push(<FaStar key={i} className="text-yellow-500" />);
    } else if (i - 0.5 === roundedRating) {
      // Nửa sao
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
    } else {
      // Sao trống
      stars.push(<FaRegStar key={i} className="text-yellow-500" />);
    }
  }
  
  return (
    <div className={`flex ${sizeClass[size]}`}>{stars}</div>
  );
};

/**
 * Component hiển thị một đánh giá
 * @param {Object} props - Component props
 * @param {Object} props.review - Thông tin đánh giá
 */
const ReviewItem = ({ review }) => {
  return (
    <div className="border-b pb-4 mb-4 last:border-0 last:mb-0">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
          {review.user?.avatar ? (
            <img 
              src={review.user.avatar} 
              alt={review.user.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold">
              {review.user?.fullName?.charAt(0) || 'G'}
            </div>
          )}
        </div>
        
        <div className="ml-3">
          <div className="font-medium">{review.user?.fullName || 'Khách đã đặt phòng'}</div>
          <div className="text-sm text-gray-500">
            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
          </div>
        </div>
      </div>
      
      <div className="mt-2">
        <StarRating rating={review.rating} />
        <p className="mt-2 text-gray-700">{review.comment}</p>
      </div>
      
      {/* Phản hồi từ chủ homestay */}
      {review.response && (
        <div className="mt-3 pl-4 border-l-2 border-gray-300">
          <div className="text-sm font-medium">Phản hồi từ chủ homestay:</div>
          <p className="text-sm text-gray-600 mt-1">{review.response}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Component hiển thị danh sách đánh giá
 * @param {Object} props - Component props
 * @param {Array} props.reviews - Mảng đánh giá
 * @param {Object} props.meta - Thông tin metadata (tổng số, trang hiện tại, tổng số trang)
 * @param {Function} props.onLoadMore - Hàm xử lý khi click nút "Xem thêm"
 * @param {string} props.className - className bổ sung
 */
const ReviewsSection = ({ reviews = [], meta = {}, onLoadMore, className = '' }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  
  // Lọc đánh giá theo số sao (nếu có)
  const filteredReviews = selectedRating 
    ? reviews.filter(review => Math.floor(review.rating) === selectedRating)
    : reviews;
  
  // Hiển thị trường hợp không có đánh giá
  if (!reviews || reviews.length === 0) {
    return (
      <div className={`bg-white rounded-lg ${className}`}>
        <h2 className="text-xl font-bold mb-4">Đánh giá</h2>
        <p className="text-gray-500">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá homestay này!</p>
      </div>
    );
  }
  
  return (
    <div className={`bg-white rounded-lg ${className}`}>
      <h2 className="text-xl font-bold mb-4">Đánh giá</h2>
      
      {/* Tổng quan đánh giá */}
      <div className="flex items-center mb-6">
        <div className="mr-4">
          <div className="text-3xl font-bold">{meta.averageRating?.toFixed(1) || '0.0'}</div>
          <StarRating rating={meta.averageRating || 0} size="small" />
          <div className="text-sm text-gray-500 mt-1">{meta.total || 0} đánh giá</div>
        </div>
        
        <div className="ml-4 flex flex-wrap gap-2">
          {[5, 4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              className={`px-3 py-1 rounded-full text-sm 
                ${selectedRating === rating 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              onClick={() => setSelectedRating(
                selectedRating === rating ? 0 : rating
              )}
            >
              {rating} sao
              {selectedRating === rating && ' ✓'}
            </button>
          ))}
        </div>
      </div>
      
      {/* Danh sách đánh giá */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map(review => (
            <ReviewItem key={review.id} review={review} />
          ))
        ) : (
          <p className="text-gray-500">Không có đánh giá nào thỏa mãn điều kiện lọc.</p>
        )}
      </div>
      
      {/* Nút xem thêm */}
      {meta.totalPages > 1 && meta.page < meta.totalPages && (
        <button
          className="mt-6 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 w-full"
          onClick={onLoadMore}
        >
          Xem thêm đánh giá
        </button>
      )}
    </div>
  );
};

export default ReviewsSection;

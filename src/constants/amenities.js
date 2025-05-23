/**
 * Danh sách tiện nghi chuẩn cho ứng dụng
 * Đảm bảo đồng bộ với backend
 */
export const AmenitiesCategories = [
  {
    category: 'Cơ bản',
    items: [
      'Wifi',
      'TV',
      'Điều hòa',
      'Máy giặt',
      'Nóng lạnh',
      'Bàn làm việc'
    ]
  },
  {
    category: 'Không gian',
    items: [
      'Ban công',
      'Vườn',
      'Sân thượng',
      'Bếp riêng',
      'Phòng khách riêng',
      'Lối vào riêng'
    ]
  },
  {
    category: 'Tiện ích',
    items: [
      'Bãi đỗ xe',
      'Hồ bơi',
      'Phòng gym',
      'Nhà bếp',
      'Lò vi sóng',
      'Tủ lạnh'
    ]
  },
  {
    category: 'An toàn',
    items: [
      'Báo cháy',
      'Bình cứu hỏa',
      'Khóa cửa an toàn',
      'Bộ sơ cứu',
      'Camera an ninh'
    ]
  }
];

// Export tên mới cho đồng bộ với component AmenitiesList.jsx
export const AMENITIES_CATEGORIES = AmenitiesCategories.map(cat => cat.category);

// Tạo đối tượng AMENITIES_BY_CATEGORY để sử dụng trong AmenitiesList.jsx
export const AMENITIES_BY_CATEGORY = AmenitiesCategories.reduce((acc, category) => {
  acc[category.category] = category.items;
  return acc;
}, {});

// Tất cả tiện nghi dưới dạng mảng phẳng
export const AllAmenities = AmenitiesCategories.reduce((acc, category) => {
  return [...acc, ...category.items];
}, []);

// Kiểm tra xem một tiện nghi có hợp lệ không
export const isValidAmenity = (amenity) => {
  return AllAmenities.includes(amenity);
};

/**
 * Format số tiền thành định dạng tiền tệ VND
 * @param {number} amount - Số tiền cần format
 * @param {string} currencySymbol - Ký hiệu tiền tệ (mặc định: ₫)
 * @returns {string} - Chuỗi đã được format
 */
export const formatCurrency = (amount, currencySymbol = '₫') => {
  if (amount === null || amount === undefined) {
    return `0 ${currencySymbol}`;
  }
  
  // Chuyển đổi thành số
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Format số thành chuỗi có phân tách hàng nghìn
  return numAmount.toLocaleString('vi-VN') + ' ' + currencySymbol;
};

/**
 * Rút gọn văn bản nếu quá dài
 * @param {string} text - Văn bản cần rút gọn
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} - Văn bản đã được rút gọn
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength) + '...';
};

/**
 * Format ngày tháng theo định dạng Việt Nam (dd/mm/yyyy)
 * @param {Date|string} date - Ngày cần format
 * @returns {string} - Chuỗi ngày đã format
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import homestayService from '../services/homestayService';
import bookingService from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layouts/Header';

// Import các components
import ImageCarousel from '../components/ImageCarousel';
import HomestayInfo from '../components/HomestayInfo';
import AmenitiesList from '../components/AmenitiesList';
import ReviewsSection from '../components/ReviewsSection';
import LocationMap from '../components/LocationMap';
import SimilarHomestays from '../components/SimilarHomestays';
import BookingWidget from '../components/BookingWidget';
import BookingStatus from '../components/BookingStatus';

/**
 * Trang chi tiết homestay
 */
const HomestayDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [homestay, setHomestay] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewMeta, setReviewMeta] = useState({});
  const [similarHomestays, setSimilarHomestays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewsError, setReviewsError] = useState(false);
  const [similarError, setSimilarError] = useState(false);
  const [existingBooking, setExistingBooking] = useState(null);
  const [checkingBooking, setCheckingBooking] = useState(false);

  // Hàm xử lý dữ liệu homestay để đảm bảo đúng định dạng
  const processHomestayData = (data) => {
    if (!data) return null;

    // Tạo bản sao của dữ liệu để tránh thay đổi trực tiếp
    const processedData = { ...data };

    // Xử lý images có thể là chuỗi JSON hoặc mảng
    if (processedData.images) {
      try {
        // Nếu là chuỗi, thử parse JSON
        if (typeof processedData.images === 'string') {
          processedData.images = JSON.parse(processedData.images);
        } else if (Array.isArray(processedData.images) && processedData.images.length > 0) {
          // Nếu là mảng, duyệt qua từng phần tử để xử lý
          const parsedImages = [];

          for (let imgStr of processedData.images) {
            if (typeof imgStr === 'string') {
              // Loại bỏ dấu ngoặc và dấu nháy dư thừa
              imgStr = imgStr.replace(/^\[|\]$/g, ''); // Loại bỏ [ và ] ở đầu và cuối
              imgStr = imgStr.replace(/^"|"$/g, '');   // Loại bỏ " ở đầu và cuối
              imgStr = imgStr.replace(/^\\"|\\\"$/g, ''); // Loại bỏ \" ở đầu và cuối

              // Nếu vẫn còn định dạng JSON, thử parse
              if (imgStr.startsWith('[') || imgStr.startsWith('"')) {
                try {
                  const parsed = JSON.parse(imgStr);
                  if (Array.isArray(parsed)) {
                    // Nếu parse thành công và là mảng, thêm từng phần tử
                    parsed.forEach(item => {
                      if (typeof item === 'string') {
                        parsedImages.push(item.trim());
                      }
                    });
                  } else if (typeof parsed === 'string') {
                    // Nếu parse thành công và là chuỗi
                    parsedImages.push(parsed.trim());
                  }
                } catch (e) {
                  // Nếu không parse được, xử lý như chuỗi thường
                  parsedImages.push(imgStr.trim());
                }
              } else {
                // Nếu là chuỗi thường, thêm vào mảng kết quả
                parsedImages.push(imgStr.trim());
              }
            } else if (imgStr) {
              // Nếu không phải chuỗi nhưng có giá trị
              parsedImages.push(String(imgStr).trim());
            }
          }

          processedData.images = parsedImages;
        }
      } catch (err) {
        console.error('Lỗi khi xử lý dữ liệu hình ảnh:', err);
        // Trường hợp lỗi, chuyển đổi thành mảng rỗng
        processedData.images = [];
      }
    }

    // Đảm bảo images luôn là mảng và không có phần tử rỗng hoặc null
    if (!Array.isArray(processedData.images)) {
      processedData.images = [];
    } else {
      // Lọc bỏ phần tử rỗng, null, undefined
      processedData.images = processedData.images.filter(img => img && img.trim() !== '');

      // Xử lý lại một lần nữa để đảm bảo không còn dấu ngoặc kép dư thừa
      processedData.images = processedData.images.map(img => {
        if (typeof img === 'string') {
          return img.replace(/^"|"$/g, '').trim();
        }
        return img;
      });
    }

    // Log để debug
    console.log('Processed images:', processedData.images);

    return processedData;
  };

  // Fetch dữ liệu homestay
  useEffect(() => {
    // Reset state khi id thay đổi
    setHomestay(null);
    setReviews([]);
    setReviewMeta({});
    setSimilarHomestays([]);
    setReviewPage(1);
    setLoading(true);
    setError(null);
    setReviewsError(false);
    setSimilarError(false);
    setExistingBooking(null);
    setCheckingBooking(false);

    const fetchHomestayData = async () => {
      try {
        // Lấy thông tin homestay
        const homestayRes = await homestayService.getHomestayById(id);
        console.log({homestayRes});

        if (!homestayRes.success) {
          throw new Error(homestayRes.message || 'Không thể tải thông tin homestay');
        }

        // Xử lý và thiết lập dữ liệu homestay
        const processedHomestay = processHomestayData(homestayRes.data.data);
        setHomestay(processedHomestay);

        // Kiểm tra nếu người dùng đã đặt phòng
        if (isAuthenticated) {
          setCheckingBooking(true);
          try {
            const bookingRes = await bookingService.checkUserHomestayBooking(id);
            if (bookingRes.success && bookingRes.hasBooking) {
              setExistingBooking(bookingRes.bookingDetails);
            }
          } catch (err) {
            console.error('Không thể kiểm tra trạng thái đặt phòng:', err);
            // Không hiển thị lỗi với người dùng, chỉ log và tiếp tục
          } finally {
            setCheckingBooking(false);
          }
        }

        // Lấy đánh giá và homestay tương tự - xử lý riêng để không ảnh hưởng lẫn nhau nếu một trong hai lỗi
        try {
          const reviewsRes = await homestayService.getHomestayReviews(id, { page: 1, limit: 5 });
          console.log('Reviews Response:', reviewsRes);

          if (reviewsRes.success) {
            const reviewsData = reviewsRes.data;
            if (reviewsData) {
              // Nếu có dữ liệu pagination
              if (reviewsData.data) {
                setReviews(reviewsData.data);
                setReviewMeta(reviewsData.meta || {});
              } else {
                // Nếu trả về trực tiếp mảng reviews
                setReviews(reviewsData);
                setReviewMeta({ total: reviewsData.length });
              }
            }
          } else {
            // Đánh dấu lỗi khi lấy đánh giá
            setReviewsError(true);
          }
        } catch (reviewErr) {
          console.error('Lỗi khi lấy đánh giá:', reviewErr);
          setReviewsError(true);
        }

        try {
          const similarRes = await homestayService.getSimilarHomestays(id);
          console.log('Similar Homestays Response:', similarRes);

          if (similarRes.success) {
            const similarData = similarRes.data;
            if (similarData) {
              // Xử lý dữ liệu homestay tương tự - đảm bảo images được xử lý đúng
              let processedSimilarHomestays = [];
              const rawHomestays = similarData.data || similarData;

              if (Array.isArray(rawHomestays)) {
                processedSimilarHomestays = rawHomestays.map(homestay => processHomestayData(homestay));
              }

              setSimilarHomestays(processedSimilarHomestays);
            }
          } else {
            // Đánh dấu lỗi khi lấy homestay tương tự
            setSimilarError(true);
          }
        } catch (similarErr) {
          console.error('Lỗi khi lấy homestay tương tự:', similarErr);
          setSimilarError(true);
        }

        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi lấy thông tin homestay:', err);
        setError('Không thể tải thông tin homestay. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchHomestayData();

    // Scroll to top when loading a new homestay
    window.scrollTo(0, 0);
  }, [id]);

  // Hàm tải thêm đánh giá
  const handleLoadMoreReviews = async () => {
    try {
      const nextPage = reviewPage + 1;
      const reviewsRes = await homestayService.getHomestayReviews(id, {
        page: nextPage,
        limit: 5
      });

      console.log('Load More Reviews Response:', reviewsRes);

      if (reviewsRes.success) {
        const reviewsData = reviewsRes.data;
        let newReviews = [];

        if (reviewsData) {
          // Kiểm tra cấu trúc dữ liệu
          if (reviewsData.data) {
            newReviews = reviewsData.data;
            setReviewMeta(reviewsData.meta || {});
          } else {
            newReviews = reviewsData;
          }
        }

        setReviews(prevReviews => [...prevReviews, ...newReviews]);
        setReviewPage(nextPage);
      }
    } catch (err) {
      console.error('Lỗi khi tải thêm đánh giá:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Header và nút quay lại cố định */}
      <div className="fixed top-0 left-0 right-0 z-30">
        {/* Header */}
        <Header />

        {/* Nút quay lại luôn ở dưới header */}
        <div className="bg-white dark:bg-gray-800 shadow-md py-3 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto">
            <Link
              to="/homestays"
              className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <FaArrowLeft className="mr-2" />
              <span>Quay lại danh sách</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Gradient decorative background */}
      <div
        className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      {/* Phần nội dung - thêm padding-top đủ lớn để tránh bị che bởi header và nút quay lại cố định */}
      <div className="pt-32 pb-12">
        {/* Hiển thị trạng thái loading */}
        {loading && (
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          </div>
        )}

        {/* Hiển thị lỗi */}
        {error && (
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-red-500 dark:text-red-400 font-medium mb-4">{error}</div>
              <Link to="/homestays" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Quay lại trang danh sách homestay
              </Link>
            </div>
          </div>
        )}

        {/* Trường hợp không tìm thấy homestay */}
        {!loading && !error && !homestay && (
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-xl font-medium mb-4 text-gray-800 dark:text-gray-200">Không tìm thấy homestay</div>
              <Link to="/homestays" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Quay lại trang danh sách homestay
              </Link>
            </div>
          </div>
        )}

        {/* Nội dung chính */}
        {!loading && !error && homestay && (
          <>
            {/* Carousel hình ảnh */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="container mx-auto px-4 py-6">
                <ImageCarousel images={homestay.images} />
              </div>
            </div>

            {/* Nội dung chính */}
            <div className="container mx-auto px-4 py-8">
              {/* Thông tin homestay và đặt phòng */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cột thông tin chính */}
                <div className="lg:col-span-2">
                  {/* Tiêu đề và thông tin cơ bản */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {homestay.name}
                        </h1>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center text-amber-400">
                            <span className="text-lg font-semibold">{homestay.rating || '4.5'}</span>
                            <span className="ml-1">★</span>
                          </div>
                          <span className="text-gray-500 dark:text-gray-400">
                            ({homestay.reviewsCount || '0'} đánh giá)
                          </span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-gray-500 dark:text-gray-400 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {homestay.city}, {homestay.province || 'Lào Cai'}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{homestay.address}</p>
                      </div>

                      <div className="md:text-right">
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {new Intl.NumberFormat('vi-VN').format(homestay.price || 0)}đ
                          <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> /đêm</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <div className="inline-flex items-center bg-indigo-50 dark:bg-gray-700 px-3 py-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m-9 0a2 2 0 012-2v-6a2 2 0 012-2v6a2 2 0 012 2z" />
                        </svg>
                        <span className="text-sm text-indigo-600 dark:text-indigo-400">{homestay.type || 'Homestay'}</span>
                      </div>
                      <div className="inline-flex items-center bg-indigo-50 dark:bg-gray-700 px-3 py-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm text-indigo-600 dark:text-indigo-400">
                          {homestay.owner?.firstName} {homestay.owner?.lastName || 'Chủ homestay'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mô tả homestay */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Giới thiệu về chỗ ở</h2>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{homestay.description}</p>
                  </div>

                  {/* Tiện nghi */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Tiện nghi</h2>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-3">Cơ bản</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {(homestay.amenities?.includes('wifi') || homestay.amenities?.includes('Wifi')) && (
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.143 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">Wifi</span>
                          </div>
                        )}
                        {(homestay.amenities?.includes('air_conditioning') || homestay.amenities?.includes('điều hòa') || homestay.amenities?.includes('Điều hòa')) && (
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.25 21V3h1.5V21h-1.5zm-4.5 0V3h1.5v18h-1.5zM3 12.75h18v-1.5H3v1.5zm0-4.5h18v-1.5H3v1.5z" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">Điều hòa</span>
                          </div>
                        )}
                        {(homestay.amenities?.includes('tv') || homestay.amenities?.includes('TV')) && (
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">TV</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-3">Tiện ích</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {homestay.parking && (
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">Bãi đỗ xe</span>
                          </div>
                        )}
                        {(homestay.amenities?.includes('swimming_pool') || homestay.amenities?.includes('pool')) && (
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">Hồ bơi</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-3">Vị trí</h3>
                      <div className="flex items-start mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-1 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{homestay.city || 'Mộc Châu'}</div>
                          <div className="text-gray-600 dark:text-gray-400">{homestay.address}</div>
                        </div>
                      </div>

                      <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="relative pb-[60%] h-0">
                          <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118223.48670728855!2d104.50374507154306!3d20.835996008628583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313271231205f021%3A0xd836aff4c3ffb19a!2zTOG7mWMgQ2jDonUsIE3hu5ljIENow6J1LCBTxqFuIExh!5e0!3m2!1svi!2s!4v1647101348380!5m2!1svi!2s"
                            className="absolute top-0 left-0 w-full h-full"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Homestay location"
                          ></iframe>
                        </div>
                        <div className="py-2 px-3 bg-gray-50 dark:bg-gray-700">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(homestay.address || '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
                          >
                            <span>Xem bản đồ lớn hơn</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Vị trí chính xác sẽ được cung cấp sau khi đặt phòng.
                      </p>
                    </div>
                  </div>

                  {/* Chính sách */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Chính sách</h2>
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Nhận phòng / Trả phòng</h3>
                        <div className="flex flex-wrap gap-x-8 gap-y-2">
                          <div className="flex items-center text-gray-700 dark:text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 dark:text-amber-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Nhận phòng: <strong className="font-medium">14:00 - 22:00</strong></span>
                          </div>
                          <div className="flex items-center text-gray-700 dark:text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 dark:text-amber-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Trả phòng: <strong className="font-medium">Trước 12:00</strong></span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Hủy đặt phòng</h3>
                        <p className="text-gray-700 dark:text-gray-300">{homestay.cancellationPolicy || 'Không hoàn tiền khi hủy phòng. Liên hệ chủ homestay ít nhất 48 giờ trước để thảo luận về trường hợp đặc biệt.'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Hiển thị Section đánh giá hoặc thông báo không có */}
                  {reviewsError ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Đánh giá</h2>
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                          Không thể tải đánh giá cho homestay này. Vui lòng thử lại sau.
                        </p>
                      </div>
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Đánh giá</h2>
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                          Chưa có đánh giá nào cho homestay này.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <ReviewsSection
                      reviews={reviews}
                      meta={reviewMeta}
                      onLoadMore={handleLoadMoreReviews}
                      className="mb-8"
                    />
                  )}
                </div>

                {/* Sidebar với booking widget hoặc booking status */}
                <div className="lg:col-span-1">
                  <div className="lg:sticky lg:top-32">
                    {checkingBooking ? (
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 dark:border-gray-700 flex justify-center items-center h-80">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                      </div>
                    ) : existingBooking ? (
                      <BookingStatus
                        booking={existingBooking}
                        homestay={homestay}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 dark:border-gray-700"
                      />
                    ) : (
                      <BookingWidget
                        homestay={homestay}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 dark:border-gray-700"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Homestay tương tự hoặc thông báo không có */}
              {similarError ? (
                <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Homestay tương tự</h2>
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      Không thể tải homestay tương tự. Vui lòng thử lại sau.
                    </p>
                  </div>
                </div>
              ) : similarHomestays.length === 0 ? (
                <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Homestay tương tự</h2>
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      Không tìm thấy homestay tương tự.
                    </p>
                  </div>
                </div>
              ) : (
                <SimilarHomestays
                  homestays={similarHomestays}
                  className="mt-12"
                />
              )}
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default HomestayDetail;

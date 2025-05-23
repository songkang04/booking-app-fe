import React, { useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaDirections } from 'react-icons/fa';

/**
 * Component hiển thị bản đồ vị trí của homestay
 * @param {Object} props - Component props
 * @param {string} props.address - Địa chỉ homestay
 * @param {string} props.location - Tỉnh/thành phố
 * @param {string} props.className - className bổ sung
 */
const LocationMap = ({ address, location, className = '' }) => {
  const mapRef = useRef(null);
  const fullAddress = `${address}, ${location}, Việt Nam`;
  
  // URL mở Google Maps với địa chỉ được mã hóa
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  
  useEffect(() => {
    // Trong trường hợp thực tế, chúng ta sẽ tích hợp Google Maps API tại đây
    // Vì mục đích demo, chúng ta sẽ sử dụng iframe từ Google Maps
    
    // Tạo iframe Google Maps
    const iframe = document.createElement('iframe');
    iframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.frameBorder = '0';
    iframe.style.border = '0';
    iframe.allowFullscreen = true;
    
    // Thêm iframe vào div container
    if (mapRef.current) {
      mapRef.current.innerHTML = '';
      mapRef.current.appendChild(iframe);
    }
  }, [fullAddress]);

  return (
    <div className={`bg-white rounded-lg ${className}`}>
      <h2 className="text-xl font-bold mb-4">Vị trí</h2>
      
      <div className="mb-3">
        <div className="flex items-start">
          <FaMapMarkerAlt className="text-red-500 mt-1 mr-2 flex-shrink-0" />
          <div>
            <div className="font-medium">{location}</div>
            <div className="text-gray-600">{address}</div>
          </div>
        </div>
      </div>
      
      {/* Container cho bản đồ */}
      <div className="relative rounded-lg overflow-hidden" style={{ height: '300px' }}>
        <div ref={mapRef} className="w-full h-full bg-gray-200">
          {/* Iframe sẽ được thêm vào đây qua useEffect */}
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Đang tải bản đồ...</div>
          </div>
        </div>
        
        {/* Nút chỉ đường */}
        <a 
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-4 right-4 bg-white rounded-full px-4 py-2 shadow-md flex items-center"
        >
          <FaDirections className="text-blue-500 mr-2" />
          <span>Chỉ đường</span>
        </a>
      </div>
      
      <div className="mt-3 text-sm text-gray-600">
        Vị trí chính xác sẽ được cung cấp sau khi đặt phòng.
      </div>
    </div>
  );
};

export default LocationMap;

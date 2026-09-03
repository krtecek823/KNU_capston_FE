import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Tag } from 'lucide-react';
import { Hotel } from '../types';

interface HotelCardProps {
  hotel: Hotel;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const discountRate = Math.round(
    ((hotel.originalPrice - hotel.discountPrice) / hotel.originalPrice) * 100
  );

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Thumbnail Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {hotel.category}
        </div>
        <div className="absolute top-3 right-3 bg-red-600 text-white font-extrabold text-xs px-2 py-1 rounded-md shadow-md">
          {discountRate}% OFF
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mb-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{hotel.rating}</span>
            <span className="text-gray-400">({hotel.reviewCount.toLocaleString()})</span>
          </div>

          <h3 className="font-extrabold text-lg text-gray-900 line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {hotel.name}
          </h3>

          <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {hotel.location}
          </p>

          <div className="flex flex-wrap gap-1 mb-4">
            {hotel.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md flex items-center gap-1"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Price & Action */}
        <div className="pt-3 border-t border-gray-100 flex items-end justify-between mt-auto">
          <div>
            <span className="text-xs text-gray-400 line-through block">
              ₩{hotel.originalPrice.toLocaleString()}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-gray-900">
                ₩{hotel.discountPrice.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">/ 1박</span>
            </div>
          </div>

          <Link
            to={`/hotels/${hotel.id}`}
            className="bg-primary hover:bg-primary-container text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-colors"
          >
            상세보기
          </Link>
        </div>
      </div>
    </div>
  );
};

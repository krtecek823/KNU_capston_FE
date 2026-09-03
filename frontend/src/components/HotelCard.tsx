import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Tag, ShieldCheck } from 'lucide-react';
import { Hotel } from '../types';

interface HotelCardProps {
  hotel: Hotel;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const discountRate = Math.round(
    ((hotel.originalPrice - hotel.discountPrice) / hotel.originalPrice) * 100
  );

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
      {/* Thumbnail Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          {hotel.category}
        </div>
        <div className="absolute top-3 right-3 bg-rose-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-md">
          {discountRate}% 할인
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mb-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{hotel.rating}</span>
            <span className="text-slate-400 font-normal">({hotel.reviewCount.toLocaleString()}개 평가)</span>
          </div>

          <h3 className="font-extrabold text-base text-slate-900 line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors">
            {hotel.name}
          </h3>

          <p className="text-xs text-slate-500 flex items-center gap-1 mb-3 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {hotel.location}
          </p>

          <div className="flex flex-wrap gap-1 mb-4">
            {hotel.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md flex items-center gap-1"
              >
                <Tag className="w-2.5 h-2.5 text-slate-400" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Price & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-end justify-between mt-auto">
          <div>
            <span className="text-xs text-slate-400 line-through block font-medium">
              ₩{hotel.originalPrice.toLocaleString()}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">
                ₩{hotel.discountPrice.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ 1박</span>
            </div>
          </div>

          <Link
            to={`/hotels/${hotel.id}`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            객실 보기
          </Link>
        </div>
      </div>
    </div>
  );
};

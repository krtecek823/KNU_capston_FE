import React from 'react';

export const HotelCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
      {/* Aspect Ratio Image Skeleton */}
      <div className="w-full h-56 bg-slate-200"></div>
      
      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-slate-200 rounded w-24"></div>
          <div className="h-4 bg-slate-200 rounded w-12"></div>
        </div>
        
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>

        {/* Tags */}
        <div className="flex gap-1.5 pt-2">
          <div className="h-6 bg-slate-200 rounded-lg w-16"></div>
          <div className="h-6 bg-slate-200 rounded-lg w-16"></div>
          <div className="h-6 bg-slate-200 rounded-lg w-16"></div>
        </div>

        {/* Price Skeleton */}
        <div className="pt-3 flex justify-between items-end border-t border-slate-50">
          <div className="h-3 bg-slate-200 rounded w-20"></div>
          <div className="h-7 bg-slate-200 rounded w-28"></div>
        </div>
      </div>
    </div>
  );
};

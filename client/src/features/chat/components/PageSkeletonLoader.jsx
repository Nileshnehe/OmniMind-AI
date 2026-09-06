import React from 'react';
import { Skeleton } from './skeleton'; // Shadcn skeleton import (path check kar lena)

export const PageSkeletonLoader = () => {
  return (
    // Main Container: Mobile par column (flex-col), Laptop par 50-50 (lg:flex-row)
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#0b0f19]">
      
      {/* --- LEFT SIDE: Branding & Text Skeleton --- */}
      <div className="flex flex-1 flex-col items-center justify-center p-8 lg:border-r lg:border-gray-800 lg:p-24">
        {/* Title Skeleton */}
        <Skeleton className="mb-6 h-12 w-64 rounded-lg bg-slate-800/60" />
        {/* Subtitle Skeletons (3 lines) */}
        <div className="flex w-full max-w-md flex-col items-center space-y-3">
          <Skeleton className="h-4 w-full bg-slate-800/50" />
          <Skeleton className="h-4 w-5/6 bg-slate-800/50" />
          <Skeleton className="h-4 w-4/6 bg-slate-800/50" />
        </div>
      </div>

      {/* --- RIGHT SIDE: Login Card Skeleton --- */}
      <div className="flex flex-1 items-center justify-center p-4 lg:p-8">
        {/* Card Container */}
        <div className="w-full max-w-md rounded-xl border border-gray-800 bg-[#121620] p-8 shadow-2xl">
          
          {/* Card Header ("Welcome Back") */}
          <div className="mb-8 space-y-3">
            <Skeleton className="h-8 w-48 bg-slate-700/60" />
            <Skeleton className="h-4 w-64 bg-slate-700/40" />
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 bg-slate-700/50" /> {/* Label */}
              <Skeleton className="h-12 w-full rounded-lg bg-slate-800/60" /> {/* Input box */}
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24 bg-slate-700/50" /> {/* Label */}
                <Skeleton className="h-4 w-28 bg-slate-700/50" /> {/* Forgot pass */}
              </div>
              <Skeleton className="h-12 w-full rounded-lg bg-slate-800/60" /> {/* Input box */}
            </div>

            {/* Submit Button Skeleton (Thoda primary color ka hint) */}
            <Skeleton className="mt-6 h-12 w-full rounded-lg bg-indigo-600/20" />

            {/* Footer Text */}
            <div className="mt-6 flex justify-center">
              <Skeleton className="h-4 w-56 bg-slate-700/40" />
            </div>
            
          </div>
        </div>
      </div>

    </div>
  );
};
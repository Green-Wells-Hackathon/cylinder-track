import React from 'react';

function AnimatedStatCard({ title, value, percentage, percentageColorClass }) {
  // Determine if the percentage is positive, negative, or neutral
  const isPositive = percentage && percentage.startsWith('+');
  const isNegative = percentage && percentage.startsWith('-');
  const hasPercentage = percentage && (isPositive || isNegative || percentage.length > 0);

  return (
    // MODIFICATION: Changed w-60 to w-full to allow it to fill grid columns
    <div className="w-full max-w-full translate-y-5 opacity-0 animate-[cardFadeUp_0.8s_cubic-bezier(0.25,1,0.5,1)_forwards] p-6 rounded-[28px] bg-gradient-to-b from-white to-[#f9f9f9] shadow-sm">
      {/* MODIFICATION: Added flex-wrap for cases where title and percentage are long */}
      <div className="flex items-center justify-between flex-wrap">
        <p className="text-[#1c1c1e] text-[19px] font-semibold tracking-[-0.02em]">{title}</p>
        
        {/* MODIFICATION: Only render this block if 'percentage' is not empty */}
        {hasPercentage && (
          <p className={`percent ${percentageColorClass} font-semibold flex items-center text-[15px] ml-2`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              height="16"
              width="16"
              className="mr-1"
            >
              {isPositive && (
                <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.03 10.03a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l5.25 5.25a.75.75 0 11-1.06 1.06L10.75 5.612V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
              )}
              {isNegative && (
                <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l4.22-4.42a.75.75 0 111.06 1.06l-5.25 5.25a.75.75 0 01-1.06 0L4.72 10.03a.75.75 0 011.06-1.06l4.22 4.42V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
              )}
              {(!isPositive && !isNegative) && (
                <path fillRule="evenodd" d="M3.75 9.75a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
              )}
            </svg>
            {percentage}
          </p>
        )}
      </div>
      <div className="flex flex-col justify-start">
        <p className='text-gray-900 text-[2.4rem] leading-[2.7rem] font-bold text-left tracking-[-0.03em] opacity-0 animate-[fadeIn_0.8s_ease_forwards_0.3s] my-5'>{value}</p>
      </div>
    </div>
  );
}

export default AnimatedStatCard;
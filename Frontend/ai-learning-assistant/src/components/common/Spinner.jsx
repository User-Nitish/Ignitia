import React from 'react';

const Spinner = () => {
    return (
    <div className="flex items-center justify-center relative w-16 h-16">
      {/* Outer Ring */}
      <div className="absolute inset-0 border-2 border-[#6dadbe]/10 rounded-full" />
      
      {/* Scanning Ring 1 */}
      <div className="absolute inset-2 border-[1.5px] border-t-[#6dadbe] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-[spin_1.5s_linear_infinite]" />
      
      {/* Scanning Ring 2 */}
      <div className="absolute inset-4 border-[1.5px] border-b-[#12768a] border-t-transparent border-r-transparent border-l-transparent rounded-full animate-[spin_2s_linear_reverse_infinite]" />
      
      {/* Center Pulse */}
      <div className="w-2 h-2 bg-[#6dadbe] rounded-full animate-pulse shadow-[0_0_15px_rgba(109,173,190,0.8)]" />
      
      {/* Decorative Bits */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-3 bg-[#6dadbe]/20 rounded-full" />
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-3 bg-[#6dadbe]/20 rounded-full" />
    </div>
  );
};


export default Spinner;
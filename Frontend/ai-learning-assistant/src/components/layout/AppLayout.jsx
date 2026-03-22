import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ParticleBackground from "./ParticleBackground";
import CustomCursor from "./CustomCursor";
import Lenis from 'lenis';

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: scrollRef.current.firstElementChild,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#030a0a] text-slate-100 font-sans selection:bg-[#6dadbe]/30 selection:text-[#cedadb] relative overflow-hidden">      
      <CustomCursor />
      <ParticleBackground />

      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        <Header toggleSidebar={toggleSidebar} />
        <main ref={scrollRef} className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
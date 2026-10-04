import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

export const DashboardLayout: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#000000] text-white font-sans antialiased selection:bg-[#0052FF] selection:text-white">
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-[#000000]">
        <Navbar onToggleMobileMenu={() => setMobileNavOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#000000] scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

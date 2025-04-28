import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer.tsx';

/**
 * Layout component that wraps all pages with common elements
 * Provides consistent structure across the application
 */
const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
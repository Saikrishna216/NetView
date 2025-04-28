import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer component with links and copyright information
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-netflix-black-lighter py-8 mt-8 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-gray-400 font-medium mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-500 hover:text-white transition">Home</Link></li>
              <li><Link to="/search" className="text-gray-500 hover:text-white transition">Search</Link></li>
              <li><Link to="/profile" className="text-gray-500 hover:text-white transition">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-400 font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-white transition">Terms of Use</a></li>
              <li><a href="#" className="text-gray-500 hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-white transition">Cookie Preferences</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-400 font-medium mb-4">Help</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="text-gray-500 hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-white transition">Account</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-400 font-medium mb-4">About</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-white transition">About NetView</a></li>
              <li><a href="#" className="text-gray-500 hover:text-white transition">Careers</a></li>
              <li><a href="#" className="text-gray-500 hover:text-white transition">Press</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-800">
          <p className="text-gray-500 text-center">
            &copy; {new Date().getFullYear()} NetView. This is a demo project. Not associated with Netflix.
          </p>
          <p className="text-gray-600 text-center mt-2 text-sm">
            Movie data provided by OMDb API
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
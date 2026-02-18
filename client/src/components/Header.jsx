import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-gradient-primary shadow-xl">
      <div className="glass-dark">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="group">
              <h1 className="text-2xl md:text-3xl font-bold gradient-text-accent hover:scale-105 transition-transform duration-300" 
                  style={{ 
                    background: 'linear-gradient(135deg, #ffffff 0%, #d8b4fe 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                KnowHowTech
              </h1>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-2 md:gap-6">
              <Link 
                to="/" 
                className={`relative px-4 py-2 font-semibold text-sm md:text-base rounded-lg transition-all duration-300 ${
                  isActive('/') 
                    ? 'text-white bg-white bg-opacity-20' 
                    : 'text-purple-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                Home
                {isActive('/') && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-accent rounded-full"></span>
                )}
              </Link>
              
              <Link 
                to="/chat" 
                className={`relative px-4 py-2 font-semibold text-sm md:text-base rounded-lg transition-all duration-300 ${
                  isActive('/chat') 
                    ? 'text-white bg-white bg-opacity-20' 
                    : 'text-purple-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                Chat
                {isActive('/chat') && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-accent rounded-full"></span>
                )}
              </Link>
              
              <Link 
                to="/recommendations" 
                className={`relative px-4 py-2 font-semibold text-sm md:text-base rounded-lg transition-all duration-300 ${
                  isActive('/recommendations') 
                    ? 'text-white bg-white bg-opacity-20' 
                    : 'text-purple-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                Products
                {isActive('/recommendations') && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-accent rounded-full"></span>
                )}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

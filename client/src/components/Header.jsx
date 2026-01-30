import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 text-center">
      <h1 className="text-xl font-bold">KnowHowTech</h1>
      <nav>
        <Link to="/" className="mr-4">Home</Link>
        <Link to="/chat" className="mr-4">Chat</Link>
        <Link to="/recommendations">Recommendations</Link>
      </nav>
    </header>
  );
};

export default Header;
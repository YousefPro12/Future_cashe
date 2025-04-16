import React from 'react';
import blue_logo from '../assets/img/blue_logo.png';
import orange_logo from '../assets/img/orange_logo.png';
import '../assets/css/themes.css';

/**
 * Logo component displays the Lightcash logo
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Size variant (sm, md, lg)
 */
const Logo = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-6',
    medium: 'h-8',
    large: 'h-10',
  };

  const heightClass = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className="logo-container">
      <img
        src={blue_logo}
        alt="Blue Logo"
        className={`theme-blue-logo ${heightClass}`}
      />
      <img
        src={orange_logo}
        alt="Orange Logo"
        className={`theme-red-logo ${heightClass}`}
      />
    </div>
  );
};

export default Logo; 
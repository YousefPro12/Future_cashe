import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Reusable Popup component that can be used throughout the application
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the popup is open
 * @param {function} props.onClose - Function to call when the popup is closed
 * @param {React.ReactNode} props.children - Content to display in the popup
 * @param {string} props.title - Title of the popup
 * @param {string} props.size - Size of the popup (sm, md, lg, xl)
 * @param {boolean} props.closeOnOutsideClick - Whether to close the popup when clicking outside
 * @param {boolean} props.showCloseButton - Whether to show the close button
 * @param {string} props.animation - Animation style ('fade', 'zoom', 'slide')
 */
const Popup = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  closeOnOutsideClick = true,
  showCloseButton = true,
  animation = 'zoom',
}) => {
  const popupRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Handle animation states when opening/closing
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to ensure DOM is ready for animation
      setTimeout(() => {
        setIsAnimating(true);
      }, 100);
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before hiding
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Match this with CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (isOpen && event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (closeOnOutsideClick && popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose, closeOnOutsideClick]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-full',
  };

  // Animation classes based on animation type
  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-300 ease-in-out';
    
    switch (animation) {
      case 'fade':
        return `${baseClasses} ${isAnimating ? 'opacity-100' : 'opacity-0'}`;
      case 'slide':
        return `${baseClasses} ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;
      case 'zoom':
      default:
        return `${baseClasses} ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`;
    }
  };

  if (!isVisible) return null;

  return createPortal(
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      } bg-black/50 backdrop-blur-sm`}
    >
      <div 
        ref={popupRef}
        className={`${sizeClasses[size]} ${getAnimationClasses()} w-full bg-card rounded-lg shadow-xl border border-border p-4 m-4 max-h-[90vh] overflow-auto`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "popup-title" : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-border">
            {title && <h2 id="popup-title" className="text-xl font-semibold">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="popup-content">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Popup;
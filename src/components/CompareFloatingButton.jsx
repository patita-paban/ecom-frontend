// CompareFloatingButton.jsx - Floating Compare Access Button
import React, { useState, useEffect } from 'react';
import { FaBalanceScale, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CompareFloatingButton = () => {
  const [compareCount, setCompareCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial count
    updateCompareCount();

    // Listen for comparison updates
    const handleComparisonUpdate = () => {
      updateCompareCount();
    };

    window.addEventListener('comparisonUpdated', handleComparisonUpdate);
    window.addEventListener('storage', handleComparisonUpdate);

    return () => {
      window.removeEventListener('comparisonUpdated', handleComparisonUpdate);
      window.removeEventListener('storage', handleComparisonUpdate);
    };
  }, []);

  const updateCompareCount = () => {
    const savedComparison = JSON.parse(localStorage.getItem('compareProducts') || '[]');
    setCompareCount(savedComparison.length);
    setIsVisible(savedComparison.length > 0);
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    localStorage.removeItem('compareProducts');
    setCompareCount(0);
    setIsVisible(false);
    window.dispatchEvent(new CustomEvent('comparisonUpdated'));
  };

  const goToComparison = () => {
    navigate('/compare');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40 animate-slideUp">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-2xl overflow-hidden">
        <div
          onClick={goToComparison}
          className="flex items-center gap-3 p-4 cursor-pointer hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          <div className="relative">
            <FaBalanceScale className="text-2xl" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {compareCount}
            </span>
          </div>
          <div>
            <div className="font-bold text-sm">Compare Products</div>
            <div className="text-xs text-indigo-100">
              {compareCount} product{compareCount > 1 ? 's' : ''} selected
            </div>
          </div>
        </div>
        <button
          onClick={handleClearAll}
          className="w-full bg-red-500 hover:bg-red-600 text-white text-xs py-2 font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <FaTimes size={10} />
          Clear All
        </button>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CompareFloatingButton;

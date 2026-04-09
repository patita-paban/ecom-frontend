// CompareButton.jsx - Add to Compare Button Component
import React, { useState, useEffect } from 'react';
import { FaBalanceScale, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CompareButton = ({ productId, className = '' }) => {
  const [isInComparison, setIsInComparison] = useState(false);
  const [compareCount, setCompareCount] = useState(0);

  useEffect(() => {
    checkComparisonStatus();
  }, [productId]);

  const checkComparisonStatus = () => {
    const savedComparison = JSON.parse(localStorage.getItem('compareProducts') || '[]');
    setIsInComparison(savedComparison.includes(productId));
    setCompareCount(savedComparison.length);
  };

  const toggleComparison = () => {
    let savedComparison = JSON.parse(localStorage.getItem('compareProducts') || '[]');

    if (isInComparison) {
      // Remove from comparison
      savedComparison = savedComparison.filter(id => id !== productId);
      localStorage.setItem('compareProducts', JSON.stringify(savedComparison));
      setIsInComparison(false);
      setCompareCount(savedComparison.length);
      toast.info('Product removed from comparison');
    } else {
      // Add to comparison (max 4 products)
      if (savedComparison.length >= 4) {
        toast.warning('Maximum 4 products can be compared at once. Please remove one first.');
        return;
      }
      
      savedComparison.push(productId);
      localStorage.setItem('compareProducts', JSON.stringify(savedComparison));
      setIsInComparison(true);
      setCompareCount(savedComparison.length);
      toast.success('Product added to comparison!');
    }

    // Trigger custom event to update comparison page if open
    window.dispatchEvent(new CustomEvent('comparisonUpdated'));
  };

  return (
    <button
      onClick={toggleComparison}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
        isInComparison
          ? 'bg-green-500 text-white hover:bg-green-600'
          : 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
      } ${className}`}
      title={isInComparison ? 'Remove from comparison' : 'Add to comparison'}
    >
      {isInComparison ? <FaCheck /> : <FaBalanceScale />}
      <span className="hidden sm:inline">
        {isInComparison ? 'In Comparison' : 'Compare'}
      </span>
    </button>
  );
};

export default CompareButton;

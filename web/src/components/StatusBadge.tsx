/**
 * TODO: Implement Tailwind status badge
 * - Statuses: 'pending' | 'in-progress' | 'completed' | 'failed'
 * - Distinct colors, accessible (role/aria-label), contrast ≥ 4.5:1
 */
import React from 'react'

interface StatusBadgeProps {
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusClasses = (status: string) => {
    const baseClasses = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'pending':
        // Yellow with high contrast 
        return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-300`;
      case 'in-progress':
        // Blue with high contrast
        return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-300`;
      case 'completed':
        // Green with high contrast 
        return `${baseClasses} bg-green-100 text-green-800 border border-green-300`;
      case 'failed':
        // Red with high contrast
        return `${baseClasses} bg-red-100 text-red-800 border border-red-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-300`;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getAriaLabel = (status: string) => {
    return `Status: ${getStatusText(status)}`;
  };

  return (
    <span
      className={`${getStatusClasses(status)} ${className}`}
      role="status"
      aria-label={getAriaLabel(status)}
    >
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge;

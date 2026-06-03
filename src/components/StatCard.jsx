import React from 'react';
import PropTypes from 'prop-types';

function StatCard({ label, value, icon, loading, error }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-6 min-w-[140px] min-h-[120px]">
      <div className="flex items-center justify-center mb-2 h-8 w-8 text-blue-500">
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-800 mb-1">
        {loading ? (
          <span className="block w-12 h-6 bg-gray-200 animate-pulse rounded" />
        ) : error ? (
          <span className="text-red-500 text-base">—</span>
        ) : (
          value
        )}
      </div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.node,
  loading: PropTypes.bool,
  error: PropTypes.bool
};

StatCard.defaultProps = {
  value: '',
  icon: null,
  loading: false,
  error: false
};

export default StatCard;
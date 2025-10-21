import React, { useState } from 'react';
import ComDetailPanel from './ComDetailPanel';
import comsData from '@/data/coms.json';

function Coms() {
  const [selectedCom, setSelectedCom] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    urgency: 'All',
    status: 'All'
  });

  const filterOptions = {
    urgency: ['All', 'High', 'Medium', 'Low'],
    status: ['All', 'In Progress', 'Pending Response', 'Resolved', 'Blocked']
  };

  const filteredComs = comsData.filter(com => {
    return (
      (activeFilters.urgency === 'All' || com.urgency === activeFilters.urgency) &&
      (activeFilters.status === 'All' || com.status === activeFilters.status)
    );
  });

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  if (selectedCom) {
    return <ComDetailPanel com={selectedCom} onBack={() => setSelectedCom(null)} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-4">
          {Object.entries(filterOptions).map(([filterType, options]) => (
            <div key={filterType} className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 capitalize">
                {filterType}:
              </label>
              <select
                value={activeFilters[filterType]}
                onChange={(e) => handleFilterChange(filterType, e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Coms List */}
      <div className="divide-y divide-gray-200">
        {filteredComs.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No communications match the selected filters
          </div>
        ) : (
          filteredComs.map(com => (
            <div
              key={com.id}
              onClick={() => setSelectedCom(com)}
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {com.subject}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      com.urgency === 'High' ? 'bg-red-100 text-red-700' :
                      com.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {com.urgency}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      com.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      com.status === 'Pending Response' ? 'bg-yellow-100 text-yellow-700' :
                      com.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {com.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {com.summary}
                  </p>
                </div>
                <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                  {com.timestamp}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{com.threads.length} email thread{com.threads.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span>{com.todos.filter(t => t.status === 'pending').length} pending TODO{com.todos.filter(t => t.status === 'pending').length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Coms;

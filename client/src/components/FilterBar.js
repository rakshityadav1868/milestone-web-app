import React from 'react';
import { Filter, SortAsc, SortDesc } from 'lucide-react';

const FilterBar = ({ filter, setFilter, sortBy, setSortBy, totalMilestones, filteredCount }) => {
  const filterOptions = [
    { value: 'all', label: 'All Milestones' },
    { value: 'recent', label: 'Recent (7 days)' },
    { value: 'pull_request', label: 'Pull Requests' },
    { value: 'star', label: 'Stars' },
    { value: 'issue', label: 'Issues' },
    { value: 'commit', label: 'Commits' },
    { value: 'contribution_days', label: 'Contribution Days' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: SortDesc },
    { value: 'oldest', label: 'Oldest First', icon: SortAsc },
    { value: 'count', label: 'Highest Count', icon: SortDesc }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort:</span>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredCount} of {totalMilestones} milestones
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

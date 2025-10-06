import React, { useState } from 'react';

const ReviewTable = ({ reviews }) => {
    const [sortField, setSortField] = useState('score');
    const [sortDirection, setSortDirection] = useState('desc');
    const [filterSentiment, setFilterSentiment] = useState('all');

    const getSentimentColor = (label) => {
        switch (label) {
            case 'positive':
                return 'bg-green-100 text-green-800';
            case 'negative':
                return 'bg-red-100 text-red-800';
            case 'neutral':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getScoreColor = (score) => {
        if (score > 2) return 'text-green-600';
        if (score < -2) return 'text-red-600';
        return 'text-yellow-600';
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const filteredAndSortedReviews = reviews
        .filter(review => filterSentiment === 'all' || review.label === filterSentiment)
        .sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];

            if (sortField === 'text') {
                aVal = aVal?.length || 0;
                bVal = bVal?.length || 0;
            }

            if (sortDirection === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        })
        .slice(0, 20); // Show top 20 reviews

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Filter by Sentiment
                    </label>
                    <select
                        value={filterSentiment}
                        onChange={(e) => setFilterSentiment(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Sentiments</option>
                        <option value="positive">Positive</option>
                        <option value="negative">Negative</option>
                        <option value="neutral">Neutral</option>
                    </select>
                </div>
                
                <div className="text-sm text-gray-500">
                    Showing {filteredAndSortedReviews.length} of {reviews.length} reviews
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('id')}
                            >
                                ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('label')}
                            >
                                Sentiment {sortField === 'label' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('score')}
                            >
                                Score {sortField === 'score' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('text')}
                            >
                                Review Text {sortField === 'text' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAndSortedReviews.map((review) => (
                            <tr key={review.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {review.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {review.product_name || 'N/A'}
                                        </div>
                                        <div className="text-gray-500">
                                            {review.product_id || 'N/A'}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSentimentColor(review.label)}`}>
                                        {review.label}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`font-medium ${getScoreColor(review.score)}`}>
                                        {review.score}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                    <div className="truncate" title={review.text}>
                                        {review.text}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredAndSortedReviews.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No reviews found for the selected filter.
                </div>
            )}
        </div>
    );
};

export default ReviewTable;

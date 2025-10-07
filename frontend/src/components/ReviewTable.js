import React, { useState } from "react";

const ReviewTable = ({ reviews }) => {
    const [sortField, setSortField] = useState("score");
    const [sortDirection, setSortDirection] = useState("desc");
    const [filterSentiment, setFilterSentiment] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 50;

    const getSentimentColor = (label) => {
        switch (label) {
            case "positive":
                return "bg-green-100 text-green-800";
            case "negative":
                return "bg-red-100 text-red-800";
            case "neutral":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getScoreColor = (score) => {
        if (score > 2) return "text-green-600";
        if (score < -2) return "text-red-600";
        return "text-yellow-600";
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
    };

    const filteredAndSortedReviews = reviews
        .filter((review) => filterSentiment === "all" || review.label === filterSentiment)
        .sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];

            if (sortField === "text") {
                aVal = aVal?.length || 0;
                bVal = bVal?.length || 0;
            }

            if (sortDirection === "asc") {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

    // Pagination calculations
    const totalPages = Math.ceil(filteredAndSortedReviews.length / reviewsPerPage);
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    const paginatedReviews = filteredAndSortedReviews.slice(startIndex, endIndex);

    // Reset to page 1 when filter changes
    const handleFilterChange = (sentiment) => {
        setFilterSentiment(sentiment);
        setCurrentPage(1);
    };

    // Pagination component (reusable for top and bottom)
    const PaginationControls = () => (
        <div className="flex items-center justify-between border-t border-b py-3">
            <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} • Showing {startIndex + 1}-
                {Math.min(endIndex, filteredAndSortedReviews.length)} of{" "}
                {filteredAndSortedReviews.length} reviews
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 text-sm border rounded ${
                        currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    First
                </button>
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 text-sm border rounded ${
                        currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    Previous
                </button>

                {/* Page numbers */}
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                        pageNum = i + 1;
                    } else if (currentPage <= 3) {
                        pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                    } else {
                        pageNum = currentPage - 2 + i;
                    }

                    return (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 text-sm border rounded ${
                                currentPage === pageNum
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}

                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 text-sm border rounded ${
                        currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    Next
                </button>
                <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 text-sm border rounded ${
                        currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    Last
                </button>
            </div>
        </div>
    );

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
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Sentiments</option>
                        <option value="positive">Positive</option>
                        <option value="negative">Negative</option>
                        <option value="neutral">Neutral</option>
                    </select>
                </div>
            </div>

            {/* Top Pagination */}
            {totalPages > 1 && <PaginationControls />}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("id")}
                            >
                                ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("label")}
                            >
                                Sentiment{" "}
                                {sortField === "label" && (sortDirection === "asc" ? "↑" : "↓")}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("score")}
                            >
                                Score{" "}
                                {sortField === "score" && (sortDirection === "asc" ? "↑" : "↓")}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("text")}
                            >
                                Review Text{" "}
                                {sortField === "text" && (sortDirection === "asc" ? "↑" : "↓")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedReviews.map((review) => (
                            <tr key={review.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {review.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {review.product_name || "N/A"}
                                        </div>
                                        <div className="text-gray-500">
                                            {review.product_id || "N/A"}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSentimentColor(
                                            review.label
                                        )}`}
                                    >
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

            {/* Bottom Pagination */}
            {totalPages > 1 && <PaginationControls />}
        </div>
    );
};

export default ReviewTable;

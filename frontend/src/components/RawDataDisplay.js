import React, { useState } from 'react';

const RawDataDisplay = ({ data }) => {
    const [expandedSections, setExpandedSections] = useState({
        summary: false,
        reviews: false,
        keywords: false,
        fileInfo: false
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const formatJSON = (obj) => {
        return JSON.stringify(obj, null, 2);
    };

    return (
        <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
                This is the raw JSON response from the API. Use this for debugging and verification.
            </div>

            {/* File Info */}
            <div className="border border-gray-200 rounded-lg">
                <button
                    onClick={() => toggleSection('fileInfo')}
                    className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t-lg"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">File Information</h3>
                        <svg 
                            className={`w-5 h-5 transform transition-transform ${expandedSections.fileInfo ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>
                {expandedSections.fileInfo && (
                    <div className="p-4 bg-white">
                        <pre className="text-sm text-gray-800 overflow-x-auto">
                            {formatJSON(data.data.file_info)}
                        </pre>
                    </div>
                )}
            </div>

            {/* Summary */}
            <div className="border border-gray-200 rounded-lg">
                <button
                    onClick={() => toggleSection('summary')}
                    className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t-lg"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">Summary & Metrics</h3>
                        <svg 
                            className={`w-5 h-5 transform transition-transform ${expandedSections.summary ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>
                {expandedSections.summary && (
                    <div className="p-4 bg-white">
                        <pre className="text-sm text-gray-800 overflow-x-auto">
                            {formatJSON(data.data.summary)}
                        </pre>
                    </div>
                )}
            </div>

            {/* Keywords */}
            <div className="border border-gray-200 rounded-lg">
                <button
                    onClick={() => toggleSection('keywords')}
                    className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t-lg"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">Keyword Analysis</h3>
                        <svg 
                            className={`w-5 h-5 transform transition-transform ${expandedSections.keywords ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>
                {expandedSections.keywords && (
                    <div className="p-4 bg-white">
                        <pre className="text-sm text-gray-800 overflow-x-auto">
                            {formatJSON(data.data.keywords)}
                        </pre>
                    </div>
                )}
            </div>

            {/* Reviews */}
            <div className="border border-gray-200 rounded-lg">
                <button
                    onClick={() => toggleSection('reviews')}
                    className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t-lg"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">
                            Reviews Data ({data.data.reviews.length} reviews)
                        </h3>
                        <svg 
                            className={`w-5 h-5 transform transition-transform ${expandedSections.reviews ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>
                {expandedSections.reviews && (
                    <div className="p-4 bg-white">
                        <div className="mb-4 text-sm text-gray-600">
                            Showing first 5 reviews. Full dataset contains {data.data.reviews.length} reviews.
                        </div>
                        <pre className="text-sm text-gray-800 overflow-x-auto">
                            {formatJSON(data.data.reviews.slice(0, 5))}
                        </pre>
                    </div>
                )}
            </div>

            {/* Full Response */}
            <div className="border border-gray-200 rounded-lg">
                <button
                    onClick={() => toggleSection('fullResponse')}
                    className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t-lg"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">Complete API Response</h3>
                        <svg 
                            className={`w-5 h-5 transform transition-transform ${expandedSections.fullResponse ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>
                {expandedSections.fullResponse && (
                    <div className="p-4 bg-white">
                        <pre className="text-sm text-gray-800 overflow-x-auto max-h-96">
                            {formatJSON(data)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RawDataDisplay;

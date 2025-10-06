import React, { useState } from 'react';
import FileUpload from './FileUpload';
import SentimentChart from './SentimentChart';
import ReviewTable from './ReviewTable';
import KeywordAnalysis from './KeywordAnalysis';
import RawDataDisplay from './RawDataDisplay';

const Dashboard = () => {
    const [analysisData, setAnalysisData] = useState(null);
    const [error, setError] = useState(null);
    const [showRawData, setShowRawData] = useState(false);

    const handleAnalysisComplete = (data) => {
        setAnalysisData(data);
        setError(null);
        console.log('Analysis completed:', data);
    };

    const handleError = (errorMessage) => {
        setError(errorMessage);
        setAnalysisData(null);
    };

    const resetAnalysis = () => {
        setAnalysisData(null);
        setError(null);
        setShowRawData(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Product Review Sentiment Dashboard
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Upload your review data and get instant sentiment insights
                            </p>
                        </div>
                        {analysisData && (
                            <button
                                onClick={resetAnalysis}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                New Analysis
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!analysisData ? (
                    /* Upload Section */
                    <div className="space-y-8">
                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                                        <p className="text-sm text-red-700 mt-1">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* File Upload Component */}
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <FileUpload 
                                onAnalysisComplete={handleAnalysisComplete}
                                onError={handleError}
                            />
                        </div>

                        {/* Sample Data Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">Sample Data Available</h3>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Use the sample data file at <code className="bg-blue-100 px-1 rounded">data/sample_reviews.csv</code> to test the dashboard.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Analysis Results */
                    <div className="space-y-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Total Reviews</p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {analysisData.data.summary.total_reviews}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Positive Sentiment</p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {analysisData.data.summary.sentiment_distribution.positive.percentage}%
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Average Score</p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {analysisData.data.summary.average_score}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sentiment Chart */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sentiment Distribution</h2>
                            <SentimentChart data={analysisData.data.summary.sentiment_distribution} />
                        </div>

                        {/* Keyword Analysis */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Keyword Analysis</h2>
                            <KeywordAnalysis keywords={analysisData.data.keywords} />
                        </div>

                        {/* Review Table */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Analysis</h2>
                            <ReviewTable reviews={analysisData.data.reviews} />
                        </div>

                        {/* Raw Data Toggle */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Raw Analysis Data</h2>
                                <button
                                    onClick={() => setShowRawData(!showRawData)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {showRawData ? 'Hide' : 'Show'} Raw Data
                                </button>
                            </div>
                            {showRawData && (
                                <RawDataDisplay data={analysisData} />
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;

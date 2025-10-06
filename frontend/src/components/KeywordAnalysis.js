import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const KeywordAnalysis = ({ keywords }) => {
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900">{data.term}</p>
                    <p className="text-sm text-gray-600">Count: {data.count}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Overall Keywords */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Top Keywords Overall</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={keywords.overall.slice(0, 10)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="term" 
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                            />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" fill="#3B82F6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Keywords by Sentiment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Positive Keywords */}
                <div>
                    <h4 className="text-md font-medium text-green-800 mb-3">Positive Keywords</h4>
                    <div className="space-y-2">
                        {keywords.by_sentiment.positive.map((keyword, index) => (
                            <div key={index} className="flex justify-between items-center bg-green-50 p-2 rounded">
                                <span className="text-sm text-green-800">{keyword.term}</span>
                                <span className="text-sm font-medium text-green-600">{keyword.count}</span>
                            </div>
                        ))}
                        {keywords.by_sentiment.positive.length === 0 && (
                            <p className="text-sm text-gray-500">No positive keywords found</p>
                        )}
                    </div>
                </div>

                {/* Negative Keywords */}
                <div>
                    <h4 className="text-md font-medium text-red-800 mb-3">Negative Keywords</h4>
                    <div className="space-y-2">
                        {keywords.by_sentiment.negative.map((keyword, index) => (
                            <div key={index} className="flex justify-between items-center bg-red-50 p-2 rounded">
                                <span className="text-sm text-red-800">{keyword.term}</span>
                                <span className="text-sm font-medium text-red-600">{keyword.count}</span>
                            </div>
                        ))}
                        {keywords.by_sentiment.negative.length === 0 && (
                            <p className="text-sm text-gray-500">No negative keywords found</p>
                        )}
                    </div>
                </div>

                {/* Neutral Keywords */}
                <div>
                    <h4 className="text-md font-medium text-yellow-800 mb-3">Neutral Keywords</h4>
                    <div className="space-y-2">
                        {keywords.by_sentiment.neutral.map((keyword, index) => (
                            <div key={index} className="flex justify-between items-center bg-yellow-50 p-2 rounded">
                                <span className="text-sm text-yellow-800">{keyword.term}</span>
                                <span className="text-sm font-medium text-yellow-600">{keyword.count}</span>
                            </div>
                        ))}
                        {keywords.by_sentiment.neutral.length === 0 && (
                            <p className="text-sm text-gray-500">No neutral keywords found</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Keyword Cloud (Simple) */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Keyword Cloud</h3>
                <div className="flex flex-wrap gap-2">
                    {keywords.overall.slice(0, 20).map((keyword, index) => {
                        const size = Math.max(12, Math.min(24, keyword.count * 2));
                        return (
                            <span
                                key={index}
                                className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                                style={{ fontSize: `${size}px` }}
                                title={`Count: ${keyword.count}`}
                            >
                                {keyword.term}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default KeywordAnalysis;

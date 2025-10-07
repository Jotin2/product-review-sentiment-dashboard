import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const KeywordAnalysis = ({ keywords }) => {
    const createMultiSentimentData = () => {
        const positiveKeywords = keywords?.by_sentiment?.positive || [];
        const negativeKeywords = keywords?.by_sentiment?.negative || [];
        const neutralKeywords = keywords?.by_sentiment?.neutral || [];

        // Get all unique keywords
        const allKeywords = new Set();
        [...positiveKeywords, ...negativeKeywords, ...neutralKeywords].forEach((k) =>
            allKeywords.add(k.term)
        );

        // Create data with counts for each sentiment
        const multiSentimentData = Array.from(allKeywords)
            .map((term) => {
                const positiveCount = positiveKeywords.find((k) => k.term === term)?.count || 0;
                const negativeCount = negativeKeywords.find((k) => k.term === term)?.count || 0;
                const neutralCount = neutralKeywords.find((k) => k.term === term)?.count || 0;
                const totalCount = positiveCount + negativeCount + neutralCount;

                return {
                    term,
                    positive: positiveCount,
                    negative: negativeCount,
                    neutral: neutralCount,
                    total: totalCount,
                };
            })
            .sort((a, b) => b.total - a.total)
            .slice(0, 15); // Show top 15 by total count

        return multiSentimentData;
    };

    const chartData = createMultiSentimentData();

    return (
        <div className="space-y-6">
            {/* Multi-Sentiment Keywords Chart */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Keywords by Sentiment</h3>
                <div
                    className="w-full"
                    style={{
                        height: `${Math.max(chartData.length * 40, 300)}px`,
                        width: "100%",
                    }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis
                                type="category"
                                dataKey="term"
                                width={90}
                                fontSize={12}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1F2937",
                                    border: "1px solid #374151",
                                    borderRadius: "8px",
                                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                                    color: "#FFFFFF",
                                }}
                                labelStyle={{
                                    color: "#FFFFFF",
                                }}
                                itemStyle={{
                                    color: "#FFFFFF",
                                }}
                            />
                            <Legend />
                            <Bar
                                dataKey="positive"
                                stackId="a"
                                fill="#10B981"
                                name="Positive"
                                barSize={20}
                            />
                            <Bar
                                dataKey="negative"
                                stackId="a"
                                fill="#EF4444"
                                name="Negative"
                                barSize={20}
                            />
                            <Bar
                                dataKey="neutral"
                                stackId="a"
                                fill="#F59E0B"
                                name="Neutral"
                                barSize={20}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default KeywordAnalysis;

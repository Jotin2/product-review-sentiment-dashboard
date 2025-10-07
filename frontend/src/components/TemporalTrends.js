import React, { useState, useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import SentimentDot from "./SentimentDot";

const TemporalTrends = ({ reviews, sentiment }) => {
    // Debug logging
    console.log("TemporalTrends props:", { reviews, sentiment });

    // Extract unique products from reviews
    const products = useMemo(() => {
        if (!reviews || reviews.length === 0) return [];
        const uniqueProducts = [...new Set(reviews.map((r) => r.product_name))];
        return uniqueProducts.sort();
    }, [reviews]);

    // State for dropdown selection
    const [selectedView, setSelectedView] = useState("overall");

    // State for date range filter
    const [dateRange, setDateRange] = useState("all"); // Options: custom, 3months, 6months, 1year, all (default to "all" for old datasets)

    // State for custom date range
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // State for line filtering (clicked circles)
    const [focusedLine, setFocusedLine] = useState(null);

    // Process data for temporal trends
    const chartData = useMemo(() => {
        if (!reviews || reviews.length === 0) return [];

        // Filter reviews based on selected date range
        const now = new Date();
        let cutoffStart;
        let cutoffEnd = now;

        switch (dateRange) {
            case "custom":
                // Use custom date range if provided
                cutoffStart = startDate ? new Date(startDate) : new Date(0);
                cutoffEnd = endDate ? new Date(endDate) : now;
                cutoffEnd.setHours(23, 59, 59, 999); // End of day
                break;
            case "3months":
                cutoffStart = new Date(now);
                cutoffStart.setMonth(cutoffStart.getMonth() - 3);
                break;
            case "6months":
                cutoffStart = new Date(now);
                cutoffStart.setMonth(cutoffStart.getMonth() - 6);
                break;
            case "1year":
                cutoffStart = new Date(now);
                cutoffStart.setFullYear(cutoffStart.getFullYear() - 1);
                break;
            case "all":
                cutoffStart = new Date(0); // Beginning of time
                cutoffEnd = new Date(8640000000000000); // Max date
                break;
            default:
                cutoffStart = new Date(0);
                cutoffEnd = new Date(8640000000000000);
        }

        let filteredReviews = reviews.filter((review) => {
            const reviewDate = new Date(review.review_date || review.date);
            return reviewDate >= cutoffStart && reviewDate <= cutoffEnd;
        });

        // Further filter by selected product if needed
        if (selectedView !== "overall") {
            filteredReviews = filteredReviews.filter((r) => r.product_name === selectedView);
        }

        if (filteredReviews.length === 0) return [];

        // Group reviews by date
        const dateMap = {};
        filteredReviews.forEach((review) => {
            const fullDate = review.review_date || review.date;
            // Extract just the date part (YYYY-MM-DD) for proper grouping
            const date = fullDate ? fullDate.split("T")[0] : new Date().toISOString().split("T")[0];
            if (!dateMap[date]) {
                dateMap[date] = {
                    date: date,
                    positive: 0,
                    neutral: 0,
                    negative: 0,
                    totalScore: 0,
                    count: 0,
                };
            }

            // Use actual sentiment analysis from backend
            const sentimentLabel = review.label; // 'positive', 'negative', or 'neutral'
            const sentimentScore = parseFloat(review.score) || 0; // -10 to +10 scale

            // Count by sentiment label
            if (sentimentLabel === "positive") {
                dateMap[date].positive += 1;
            } else if (sentimentLabel === "neutral") {
                dateMap[date].neutral += 1;
            } else if (sentimentLabel === "negative") {
                dateMap[date].negative += 1;
            }

            // Accumulate sentiment score for averaging
            dateMap[date].totalScore += sentimentScore;
            dateMap[date].count += 1;
        });

        // Convert to array and calculate average sentiment score
        let dataArray = Object.values(dateMap).map((item) => {
            const avgScore = item.totalScore / item.count;
            // Clamp to -10 to +10 range
            const clampedScore = Math.max(-10, Math.min(10, avgScore));
            return {
                date: item.date,
                positive: item.positive,
                neutral: item.neutral,
                negative: item.negative,
                avgSentiment: clampedScore.toFixed(2),
            };
        });

        // Sort by date
        dataArray.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Optimize for performance: Reduce data points if too many
        const MAX_DATA_POINTS = 100; // Limit to 100 points for smooth rendering
        if (dataArray.length > MAX_DATA_POINTS) {
            console.log(
                `Reducing ${dataArray.length} data points to ${MAX_DATA_POINTS} for better performance...`
            );

            // Sample data points evenly
            const step = Math.ceil(dataArray.length / MAX_DATA_POINTS);
            const sampledData = [];

            for (let i = 0; i < dataArray.length; i += step) {
                // Aggregate data points in this range
                const rangeEnd = Math.min(i + step, dataArray.length);
                const rangeData = dataArray.slice(i, rangeEnd);

                const aggregated = {
                    date: rangeData[0].date, // Use first date in range
                    positive: rangeData.reduce((sum, d) => sum + d.positive, 0),
                    neutral: rangeData.reduce((sum, d) => sum + d.neutral, 0),
                    negative: rangeData.reduce((sum, d) => sum + d.negative, 0),
                    avgSentiment: (
                        rangeData.reduce((sum, d) => sum + parseFloat(d.avgSentiment), 0) /
                        rangeData.length
                    ).toFixed(2),
                };

                sampledData.push(aggregated);
            }

            dataArray = sampledData;
            console.log(`Optimized to ${dataArray.length} data points`);
        }

        // Debug logging
        console.log("TemporalTrends chartData:", dataArray);

        return dataArray;
    }, [reviews, selectedView, dateRange, startDate, endDate]);

    if (!reviews || reviews.length === 0) {
        return <div className="text-center py-8 text-gray-500">No temporal data available</div>;
    }

    return (
        <div className="w-full">
            {/* Header with Title and Dropdown */}
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Temporal Trends</h3>
                <div className="flex items-center space-x-6">
                    {/* Product Selection */}
                    <div className="flex items-center space-x-2">
                        <label htmlFor="view-select" className="text-sm font-medium text-gray-700">
                            View:
                        </label>
                        <select
                            id="view-select"
                            value={selectedView}
                            onChange={(e) => setSelectedView(e.target.value)}
                            className="block px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="overall">Overall Sentiment Over Time</option>
                            {products.length > 0 && (
                                <optgroup label="Products">
                                    {products.map((product, index) => (
                                        <option key={index} value={product}>
                                            {product}
                                        </option>
                                    ))}
                                </optgroup>
                            )}
                        </select>
                    </div>

                    {/* Date Range Selection */}
                    <div className="flex items-center space-x-2">
                        <label
                            htmlFor="date-range-select"
                            className="text-sm font-medium text-gray-700"
                        >
                            Time Range:
                        </label>
                        <select
                            id="date-range-select"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="block px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="custom">Custom Range</option>
                            <option value="3months">Past 3 Months</option>
                            <option value="6months">Past 6 Months</option>
                            <option value="1year">Past Year</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>

                    {/* Custom Date Range Inputs */}
                    {dateRange === "custom" && (
                        <>
                            <div className="flex items-center space-x-2">
                                <label
                                    htmlFor="start-date"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    From:
                                </label>
                                <input
                                    type="date"
                                    id="start-date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="block px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <label
                                    htmlFor="end-date"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    To:
                                </label>
                                <input
                                    type="date"
                                    id="end-date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="block px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Line Filters - Centered */}
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "16px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <SentimentDot
                        sentiment="sentiment"
                        isActive={focusedLine === "sentiment"}
                        onClick={() =>
                            setFocusedLine(focusedLine === "sentiment" ? null : "sentiment")
                        }
                        isFocused={focusedLine}
                    />
                    <SentimentDot
                        sentiment="positive"
                        isActive={focusedLine === "positive"}
                        onClick={() =>
                            setFocusedLine(focusedLine === "positive" ? null : "positive")
                        }
                        isFocused={focusedLine}
                    />
                    <SentimentDot
                        sentiment="neutral"
                        isActive={focusedLine === "neutral"}
                        onClick={() => setFocusedLine(focusedLine === "neutral" ? null : "neutral")}
                        isFocused={focusedLine}
                    />
                    <SentimentDot
                        sentiment="negative"
                        isActive={focusedLine === "negative"}
                        onClick={() =>
                            setFocusedLine(focusedLine === "negative" ? null : "negative")
                        }
                        isFocused={focusedLine}
                    />
                </div>
            </div>

            {/* Chart */}
            <div className="w-full bg-gray-50 rounded-lg p-4" style={{ height: "400px" }}>
                {chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        No data available for selected view
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 5, right: 80, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            {/* Left Y-Axis for Review Counts */}
                            <YAxis
                                yAxisId="left"
                                label={{
                                    value: "Review Count",
                                    angle: -90,
                                    position: "insideLeft",
                                }}
                                tick={{ fontSize: 12 }}
                            />
                            {/* Right Y-Axis for Sentiment Score */}
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                label={{
                                    value: "Sentiment Score (-10 to +10)",
                                    angle: 90,
                                    position: "insideRight",
                                }}
                                tick={{ fontSize: 12 }}
                                domain={[-10, 10]}
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

                            {/* Average Sentiment Score Line - Uses RIGHT Y-Axis */}
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="avgSentiment"
                                stroke="#8B5CF6"
                                strokeWidth={3}
                                name="Avg Sentiment Score"
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                strokeOpacity={
                                    focusedLine === null || focusedLine === "sentiment" ? 1 : 0.2
                                }
                            />

                            {/* Positive Count Line - Uses LEFT Y-Axis */}
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="positive"
                                stroke="#10B981"
                                strokeWidth={2}
                                name="Positive Reviews"
                                dot={{ r: 3 }}
                                strokeOpacity={
                                    focusedLine === null || focusedLine === "positive" ? 1 : 0.2
                                }
                            />

                            {/* Neutral Count Line - Uses LEFT Y-Axis */}
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="neutral"
                                stroke="#F59E0B"
                                strokeWidth={2}
                                name="Neutral Reviews"
                                dot={{ r: 3 }}
                                strokeOpacity={
                                    focusedLine === null || focusedLine === "neutral" ? 1 : 0.2
                                }
                            />

                            {/* Negative Count Line - Uses LEFT Y-Axis */}
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="negative"
                                stroke="#EF4444"
                                strokeWidth={2}
                                name="Negative Reviews"
                                dot={{ r: 3 }}
                                strokeOpacity={
                                    focusedLine === null || focusedLine === "negative" ? 1 : 0.2
                                }
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default TemporalTrends;

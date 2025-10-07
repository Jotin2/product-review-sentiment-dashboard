import React, { useState, useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";

const SentimentComposition = ({ data }) => {
    const [viewMode, setViewMode] = useState("percentage"); // "percentage" or "count"

    const chartData = useMemo(() => {
        // Try multiple possible data paths
        const reviews = data?.reviews || data?.data?.reviews || [];
        if (!reviews || reviews.length === 0) return [];

        // Group reviews by product
        const productGroups = {};
        reviews.forEach((review) => {
            const product = review.product_name || "Unknown Product";
            if (!productGroups[product]) {
                productGroups[product] = {
                    positive: 0,
                    negative: 0,
                    neutral: 0,
                    total: 0,
                };
            }
            productGroups[product][review.label]++;
            productGroups[product].total++;
        });

        // Convert to chart format
        return Object.entries(productGroups)
            .map(([product, counts]) => ({
                product: product.length > 20 ? product.substring(0, 20) + "..." : product,
                positive:
                    viewMode === "percentage"
                        ? ((counts.positive / counts.total) * 100).toFixed(1)
                        : counts.positive,
                negative:
                    viewMode === "percentage"
                        ? ((counts.negative / counts.total) * 100).toFixed(1)
                        : counts.negative,
                neutral:
                    viewMode === "percentage"
                        ? ((counts.neutral / counts.total) * 100).toFixed(1)
                        : counts.neutral,
                total: counts.total,
            }))
            .sort((a, b) => b.total - a.total) // Sort by total reviews
            .slice(0, 10); // Top 10 products
    }, [data, viewMode]);

    // Debug logging
    console.log("SentimentComposition data:", data);

    if (!data) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Sentiment Composition by Product
                </h3>
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                    Sentiment Composition by Product
                </h3>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setViewMode("percentage")}
                        className={`px-3 py-1 text-sm rounded ${
                            viewMode === "percentage"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        Percentage
                    </button>
                    <button
                        onClick={() => setViewMode("count")}
                        className={`px-3 py-1 text-sm rounded ${
                            viewMode === "count"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        Count
                    </button>
                </div>
            </div>

            <div style={{ height: "400px" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="product" angle={-45} textAnchor="end" height={100} />
                        <YAxis
                            label={{
                                value: viewMode === "percentage" ? "Percentage (%)" : "Count",
                                angle: -90,
                                position: "insideLeft",
                            }}
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
                        <Bar dataKey="positive" stackId="a" fill="#10B981" name="Positive" />
                        <Bar dataKey="neutral" stackId="a" fill="#F59E0B" name="Neutral" />
                        <Bar dataKey="negative" stackId="a" fill="#EF4444" name="Negative" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SentimentComposition;

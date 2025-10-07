import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

const SentimentChart = ({ data }) => {
    // Use real data now that we know Recharts works
    const chartData = [
        {
            name: "Positive",
            value: data?.positive?.count || 0,
            percentage: data?.positive?.percentage || 0,
            color: "#10B981",
        },
        {
            name: "Negative",
            value: data?.negative?.count || 0,
            percentage: data?.negative?.percentage || 0,
            color: "#EF4444",
        },
        {
            name: "Neutral",
            value: data?.neutral?.count || 0,
            percentage: data?.neutral?.percentage || 0,
            color: "#F59E0B",
        },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div
                    className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg"
                    style={{
                        position: "fixed",
                        pointerEvents: "none",
                        zIndex: 1000,
                        transform: "translate(-50%, -100%)",
                        marginTop: "-10px",
                    }}
                >
                    <p className="font-medium text-gray-900">{data.name}</p>
                    <p className="text-sm text-gray-600">
                        Count: {data.value} ({data.percentage}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Sentiment Distribution Chart */}
            <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
                    Sentiment Distribution
                </h3>
                <div className="w-full" style={{ height: "256px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                                formatter={(value, name) => [value, "Count"]}
                                labelFormatter={(label) => `${label} Sentiment`}
                                contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SentimentChart;

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SentimentChart = ({ data }) => {
    const chartData = [
        { name: 'Positive', value: data.positive.count, percentage: data.positive.percentage, color: '#10B981' },
        { name: 'Negative', value: data.negative.count, percentage: data.negative.percentage, color: '#EF4444' },
        { name: 'Neutral', value: data.neutral.count, percentage: data.neutral.percentage, color: '#F59E0B' }
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
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
            {/* Pie Chart */}
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percentage }) => `${name}: ${percentage}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8">
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
                {chartData.map((item) => (
                    <div key={item.name} className="text-center">
                        <div 
                            className="w-4 h-4 rounded-full mx-auto mb-2"
                            style={{ backgroundColor: item.color }}
                        ></div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-2xl font-bold" style={{ color: item.color }}>
                            {item.value}
                        </p>
                        <p className="text-sm text-gray-500">{item.percentage}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SentimentChart;

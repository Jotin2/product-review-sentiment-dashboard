import React, { useState } from "react";
import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Sector,
} from "recharts";

const PieChart = ({ keywords }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!keywords?.overall?.length) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                No keyword data available
            </div>
        );
    }

    const pieData = keywords.overall
        .slice(0, 10)
        .map((k) => ({
            name: k.term,
            value: k.count,
        }))
        .filter((item) => item.name && typeof item.value === "number");

    if (!pieData.length) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                No valid keyword data to display
            </div>
        );
    }

    // Simple color palette for pie chart segments
    const COLORS = [
        "#8884d8",
        "#82ca9d",
        "#ffc658",
        "#ff7300",
        "#00ff00",
        "#ff00ff",
        "#00ffff",
        "#ffff00",
        "#ff0000",
        "#0000ff",
    ];

    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const {
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            startAngle,
            endAngle,
            fill,
            payload,
            percent,
            value,
        } = props;

        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? "start" : "end";

        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text
                    x={ex + (cos >= 0 ? 1 : -1) * 12}
                    y={ey}
                    textAnchor={textAnchor}
                    fill="#333"
                    className="text-sm"
                >
                    {`${payload.name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                </text>
            </g>
        );
    };

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend />
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChart;

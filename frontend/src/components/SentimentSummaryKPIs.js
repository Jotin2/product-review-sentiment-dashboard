import React from "react";

const SentimentSummaryKPIs = ({ data }) => {
    if (!data) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    🧮 Sentiment Summary KPIs
                </h3>
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    // Debug: Log the data structure
    console.log("SentimentSummaryKPIs data:", data);

    // Calculate total reviews - try multiple data structure paths
    const totalReviews =
        data.summary?.total_reviews ||
        (data.positive?.count || 0) + (data.negative?.count || 0) + (data.neutral?.count || 0);

    // Calculate percentages - try multiple data structure paths
    const positivePercentage =
        data.summary?.sentiment_distribution?.positive?.percentage ||
        (totalReviews > 0 ? (((data.positive?.count || 0) / totalReviews) * 100).toFixed(1) : 0);
    const negativePercentage =
        data.summary?.sentiment_distribution?.negative?.percentage ||
        (totalReviews > 0 ? (((data.negative?.count || 0) / totalReviews) * 100).toFixed(1) : 0);

    // Calculate average sentiment score - try multiple data structure paths
    const avgScore = data.summary?.average_score || data.averageScore || 0;

    // Get most common keywords - try multiple data structure paths
    const mostCommonPositive =
        data.keywords?.by_sentiment?.positive?.[0]?.term ||
        data.keywords?.positive?.[0]?.term ||
        "N/A";
    const mostCommonNegative =
        data.keywords?.by_sentiment?.negative?.[0]?.term ||
        data.keywords?.negative?.[0]?.term ||
        "N/A";

    const kpiCards = [
        {
            title: "Total Reviews",
            value: totalReviews.toLocaleString(),
            color: "blue",
            bgColor: "#EBF8FF",
            borderColor: "#3182CE",
            textColor: "#1A365D",
        },
        {
            title: "Positive Sentiment",
            value: `${positivePercentage}%`,
            color: "green",
            bgColor: "#F0FFF4",
            borderColor: "#10B981",
            textColor: "#047857",
        },
        {
            title: "Negative Sentiment",
            value: `${negativePercentage}%`,
            color: "red",
            bgColor: "#FEF2F2",
            borderColor: "#EF4444",
            textColor: "#B91C1C",
        },
        {
            title: "Average Score",
            value: avgScore.toFixed(2),
            color: "purple",
            bgColor: "#F3E8FF",
            borderColor: "#8B5CF6",
            textColor: "#6B21A8",
        },
        {
            title: "Top Positive Keyword",
            value: mostCommonPositive,
            color: "emerald",
            bgColor: "#ECFDF5",
            borderColor: "#059669",
            textColor: "#047857",
        },
        {
            title: "Top Negative Keyword",
            value: mostCommonNegative,
            color: "orange",
            bgColor: "#FFFBEB",
            borderColor: "#F59E0B",
            textColor: "#B45309",
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">🧮 Sentiment Summary KPIs</h3>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                }}
            >
                {kpiCards.map((card, index) => (
                    <div
                        key={index}
                        style={{
                            padding: "1.25rem",
                            borderRadius: "0.75rem",
                            border: `2px solid ${card.borderColor}`,
                            backgroundColor: card.bgColor,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.1)",
                            transition: "transform 0.2s ease-in-out",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 4px 8px -1px rgba(0, 0, 0, 0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 2px 4px -1px rgba(0, 0, 0, 0.1)";
                        }}
                    >
                        <div
                            style={{
                                fontSize: "2rem",
                                fontWeight: "bold",
                                color: card.textColor,
                                marginBottom: "0.5rem",
                                wordBreak: "break-word",
                            }}
                        >
                            {card.value}
                        </div>
                        <h4
                            style={{
                                fontSize: "0.75rem",
                                fontWeight: "500",
                                color: card.textColor,
                                opacity: 0.8,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                            }}
                        >
                            {card.title}
                        </h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SentimentSummaryKPIs;

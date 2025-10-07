import React, { useMemo } from "react";

// Helper functions moved outside component to avoid initialization issues
const calculateSentimentStats = (reviews) => {
    if (!reviews || reviews.length === 0) {
        return {
            positive: 0,
            negative: 0,
            neutral: 0,
            avgScore: 0,
        };
    }

    const stats = reviews.reduce(
        (acc, review) => {
            acc[review.label]++;
            acc.totalScore += review.score || 0;
            return acc;
        },
        { positive: 0, negative: 0, neutral: 0, totalScore: 0 }
    );

    const total = reviews.length;

    return {
        positive: ((stats.positive / total) * 100).toFixed(1), // Return as percentage
        negative: ((stats.negative / total) * 100).toFixed(1), // Return as percentage
        neutral: ((stats.neutral / total) * 100).toFixed(1), // Return as percentage
        avgScore: stats.totalScore / reviews.length,
    };
};

const TrendIndicator = ({ current, previous, label }) => {
    const change = current - previous;
    const changePercent = previous !== 0 ? ((change / previous) * 100).toFixed(1) : 0;

    return (
        <div className="text-center">
            <div
                className={`text-2xl font-bold ${
                    change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-600"
                }`}
            >
                {change > 0 ? "▲" : change < 0 ? "▼" : "—"} {Math.abs(changePercent)}%
            </div>
            <div className="text-xs text-gray-500">{label}</div>
        </div>
    );
};

const ScoreTrendIndicator = ({ current, previous, label }) => {
    const change = current - previous;

    return (
        <div className="text-center">
            <div
                className={`text-2xl font-bold ${
                    change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-600"
                }`}
            >
                {change > 0 ? "▲" : change < 0 ? "▼" : "—"} {Math.abs(change).toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">{label}</div>
        </div>
    );
};

const TrendDetection = ({ data }) => {
    const trendData = useMemo(() => {
        // Try multiple possible data paths
        const reviews = data?.reviews || data?.data?.reviews || [];
        if (!reviews || reviews.length === 0) {
            return {
                earlierPeriod: {
                    dateRange: "N/A",
                    stats: { positive: 0, negative: 0, neutral: 0, avgScore: 0 },
                },
                laterPeriod: {
                    dateRange: "N/A",
                    stats: { positive: 0, negative: 0, neutral: 0, avgScore: 0 },
                },
                changes: { positive: 0, negative: 0, neutral: 0, avgScore: 0 },
                sentimentCards: [],
            };
        }

        // Sort reviews by date
        const sortedReviews = [...reviews].sort(
            (a, b) =>
                new Date(a.review_date || a.date || Date.now()) -
                new Date(b.review_date || b.date || Date.now())
        );

        // Split into two periods
        const midPoint = Math.floor(sortedReviews.length / 2);
        const earlierReviews = sortedReviews.slice(0, midPoint);
        const laterReviews = sortedReviews.slice(midPoint);

        // Calculate stats for each period
        const earlierStats = calculateSentimentStats(earlierReviews);
        const laterStats = calculateSentimentStats(laterReviews);

        // Calculate changes
        const changes = {
            positive: laterStats.positive - earlierStats.positive,
            negative: laterStats.negative - earlierStats.negative,
            neutral: laterStats.neutral - earlierStats.neutral,
            avgScore: laterStats.avgScore - earlierStats.avgScore,
        };

        // Create sentiment cards data
        const sentimentCards = [
            {
                label: "Positive Sentiment",
                earlier: earlierStats.positive,
                later: laterStats.positive,
                delta: changes.positive,
            },
            {
                label: "Neutral Sentiment",
                earlier: earlierStats.neutral,
                later: laterStats.neutral,
                delta: changes.neutral,
            },
            {
                label: "Negative Sentiment",
                earlier: earlierStats.negative,
                later: laterStats.negative,
                delta: changes.negative,
            },
        ];

        // Debug logging
        console.log("TrendDetection data:", {
            reviews,
            earlierStats,
            laterStats,
            changes,
            sentimentCards,
        });

        return {
            earlierPeriod: {
                dateRange:
                    earlierReviews.length > 0
                        ? `${new Date(
                              earlierReviews[0].review_date || earlierReviews[0].date || Date.now()
                          ).toLocaleDateString()} - ${new Date(
                              earlierReviews[earlierReviews.length - 1].review_date ||
                                  earlierReviews[earlierReviews.length - 1].date ||
                                  Date.now()
                          ).toLocaleDateString()}`
                        : "N/A",
                stats: earlierStats,
            },
            laterPeriod: {
                dateRange:
                    laterReviews.length > 0
                        ? `${new Date(
                              laterReviews[0].review_date || laterReviews[0].date || Date.now()
                          ).toLocaleDateString()} - ${new Date(
                              laterReviews[laterReviews.length - 1].review_date ||
                                  laterReviews[laterReviews.length - 1].date ||
                                  Date.now()
                          ).toLocaleDateString()}`
                        : "N/A",
                stats: laterStats,
            },
            changes,
            sentimentCards,
        };
    }, [data]);

    if (!data) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Trend Detection / Change Over Time
                </h3>
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
                Trend Detection / Change Over Time
            </h3>

            <div className="mb-6">
                <p className="text-sm text-gray-600">
                    Comparing earlier period ({trendData.earlierPeriod.dateRange}) vs. later period
                    ({trendData.laterPeriod.dateRange})
                </p>
            </div>

            {/* Delta Chart - Sentiment Cards */}
            {trendData.sentimentCards && trendData.sentimentCards.length > 0 ? (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "1.5rem",
                    }}
                >
                    {/* Positive Card */}
                    <div
                        style={{
                            padding: "1.5rem",
                            borderRadius: "1rem",
                            border: "2px solid #10B981",
                            backgroundColor: "#ECFDF5",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <h3
                            style={{
                                color: "#047857",
                                fontWeight: "600",
                                fontSize: "1.125rem",
                                marginBottom: "1rem",
                            }}
                        >
                            {trendData.sentimentCards[0].label}
                        </h3>
                        <div
                            style={{
                                fontSize: "0.875rem",
                                color: "#6B7280",
                                marginBottom: "0.25rem",
                            }}
                        >
                            Earlier:{" "}
                            <span style={{ fontWeight: "500" }}>
                                {trendData.sentimentCards[0].earlier}%
                            </span>
                        </div>
                        <div
                            style={{
                                fontSize: "0.875rem",
                                color: "#6B7280",
                                marginBottom: "0.75rem",
                            }}
                        >
                            Later:{" "}
                            <span style={{ fontWeight: "500" }}>
                                {trendData.sentimentCards[0].later}%
                            </span>
                        </div>
                        <div
                            style={{
                                marginTop: "0.5rem",
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                color:
                                    trendData.sentimentCards[0].delta > 0
                                        ? "#059669"
                                        : trendData.sentimentCards[0].delta < 0
                                        ? "#DC2626"
                                        : "#6B7280",
                            }}
                        >
                            {trendData.sentimentCards[0].delta > 0
                                ? "▲"
                                : trendData.sentimentCards[0].delta < 0
                                ? "▼"
                                : "—"}{" "}
                            {Math.abs(trendData.sentimentCards[0].delta).toFixed(1)}%
                        </div>
                        <div
                            style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "0.25rem" }}
                        >
                            {trendData.sentimentCards[0].delta > 0
                                ? "increase"
                                : trendData.sentimentCards[0].delta < 0
                                ? "decrease"
                                : "no change"}
                        </div>
                    </div>

                    {/* Neutral Card */}
                    <div
                        style={{
                            padding: "1.5rem",
                            borderRadius: "1rem",
                            border: "2px solid #F59E0B",
                            backgroundColor: "#FFFBEB",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <h3
                            style={{
                                color: "#B45309",
                                fontWeight: "600",
                                fontSize: "1.125rem",
                                marginBottom: "1rem",
                            }}
                        >
                            {trendData.sentimentCards[1].label}
                        </h3>
                        <div
                            style={{
                                fontSize: "0.875rem",
                                color: "#6B7280",
                                marginBottom: "0.25rem",
                            }}
                        >
                            Earlier:{" "}
                            <span style={{ fontWeight: "500" }}>
                                {trendData.sentimentCards[1].earlier}%
                            </span>
                        </div>
                        <div
                            style={{
                                fontSize: "0.875rem",
                                color: "#6B7280",
                                marginBottom: "0.75rem",
                            }}
                        >
                            Later:{" "}
                            <span style={{ fontWeight: "500" }}>
                                {trendData.sentimentCards[1].later}%
                            </span>
                        </div>
                        <div
                            style={{
                                marginTop: "0.5rem",
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                color:
                                    trendData.sentimentCards[1].delta > 0
                                        ? "#059669"
                                        : trendData.sentimentCards[1].delta < 0
                                        ? "#DC2626"
                                        : "#6B7280",
                            }}
                        >
                            {trendData.sentimentCards[1].delta > 0
                                ? "▲"
                                : trendData.sentimentCards[1].delta < 0
                                ? "▼"
                                : "—"}{" "}
                            {Math.abs(trendData.sentimentCards[1].delta).toFixed(1)}%
                        </div>
                        <div
                            style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "0.25rem" }}
                        >
                            {trendData.sentimentCards[1].delta > 0
                                ? "increase"
                                : trendData.sentimentCards[1].delta < 0
                                ? "decrease"
                                : "no change"}
                        </div>
                    </div>

                    {/* Negative Card */}
                    <div
                        style={{
                            padding: "1.5rem",
                            borderRadius: "1rem",
                            border: "2px solid #EF4444",
                            backgroundColor: "#FEF2F2",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <h3
                            style={{
                                color: "#B91C1C",
                                fontWeight: "600",
                                fontSize: "1.125rem",
                                marginBottom: "1rem",
                            }}
                        >
                            {trendData.sentimentCards[2].label}
                        </h3>
                        <div
                            style={{
                                fontSize: "0.875rem",
                                color: "#6B7280",
                                marginBottom: "0.25rem",
                            }}
                        >
                            Earlier:{" "}
                            <span style={{ fontWeight: "500" }}>
                                {trendData.sentimentCards[2].earlier}%
                            </span>
                        </div>
                        <div
                            style={{
                                fontSize: "0.875rem",
                                color: "#6B7280",
                                marginBottom: "0.75rem",
                            }}
                        >
                            Later:{" "}
                            <span style={{ fontWeight: "500" }}>
                                {trendData.sentimentCards[2].later}%
                            </span>
                        </div>
                        <div
                            style={{
                                marginTop: "0.5rem",
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                color:
                                    trendData.sentimentCards[2].delta > 0
                                        ? "#DC2626"
                                        : trendData.sentimentCards[2].delta < 0
                                        ? "#059669"
                                        : "#6B7280",
                            }}
                        >
                            {trendData.sentimentCards[2].delta > 0
                                ? "▲"
                                : trendData.sentimentCards[2].delta < 0
                                ? "▼"
                                : "—"}{" "}
                            {Math.abs(trendData.sentimentCards[2].delta).toFixed(1)}%
                        </div>
                        <div
                            style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "0.25rem" }}
                        >
                            {trendData.sentimentCards[2].delta > 0
                                ? "increase"
                                : trendData.sentimentCards[2].delta < 0
                                ? "decrease"
                                : "no change"}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <p>No trend data available</p>
                </div>
            )}

            {/* Key Insights */}
            <div style={{ marginTop: "1.5rem" }}>
                <h4
                    style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "#1A365D",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    📊 Key Insights
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {trendData.changes.positive > 0 && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                padding: "0.75rem",
                                backgroundColor: "#F0FFF4",
                                borderRadius: "0.5rem",
                                border: "1px solid #9AE6B4",
                                maxWidth: "fit-content",
                            }}
                        >
                            <span style={{ fontSize: "1.25rem" }}>✅</span>
                            <p style={{ color: "#22543D", fontSize: "0.875rem", margin: 0 }}>
                                Positive sentiment increased by{" "}
                                <strong style={{ color: "#1A365D" }}>
                                    {Math.abs(trendData.changes.positive).toFixed(1)}%
                                </strong>
                            </p>
                        </div>
                    )}
                    {trendData.changes.negative < 0 && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                padding: "0.75rem",
                                backgroundColor: "#F0FFF4",
                                borderRadius: "0.5rem",
                                border: "1px solid #9AE6B4",
                                maxWidth: "fit-content",
                            }}
                        >
                            <span style={{ fontSize: "1.25rem" }}>✅</span>
                            <p style={{ color: "#22543D", fontSize: "0.875rem", margin: 0 }}>
                                Negative sentiment decreased by{" "}
                                <strong style={{ color: "#1A365D" }}>
                                    {Math.abs(trendData.changes.negative).toFixed(1)}%
                                </strong>
                            </p>
                        </div>
                    )}
                    {trendData.changes.avgScore > 0 && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                padding: "0.75rem",
                                backgroundColor: "#F0FFF4",
                                borderRadius: "0.5rem",
                                border: "1px solid #9AE6B4",
                                maxWidth: "fit-content",
                            }}
                        >
                            <span style={{ fontSize: "1.25rem" }}>✅</span>
                            <p style={{ color: "#22543D", fontSize: "0.875rem", margin: 0 }}>
                                Average sentiment score improved by{" "}
                                <strong style={{ color: "#1A365D" }}>
                                    {Math.abs(trendData.changes.avgScore).toFixed(2)}
                                </strong>{" "}
                                points
                            </p>
                        </div>
                    )}
                    {trendData.changes.positive <= 0 &&
                        trendData.changes.negative >= 0 &&
                        trendData.changes.avgScore <= 0 && (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.75rem",
                                    padding: "0.75rem",
                                    backgroundColor: "#FEF2F2",
                                    borderRadius: "0.5rem",
                                    border: "1px solid #FCA5A5",
                                    maxWidth: "fit-content",
                                }}
                            >
                                <span style={{ fontSize: "1.25rem" }}>⚠️</span>
                                <p style={{ color: "#991B1B", fontSize: "0.875rem", margin: 0 }}>
                                    Sentiment trends show decline across multiple metrics
                                </p>
                            </div>
                        )}
                    {trendData.changes.positive === 0 &&
                        trendData.changes.negative === 0 &&
                        trendData.changes.neutral === 0 && (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.75rem",
                                    padding: "0.75rem",
                                    backgroundColor: "#F9FAFB",
                                    borderRadius: "0.5rem",
                                    border: "1px solid #D1D5DB",
                                    maxWidth: "fit-content",
                                }}
                            >
                                <span style={{ fontSize: "1.25rem" }}>➖</span>
                                <p style={{ color: "#374151", fontSize: "0.875rem", margin: 0 }}>
                                    No significant changes detected between periods
                                </p>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default TrendDetection;

import React from "react";

const SentimentDot = ({ sentiment, isActive, onClick, isFocused }) => {
    const getColor = () => {
        switch (sentiment) {
            case "positive":
                return "#10B981"; // green-500
            case "negative":
                return "#EF4444"; // red-500
            case "neutral":
                return "#F97316"; // orange-500
            case "sentiment":
                return "#8B5CF6"; // purple-500
            default:
                return "#6B7280"; // gray-500
        }
    };

    const handleClick = () => {
        onClick(sentiment);
    };

    return (
        <div
            style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "2px solid",
                borderColor: getColor(),
                backgroundColor: getColor(), // Always filled with color
                opacity: isFocused === null || isFocused === sentiment ? 1 : 0.4,
                transform: isActive ? "scale(1.1)" : "scale(1)",
                boxShadow: isActive
                    ? "0 4px 8px rgba(0, 0, 0, 0.15)"
                    : "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s ease-in-out",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            onClick={handleClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = isActive ? "scale(1.15)" : "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = isActive ? "scale(1.1)" : "scale(1)";
                e.currentTarget.style.boxShadow = isActive
                    ? "0 4px 8px rgba(0, 0, 0, 0.15)"
                    : "0 2px 4px rgba(0, 0, 0, 0.1)";
            }}
        />
    );
};

export default SentimentDot;

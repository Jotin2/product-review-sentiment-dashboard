import React, { useState } from "react";

const RawDataDisplay = ({ data }) => {
    const [selectedSection, setSelectedSection] = useState("fileInfo");

    const formatJSON = (obj) => {
        return JSON.stringify(obj, null, 2);
    };

    const sectionOptions = [
        { value: "fileInfo", label: "File Information" },
        { value: "summary", label: "Summary & Metrics" },
        { value: "keywords", label: "Keyword Analysis" },
        { value: "reviews", label: `Reviews Data (${data.data.reviews.length} reviews)` },
        { value: "fullResponse", label: "Complete API Response" },
    ];

    const renderSelectedContent = () => {
        switch (selectedSection) {
            case "fileInfo":
                return formatJSON(data.data.file_info);
            case "summary":
                return formatJSON(data.data.summary);
            case "keywords":
                return formatJSON(data.data.keywords);
            case "reviews":
                return formatJSON(data.data.reviews);
            case "fullResponse":
                return formatJSON(data);
            default:
                return formatJSON(data.data.file_info);
        }
    };

    return (
        <div className="max-w-4xl w-full space-y-4">
            <div className="text-sm text-gray-600 mb-4">
                This is the raw JSON response from the API. Use this for debugging and verification.
            </div>

            {/* Dropdown Menu */}
            <div className="mb-4">
                <label
                    htmlFor="section-select"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Select Section to View:
                </label>
                <select
                    id="section-select"
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    {sectionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Content Display */}
            <div className="border border-gray-200 rounded-lg">
                <div className="p-4 bg-white">
                    <pre className="text-sm text-gray-800 overflow-x-auto max-h-96">
                        {renderSelectedContent()}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default RawDataDisplay;

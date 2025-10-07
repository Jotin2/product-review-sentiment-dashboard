import React, { useState } from "react";
import axios from "axios";

const FileUpload = ({ onAnalysisComplete, onError }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [processingStatus, setProcessingStatus] = useState("");
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            validateFile(selectedFile);
        }
    };

    const validateFile = (file) => {
        const allowedTypes = ["text/csv", "application/json"];
        const maxSize = 500 * 1024 * 1024; // 500MB (increased limit)

        if (
            !allowedTypes.includes(file.type) &&
            !file.name.endsWith(".csv") &&
            !file.name.endsWith(".json")
        ) {
            onError("Please upload a CSV or JSON file only.");
            return;
        }

        if (file.size > maxSize) {
            onError(
                `File size must be less than 500MB. Your file is ${(
                    file.size /
                    1024 /
                    1024
                ).toFixed(2)}MB.`
            );
            return;
        }

        setFile(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            validateFile(droppedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            onError("Please select a file to upload.");
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("/api/analyze", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);

                    if (percentCompleted === 100) {
                        // Estimate processing time (backend limits to 10k reviews for large files)
                        const fileSizeMB = file.size / 1024 / 1024;
                        let statusMessage;

                        if (fileSizeMB > 100) {
                            // Large file - backend will process first 10k reviews
                            statusMessage = `Upload complete! Processing first 10,000 reviews (from ${fileSizeMB.toFixed(
                                0
                            )}MB file)... Estimated time: 1-2 minutes.`;
                        } else {
                            // Smaller file - processes all reviews
                            const estimatedMinutes = Math.max(1, Math.ceil(fileSizeMB / 50));
                            statusMessage = `Upload complete! Processing sentiment analysis... This may take ${estimatedMinutes}-${
                                estimatedMinutes * 2
                            } minutes.`;
                        }

                        setProcessingStatus(statusMessage);
                    }
                },
                timeout: 900000, // 15 minute timeout for very large files
            });

            onAnalysisComplete(response.data);
        } catch (error) {
            console.error("Upload error:", error);
            const errorMessage = error.response?.data?.error || "Upload failed. Please try again.";
            onError(errorMessage);
        } finally {
            setUploading(false);
            setUploadProgress(0);
            setProcessingStatus("");
        }
    };

    const resetUpload = () => {
        setFile(null);
        setUploading(false);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload Area */}
                <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragActive
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        id="file-upload"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={handleFileChange}
                        accept=".csv,.json"
                        disabled={uploading}
                    />

                    <div className="flex flex-col items-center justify-center h-full min-h-[120px] space-y-2">
                        <p className="text-base font-medium text-gray-900">
                            {file ? file.name : "Drop your file here or click to browse"}
                        </p>
                        <p className="text-sm text-gray-500">
                            Supports CSV and JSON files up to 500MB
                        </p>
                    </div>
                </div>

                {/* File Info */}
                {file && (
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={resetUpload}
                                className="text-gray-400 hover:text-gray-600"
                                disabled={uploading}
                            >
                                <span className="text-gray-400 hover:text-gray-600">Remove</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Progress Bar */}
                {uploading && (
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-blue-600 h-4 transition-all duration-300 flex items-center justify-center text-xs text-white font-medium"
                            style={{ width: `${uploadProgress}%` }}
                        >
                            {uploadProgress}%
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex flex-col items-center space-y-3">
                    <button
                        type="submit"
                        disabled={!file || uploading}
                        className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                            !file || uploading
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
                        }`}
                    >
                        {uploading ? (
                            <div className="flex items-center space-x-2">
                                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                                <span>
                                    {uploadProgress < 100
                                        ? "Uploading..."
                                        : "Analyzing sentiment..."}
                                </span>
                            </div>
                        ) : (
                            "Analyze Reviews"
                        )}
                    </button>
                    {processingStatus && (
                        <div className="text-center space-y-2">
                            <p className="text-sm text-gray-600">{processingStatus}</p>
                            <p className="text-xs text-gray-500">
                                💡 Processing in background. Look for progress logs in your backend
                                terminal
                                <br />
                                (shows: "Sentiment analysis progress: X/10000")
                            </p>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default FileUpload;

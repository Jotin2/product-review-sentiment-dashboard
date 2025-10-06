import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onAnalysisComplete, onError }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            validateFile(selectedFile);
        }
    };

    const validateFile = (file) => {
        const allowedTypes = ['text/csv', 'application/json'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!allowedTypes.includes(file.type) && 
            !file.name.endsWith('.csv') && 
            !file.name.endsWith('.json')) {
            onError('Please upload a CSV or JSON file only.');
            return;
        }

        if (file.size > maxSize) {
            onError('File size must be less than 10MB.');
            return;
        }

        setFile(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
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
            onError('Please select a file to upload.');
            return;
        }

        setUploading(true);
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            onAnalysisComplete(response.data);
        } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = error.response?.data?.error || 'Upload failed. Please try again.';
            onError(errorMessage);
        } finally {
            setUploading(false);
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
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        id="file-upload"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                        accept=".csv,.json"
                        disabled={uploading}
                    />
                    
                    <div className="space-y-4">
                        <div className="mx-auto w-12 h-12 text-gray-400">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        
                        <div>
                            <p className="text-lg font-medium text-gray-900">
                                {file ? file.name : 'Drop your file here or click to browse'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Supports CSV and JSON files up to 10MB
                            </p>
                        </div>
                    </div>
                </div>

                {/* File Info */}
                {file && (
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
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
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={!file || uploading}
                        className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                            !file || uploading
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
                        }`}
                    >
                        {uploading ? (
                            <div className="flex items-center space-x-2">
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Analyzing...</span>
                            </div>
                        ) : (
                            'Analyze Reviews'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FileUpload;

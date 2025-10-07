const fs = require("fs");
const path = require("path");
const https = require("https");

// Amazon dataset URL (you'll need to provide the actual download link)
const DATASET_URL =
    "https://www.kaggle.com/datasets/snap/amazon-fine-food-reviews/download?datasetVersionNumber=1";

// Alternative: If you have the file locally, we can process it directly
const LOCAL_FILE_PATH = path.join(__dirname, "amazon_reviews.csv");

async function downloadDataset() {
    console.log("Downloading Amazon dataset...");

    // For now, let's create a sample of the dataset structure
    // You'll need to download the actual file from Kaggle
    const sampleData = createSampleData();

    const csvContent = convertToCSV(sampleData);
    fs.writeFileSync(LOCAL_FILE_PATH, csvContent);

    console.log(`Sample dataset created at: ${LOCAL_FILE_PATH}`);
    console.log(`File size: ${(fs.statSync(LOCAL_FILE_PATH).size / 1024 / 1024).toFixed(2)} MB`);
}

function createSampleData() {
    const products = [
        "B001E4KFG0",
        "B00813GRG4",
        "B000LQOCH0",
        "B006K2ZZ7K",
        "B002QWP89S",
        "B007WTAJTO",
        "B001MA0QY2",
        "B008F4SU0Y",
        "B003D4F1QS",
        "B000HDOPZG",
    ];

    const sampleReviews = [];

    // Create 10,000 sample reviews (much smaller than 568k for testing)
    // Spread reviews across last 180 days with varying density
    for (let i = 0; i < 10000; i++) {
        const productId = products[Math.floor(Math.random() * products.length)];
        const score = Math.floor(Math.random() * 5) + 1; // 1-5 stars

        // Create reviews spread across 180 days
        const daysAgo = Math.floor(Math.random() * 180);
        const time = Math.floor((Date.now() - daysAgo * 24 * 60 * 60 * 1000) / 1000); // Convert to Unix timestamp in seconds

        // Generate realistic review text based on score
        const reviewText = generateReviewText(score);
        const summary = generateSummary(score);

        sampleReviews.push({
            Id: i + 1,
            ProductId: productId,
            UserId: `A${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            ProfileName: `User${i + 1}`,
            HelpfulnessNumerator: Math.floor(Math.random() * 20),
            HelpfulnessDenominator: Math.floor(Math.random() * 25) + 5,
            Score: score,
            Time: time,
            Summary: summary,
            Text: reviewText,
        });
    }

    return sampleReviews;
}

function generateReviewText(score) {
    const positiveTexts = [
        "This product is absolutely amazing! I love everything about it. The quality is outstanding and it works perfectly. Highly recommend to anyone looking for a great product.",
        "Excellent quality and fast shipping. The product exceeded my expectations. Will definitely buy again!",
        "Perfect! Exactly what I was looking for. Great value for money and excellent customer service.",
        "Outstanding product! The quality is top-notch and it arrived quickly. Very satisfied with this purchase.",
        "Love this product! It's exactly as described and works great. Would definitely recommend to others.",
    ];

    const negativeTexts = [
        "Terrible product. Poor quality and doesn't work as advertised. Waste of money. Would not recommend to anyone.",
        "Very disappointed with this purchase. The product broke after just a few days. Poor quality and bad customer service.",
        "Awful experience. Product doesn't work at all. Waste of time and money. Avoid this seller.",
        "Poor quality product. Not worth the money. Would not buy again or recommend to others.",
        "Disappointed with this purchase. The product is not as described and the quality is very poor.",
    ];

    const neutralTexts = [
        "The product is okay. It works as expected but nothing special. Average quality for the price.",
        "Decent product. Does what it's supposed to do but could be better. Average experience overall.",
        "It's fine. The product works but I expected better quality. Not bad but not great either.",
        "Average product. It works but there are better options available. Okay for the price.",
        "The product is acceptable. It does its job but nothing extraordinary. Middle of the road quality.",
    ];

    if (score >= 4) {
        return positiveTexts[Math.floor(Math.random() * positiveTexts.length)];
    } else if (score <= 2) {
        return negativeTexts[Math.floor(Math.random() * negativeTexts.length)];
    } else {
        return neutralTexts[Math.floor(Math.random() * neutralTexts.length)];
    }
}

function generateSummary(score) {
    const positiveSummaries = [
        "Great product!",
        "Excellent quality",
        "Highly recommend",
        "Perfect!",
        "Love it!",
    ];

    const negativeSummaries = [
        "Terrible quality",
        "Waste of money",
        "Poor product",
        "Don't buy",
        "Very disappointed",
    ];

    const neutralSummaries = [
        "It's okay",
        "Average product",
        "Decent quality",
        "Not bad",
        "Acceptable",
    ];

    if (score >= 4) {
        return positiveSummaries[Math.floor(Math.random() * positiveSummaries.length)];
    } else if (score <= 2) {
        return negativeSummaries[Math.floor(Math.random() * negativeSummaries.length)];
    } else {
        return neutralSummaries[Math.floor(Math.random() * neutralSummaries.length)];
    }
}

function convertToCSV(data) {
    const headers = [
        "Id",
        "ProductId",
        "UserId",
        "ProfileName",
        "HelpfulnessNumerator",
        "HelpfulnessDenominator",
        "Score",
        "Time",
        "Summary",
        "Text",
    ];

    const csvRows = [headers.join(",")];

    data.forEach((row) => {
        const values = headers.map((header) => {
            const value = row[header];
            // Escape commas and quotes in CSV
            if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csvRows.push(values.join(","));
    });

    return csvRows.join("\n");
}

// Run the script
if (require.main === module) {
    downloadDataset().catch(console.error);
}

module.exports = { downloadDataset, createSampleData };

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const sentimentService = require("../services/sentimentService");
const keywordService = require("../services/keywordService");
const router = express.Router();

// In-memory storage for latest analysis result
let latestAnalysis = null;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "uploads/";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 500 * 1024 * 1024, // 500MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [".csv", ".json"];
        const fileExt = path.extname(file.originalname).toLowerCase();

        if (allowedTypes.includes(fileExt)) {
            cb(null, true);
        } else {
            cb(new Error("Only CSV and JSON files are allowed"), false);
        }
    },
});

// POST /api/analyze - File upload and analysis endpoint
router.post("/", upload.single("file"), async (req, res) => {
    try {
        console.log("File upload received:", req.file?.originalname);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No file uploaded",
            });
        }

        const filePath = req.file.path;
        const fileExt = path.extname(req.file.originalname).toLowerCase();

        let reviews = [];

        console.log(`Parsing ${fileExt} file...`);
        if (fileExt === ".csv") {
            reviews = await parseCSV(filePath);
        } else if (fileExt === ".json") {
            reviews = await parseJSON(filePath);
        }
        console.log(`Parsing complete. Found ${reviews.length} reviews.`);

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        // Process reviews with sentiment analysis
        console.log(`Starting sentiment analysis on ${reviews.length} reviews...`);
        const analysisResult = sentimentService.processReviews(reviews);
        console.log(`Sentiment analysis complete.`);

        // Extract keywords
        console.log(`Extracting keywords...`);
        const keywordAnalysis = keywordService.analyzeKeywords(analysisResult.reviews);
        console.log(`Keyword extraction complete.`);

        const response = {
            success: true,
            message: "File uploaded and analyzed successfully",
            data: {
                file_info: {
                    original_name: req.file.originalname,
                    size: req.file.size,
                    type: fileExt,
                },
                summary: analysisResult.summary,
                reviews: analysisResult.reviews,
                keywords: keywordAnalysis,
            },
        };

        // Store the latest analysis result
        latestAnalysis = response.data;

        console.log(`Successfully processed ${reviews.length} reviews`);

        // Check response size
        const responseSize = JSON.stringify(response).length / 1024 / 1024;
        console.log(`Response size: ${responseSize.toFixed(2)} MB`);
        console.log(`Sending response to client...`);

        res.json(response);
        console.log(`Response sent!`);
    } catch (error) {
        console.error("Upload error:", error.message);

        // Clean up file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// GET /api/analyze/latest - Retrieve the latest analysis result
router.get("/latest", (req, res) => {
    if (!latestAnalysis) {
        return res.status(404).json({
            success: false,
            error: "No analysis data available. Please upload a file first.",
        });
    }

    res.json({
        success: true,
        data: latestAnalysis,
    });
});

// Helper function to parse CSV files with limits for large datasets
async function parseCSV(filePath) {
    console.log(`Starting CSV parsing from: ${filePath}`);
    return new Promise((resolve, reject) => {
        const results = [];
        let isFirstRow = true;
        let hasAmazonFormat = false;
        const MAX_REVIEWS = 10000; // Limit to 10k reviews for now to prevent memory issues
        let rowCount = 0;

        const stream = fs.createReadStream(filePath);
        const parser = stream.pipe(csv());

        parser
            .on("data", (data) => {
                rowCount++;
                if (rowCount % 5000 === 0) {
                    console.log(`Parsed ${rowCount} rows from CSV...`);
                }

                // Stop parsing if we've reached the limit
                if (results.length >= MAX_REVIEWS) {
                    console.log(`Reached limit of ${MAX_REVIEWS} reviews. Stopping parser...`);
                    parser.destroy();
                    stream.destroy();

                    // Manually resolve since we're stopping early
                    console.log(
                        `Parsed ${results.length} reviews from ${
                            hasAmazonFormat ? "Amazon" : "standard"
                        } format (limited to ${MAX_REVIEWS})`
                    );
                    resolve(results);
                    return;
                }

                if (isFirstRow) {
                    // Check if this is Amazon dataset format
                    hasAmazonFormat = data.Text && data.Score && data.ProductId;
                    isFirstRow = false;
                }

                let reviewData;

                if (hasAmazonFormat) {
                    // Amazon dataset format: Id, ProductId, UserId, ProfileName, HelpfulnessNumerator, HelpfulnessDenominator, Score, Time, Summary, Text
                    if (!data.Text || !data.Score) {
                        return; // Skip invalid rows
                    }

                    // Debug: Log first review's date conversion
                    if (results.length === 0) {
                        console.log(`Sample Time value: ${data.Time} (type: ${typeof data.Time})`);
                        const timestamp = parseInt(data.Time);
                        console.log(`Parsed timestamp: ${timestamp}`);
                        const dateObj = new Date(timestamp * 1000);
                        console.log(`Converted date: ${dateObj.toISOString()}`);
                    }

                    reviewData = {
                        review_id: data.Id || `amazon_${Date.now()}_${Math.random()}`,
                        review_text: data.Text,
                        rating: parseInt(data.Score),
                        product_name: data.ProductId,
                        user_id: data.UserId,
                        profile_name: data.ProfileName,
                        helpfulness_numerator: parseInt(data.HelpfulnessNumerator) || 0,
                        helpfulness_denominator: parseInt(data.HelpfulnessDenominator) || 0,
                        review_date: data.Time
                            ? new Date(parseInt(data.Time) * 1000).toISOString()
                            : new Date().toISOString(),
                        summary: data.Summary || "",
                    };
                } else {
                    // Original format: review_text, review_id, rating, product_name, etc.
                    if (!data.review_text || !data.review_id) {
                        return; // Skip invalid rows
                    }

                    reviewData = {
                        review_id: data.review_id,
                        review_text: data.review_text,
                        rating: parseInt(data.rating) || 0,
                        product_name: data.product_name || "Unknown Product",
                        user_id: data.user_id || "",
                        review_date: data.review_date || new Date().toISOString(),
                        summary: data.summary || "",
                    };
                }

                results.push(reviewData);
            })
            .on("end", () => {
                if (results.length === 0) {
                    reject(new Error("No valid data found in CSV file"));
                    return;
                }
                console.log(
                    `Parsed ${results.length} reviews from ${
                        hasAmazonFormat ? "Amazon" : "standard"
                    } format ${results.length >= MAX_REVIEWS ? `(limited to ${MAX_REVIEWS})` : ""}`
                );
                resolve(results);
            })
            .on("error", (error) => {
                reject(new Error(`CSV parsing error: ${error.message}`));
            });
    });
}

// Helper function to parse JSON files
async function parseJSON(filePath) {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        const jsonData = JSON.parse(data);

        // Handle both array and object formats
        let reviews = Array.isArray(jsonData) ? jsonData : jsonData.reviews || [];

        if (!Array.isArray(reviews)) {
            throw new Error("JSON must contain an array of reviews");
        }

        // Validate required fields
        const validReviews = reviews.filter((review) => {
            return review.review_text && review.review_id;
        });

        if (validReviews.length === 0) {
            throw new Error(
                "No valid reviews found with required fields: review_text and review_id"
            );
        }

        return validReviews;
    } catch (error) {
        throw new Error(`JSON parsing error: ${error.message}`);
    }
}

module.exports = router;

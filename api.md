# API Contract - Product Review Sentiment Dashboard

## Base URL
```
http://localhost:5000
```

## Endpoints

### 1. POST /api/analyze
Upload and analyze a CSV or JSON file containing product reviews.

#### Request
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Body**: Form data with `file` field containing CSV or JSON file
- **File Size Limit**: 10MB
- **Supported Formats**: CSV, JSON

#### CSV Format Requirements
Required columns:
- `review_id` (string/number): Unique identifier for the review
- `review_text` (string): The actual review text content

Optional columns:
- `product_id` (string/number): Product identifier
- `product_name` (string): Product name
- `rating` (number): Numeric rating (1-5)
- `date` (string): Review date

#### JSON Format Requirements
```json
{
  "reviews": [
    {
      "review_id": "1",
      "review_text": "Great product!",
      "product_id": "PROD001",
      "product_name": "Sample Product",
      "rating": 5,
      "date": "2024-01-15"
    }
  ]
}
```

#### Response
```json
{
  "success": true,
  "message": "File uploaded and analyzed successfully",
  "data": {
    "file_info": {
      "original_name": "reviews.csv",
      "size": 1024,
      "type": ".csv"
    },
    "summary": {
      "total_reviews": 40,
      "sentiment_distribution": {
        "positive": {
          "count": 15,
          "percentage": 38
        },
        "negative": {
          "count": 8,
          "percentage": 20
        },
        "neutral": {
          "count": 17,
          "percentage": 42
        }
      },
      "average_score": 1.2,
      "score_range": {
        "min": -5,
        "max": 8
      }
    },
    "reviews": [
      {
        "id": "1",
        "text": "Great product!",
        "cleaned_text": "great product",
        "score": 3,
        "label": "positive",
        "confidence": 0.3,
        "product_id": "PROD001",
        "product_name": "Sample Product",
        "rating": 5,
        "date": "2024-01-15"
      }
    ],
    "keywords": {
      "overall": [
        {
          "term": "product",
          "count": 25
        }
      ],
      "by_sentiment": {
        "positive": [
          {
            "term": "great",
            "count": 8
          }
        ],
        "negative": [
          {
            "term": "terrible",
            "count": 3
          }
        ],
        "neutral": [
          {
            "term": "average",
            "count": 5
          }
        ]
      }
    }
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### 2. GET /api/analyze/latest
Retrieve the most recent analysis result.

#### Request
- **Method**: GET
- **Headers**: None required

#### Response
```json
{
  "success": true,
  "data": {
    // Same structure as POST /api/analyze response data
  }
}
```

#### Error Response (No data available)
```json
{
  "success": false,
  "error": "No analysis data available. Please upload a file first."
}
```

## HTTP Status Codes

- **200**: Success
- **400**: Bad Request (invalid file, missing required fields, etc.)
- **404**: Not Found (no analysis data available for GET /latest)
- **500**: Internal Server Error

## Sentiment Analysis Details

### Sentiment Scoring
- Uses the `sentiment` npm library
- Scores range from approximately -10 to +10
- Labels are assigned based on score thresholds:
  - `positive`: score > 2
  - `negative`: score < -2
  - `neutral`: -2 ≤ score ≤ 2

### Text Processing
- HTML tags are removed
- Text is converted to lowercase
- Punctuation is normalized
- Excessive whitespace is cleaned

### Keyword Extraction
- Stopwords are filtered out
- Words shorter than 3 characters are excluded
- Pure numbers are excluded
- Keywords are ranked by frequency across all reviews

## Error Handling

The API returns descriptive error messages for common issues:
- File type validation
- File size limits
- Missing required columns
- Malformed CSV/JSON
- Empty files
- Server processing errors

## Rate Limiting
Currently no rate limiting is implemented. For production use, consider adding rate limiting middleware.

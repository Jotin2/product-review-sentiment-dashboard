# Product Review Sentiment Dashboard

Web app that visualizes customer sentiment from product reviews using NLP. Upload CSV or JSON files containing product reviews and get instant sentiment analysis with interactive visualizations.

## Features

- **File Upload**: Support for CSV and JSON files up to 10MB
- **Sentiment Analysis**: Automatic classification of reviews as positive, negative, or neutral
- **Interactive Visualizations**: Pie charts, bar charts, and keyword analysis
- **Review Table**: Sortable and filterable table of all analyzed reviews
- **Keyword Extraction**: Top keywords by sentiment with frequency analysis
- **Raw Data Display**: Collapsible JSON response for debugging

## Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd product-review-sentiment-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm start
   ```

This command runs both frontend and backend concurrently:
- **Backend** → `http://localhost:5000`
- **Frontend** → `http://localhost:3000`

### Manual Setup (Alternative)

If you prefer to run frontend and backend separately:

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm start
```

## Sample Data

Use the provided sample data file to test the dashboard:
- **Location**: `data/sample_reviews.csv`
- **Contains**: 40 sample product reviews with varied sentiment
- **Format**: CSV with columns: review_id, product_id, product_name, rating, review_text, date

## API Documentation

See [api.md](./api.md) for complete API documentation including:
- Request/response formats
- Error handling
- Sentiment analysis details
- File format requirements

## Demo Steps

1. **Start the application** using `npm start`
2. **Open browser** to `http://localhost:3000`
3. **Upload sample data**:
   - Click "Drop your file here or click to browse"
   - Select `data/sample_reviews.csv`
   - Click "Analyze Reviews"
4. **View results**:
   - Sentiment distribution charts
   - Keyword analysis
   - Review table with scores and labels
   - Raw JSON data (toggle "Show Raw Data")

## File Format Requirements

### CSV Format
Required columns:
- `review_id`: Unique identifier
- `review_text`: The review content

Optional columns:
- `product_id`, `product_name`, `rating`, `date`

### JSON Format
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

## Technology Stack

- **Frontend**: React, Tailwind CSS, Recharts
- **Backend**: Node.js, Express.js
- **NLP**: Sentiment analysis library
- **File Processing**: Multer, CSV parser

## Project Structure

```
├── backend/
│   ├── routes/          # API routes
│   ├── services/        # Business logic (sentiment, keywords)
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   └── App.js       # Main app component
│   └── public/          # Static assets
├── data/
│   └── sample_reviews.csv  # Sample data
└── api.md              # API documentation
```

## Troubleshooting

- **Port conflicts**: Ensure ports 3000 and 5000 are available
- **File upload errors**: Check file format and size (max 10MB)
- **Backend not responding**: Verify backend is running on port 5000
- **CORS issues**: Backend includes CORS middleware for development

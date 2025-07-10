# Incredible Playgroup Finder - Backend API

A Next.js backend API that serves playgroup data from Google Sheets to the Incredible Playgroup Finder mobile application.

## 🚀 Overview

This backend provides RESTful API endpoints that fetch and process playgroup data from Google Sheets, making it available for the React Native mobile application. The API includes caching mechanisms and data transformation utilities to ensure optimal performance.

## 📁 Project Structure

```
ipf-backend/
├── src/
│   └── app/
│       ├── api/
│       │   ├── sheets/
│       │   │   └── route.ts          # Google Sheets data endpoint
│       │   └── markers/
│       │       └── route.ts          # Map markers endpoint
│       └── utils/
│           ├── getSheetData.ts       # Google Sheets integration
│           ├── transformDataToObjects.ts  # Data transformation
│           ├── TTLCache.ts          # Caching utility
│           └── types.ts             # TypeScript interfaces
├── package.json
└── README.md
```

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **External APIs:** Google Sheets API
- **Caching:** Custom TTL Cache implementation
- **Authentication:** Google Service Account

## 🔧 Setup & Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Cloud Project with Sheets API enabled
- Google Service Account credentials

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd ipf-backend
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Sheets Configuration
GOOGLE_SHEETS_PROJECT_ID=your-project-id
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SHEET_ID=your-spreadsheet-id

# Optional: Base URL for development
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Google Sheets Setup

1. **Create a Google Cloud Project**
2. **Enable Google Sheets API**
3. **Create a Service Account**
4. **Download the JSON credentials**
5. **Share your Google Sheet with the service account email**

### 4. Run the Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 📡 API Endpoints

### 1. GET `/api/sheets`

Fetches raw playgroup data from Google Sheets.

**Response:**

```json
{
  "data": [
    {
      "id": "1",
      "Name": "Playgroup Name",
      "Address": "123 Main St",
      "lat": "40.7128",
      "lng": "-74.0060",
      "Age": "2-4 years",
      "Schedule": "Mon-Fri 9AM-12PM"
      // ... other fields
    }
  ]
}
```

### 2. GET `/api/markers`

Fetches processed map markers with valid coordinates and deduplication.

**Response:**

```json
{
  "markers": [
    {
      "id": "1",
      "Name": "Playgroup Name",
      "Address": "123 Main St",
      "lat": "40.7128",
      "lng": "-74.0060"
      // ... other fields
    }
  ]
}
```

**Features:**

- Filters out entries without valid lat/lng coordinates
- Deduplicates by address
- Optimized for map display

## 🔧 Core Utilities

### `getSheetData()`

- Fetches data from Google Sheets
- Implements 15-minute TTL caching
- Handles authentication and error management

### `transformDataToObjects()`

- Converts Google Sheets array format to objects
- Maps headers to object properties
- Handles data type conversion

### `TTLCache`

- Custom caching implementation
- Configurable time-to-live
- Memory-efficient storage

## 📊 Data Flow

1. **Request** → API endpoint
2. **Cache Check** → Check if data is cached
3. **Google Sheets** → Fetch fresh data if needed
4. **Transform** → Convert to usable format
5. **Cache** → Store for future requests
6. **Response** → Return processed data

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

### Environment Variables for Production

Ensure all Google Sheets environment variables are set in your deployment platform.

## 🔒 Security

- **Service Account Authentication:** Secure Google Sheets access
- **Environment Variables:** Sensitive data not in code
- **CORS:** Configure as needed for your frontend
- **Rate Limiting:** Consider implementing for production

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📝 API Documentation

### Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

**Status Codes:**

- `200` - Success
- `500` - Server error
- `404` - Endpoint not found

### Caching

- **Cache Duration:** 15 minutes
- **Cache Key:** "sheetData"
- **Cache Invalidation:** Automatic TTL expiration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

[Add your license information here]

## 🆘 Support

For issues and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the Incredible Playgroup Finder community**

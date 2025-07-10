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


## 📡 API Endpoints

### 1. GET `/api/sheets`

Fetches raw playgroup data from Google Sheets.

### 2. GET `/api/markers`

Fetches processed map markers with valid coordinates and deduplication.

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


### Caching

- **Cache Duration:** 15 minutes
- **Cache Key:** "sheetData"
- **Cache Invalidation:** Automatic TTL expiration


## [LICENSE](./LICENSE)

---

**Built with ❤️ for the Incredible Playgroup Finder community**

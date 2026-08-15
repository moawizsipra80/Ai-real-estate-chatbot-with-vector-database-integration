# 🏠 AI Real Estate Chatbot with Vector Database Integration

> An intelligent, full-stack real estate platform featuring a Retrieval-Augmented Generation (RAG) AI assistant, semantic vector search, and interactive property exploration.

---

## 📌 Overview

This project provides a modern real estate solution powered by AI. Users can browse property listings, search using natural language, view detailed property insights, and converse with an AI chatbot that leverages **Vector Database Integration** (RAG) to deliver accurate, contextual real estate recommendations.

---

## ✨ Key Features

- **🤖 AI Assistant (RAG Chatbot)**: Intelligent property recommendations and query answering powered by vector search.
- **⚡ Vector Database Search**: Fast, high-accuracy semantic similarity matching across property metadata, pricing, location, and amenities.
- **🏡 Interactive Property Listings**: Filter, search, and explore property cards with rich visual details.
- **💬 Real-Time Chat Experience**: Includes chat history management, quick suggestion pills, typing indicators, and markdown-rendered responses.
- **📱 Fully Responsive UI**: Designed with clean aesthetic styling, modern layouts, dark/light themes, and smooth micro-interactions.

---

## 🛠 Tech Stack

### **Backend**
- **Runtime & Language**: Node.js & TypeScript (`ts-node-dev`)
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose
- **Vector Search & AI**: Vector Indexing & AI Assistant Services
- **Utilities**: CORS, Dotenv

### **Frontend**
- **Framework & Build Tool**: React 18 & Vite (TypeScript)
- **Routing**: React Router DOM (v6)
- **UI & Icons**: Lucide React, Custom CSS Design System
- **Markdown Rendering**: `react-markdown`

---

## 📂 Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/       # Route handlers for property and AI requests
│   │   ├── models/            # MongoDB schema and models
│   │   ├── routes/            # Express endpoint routes
│   │   ├── seed/              # Sample property database seeder script
│   │   ├── services/          # AI Service and Vector Search implementation
│   │   ├── types/             # TypeScript data contracts
│   │   └── validators/        # Request payload validation logic
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/        # UI components (Navbar, Footer, AIChat, PropertyCard)
    │   ├── pages/             # Pages (PropertyListings, PropertyDetail, AIChatPage, AIHubPage)
    │   ├── services/          # API communication services
    │   ├── types/             # TypeScript interfaces
    │   ├── App.tsx            # Main App layout & routing
    │   └── index.css          # Core CSS design system
    ├── package.json
    └── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **npm** or **yarn**
- **MongoDB**: Local instance or MongoDB Atlas connection URI

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables (create .env file)
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/real-estate-ai

# Start the development server
npm run dev
```

The backend server will run on `http://localhost:5000`.

---

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend client will run on `http://localhost:5173`.

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/properties` | Fetch all properties with optional filters |
| **GET** | `/api/properties/:id` | Fetch details of a specific property |
| **POST** | `/api/ai/chat` | Send prompt to AI Assistant (Vector RAG Search) |
| **POST** | `/api/ai/recommendations` | Get AI-tailored property recommendations |

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

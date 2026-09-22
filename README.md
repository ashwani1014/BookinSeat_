# 🎬 CinemaBook - Movie Theater Seat Booking System

A production-minded, concurrency-safe movie theater seat booking web application built with Next.js, Express.js, MongoDB, and simulated payment processing.

## 🌟 Features

- **User Authentication**: Secure registration and login with JWT and bcrypt
- **Movie Browsing**: View available movies with details, ratings, and showtimes
- **Interactive Seat Map**: Visual seat selection with real-time availability
- **Concurrency-Safe Booking**: Atomic operations prevent duplicate bookings
- **Simulated Payment**: Test both success and failure payment scenarios
- **Booking Management**: View booking history and cancel pending bookings
- **Attractive UI**: Modern cinema-themed design with Tailwind CSS
- **Comprehensive Error Handling**: 25+ edge cases handled gracefully

## 🔑 Demo Testing Credentials (Dummy User)

For instant testing and evaluation without manual registration, use the preconfigured dummy user credentials:

| Field | Value |
| :--- | :--- |
| **Email** | `demo@seatflow.com` |
| **Password** | `password123` |
| **Name** | `Demo Tester` |
| **1-Click Login** | Click **"⚡ 1-Click Demo Login (Instant Access)"** on the `/login` page |

> **Tip:** You can also register a new account on [`/signup`](http://localhost:3000/signup) or [`/register`](http://localhost:3000/register).

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Axios
- js-cookie

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT (Next.js)                             │
│  Landing  │  Auth  │  Movies  │  Seat Map  │  Payment  │ Bookings│
└─────────────────────────────────────────────────────────────────┘
                              ↓ JWT in HTTP-only Cookie
┌─────────────────────────────────────────────────────────────────┐
│                   API GATEWAY (Express)                          │
│  Auth Middleware  │  Error Handler  │  Validation Middleware    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     Controllers Layer                            │
│  AuthController  │  MovieController  │  BookingController        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Services Layer                              │
│  AuthService  │  MovieService  │  BookingService (Concurrency)   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER (MongoDB)                        │
│  User  │  Movie  │  Seat  │  Booking (with unique index)       │
└─────────────────────────────────────────────────────────────────┘
```

### Concurrency Strategy

**Primary Defense: Atomic Database Operations**
- MongoDB's atomic `findOneAndUpdate()` operation
- Unique compound index on `Booking(movieId, seatId)`
- Database-level constraint prevents duplicate bookings

**Secondary Defense: Application Logic**
- Pre-save validation in Booking model
- Seat status management (available → held → booked)
- Booking expiration (15 minutes)
- Automatic seat release on payment failure

## 📁 Project Structure

```
BookingSeat/
├── backend/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── jwt.js               # JWT configuration
│   ├── middleware/
│   │   ├── auth.js              # JWT validation
│   │   ├── errorHandler.js     # Centralized error handling
│   │   └── validate.js          # Request validation
│   ├── models/
│   │   ├── User.js              # User model with password hashing
│   │   ├── Movie.js             # Movie model
│   │   ├── Seat.js              # Seat model with status management
│   │   └── Booking.js           # Booking model with unique index
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── movies.js            # Movie routes
│   │   ├── bookings.js          # Booking routes
│   │   └── payments.js          # Payment routes
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── movieController.js
│   │   ├── bookingController.js
│   │   └── paymentController.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── movieService.js
│   │   ├── bookingService.js    # Concurrency logic
│   │   └── paymentService.js    # Payment simulation
│   ├── utils/
│   │   └── errors.js            # Custom error classes
│   ├── scripts/
│   │   └── seed.js              # Database seeding
│   ├── server.js                # Express entry point
│   └── .env                     # Environment variables
├── frontend/
│   ├── app/
│   │   ├── layout.js            # Root layout with Navbar
│   │   ├── page.js              # Landing page
│   │   ├── login/
│   │   │   └── page.js          # Login page
│   │   ├── register/
│   │   │   └── page.js          # Registration page
│   │   ├── movies/
│   │   │   ├── page.js          # Movies list
│   │   │   └── [id]/
│   │   │       └── page.js      # Movie details + seat map
│   │   └── bookings/
│   │       ├── create/
│   │       │   └── page.js      # Booking creation + payment
│   │       └── page.js          # My bookings
│   ├── components/
│   │   ├── SeatMap.js           # Interactive seat map
│   │   ├── BookingSummary.js
│   │   └── common/
│   │       ├── Navbar.js
│   │       ├── LoadingSpinner.js
│   │       └── ErrorMessage.js
│   ├── lib/
│   │   ├── api.js               # API client functions
│   │   └── auth.js              # Auth utilities
│   ├── styles/
│   │   └── globals.css          # Tailwind + custom styles
│   └── .env.local               # Frontend env variables
├── tests/
│   ├── integration/
│   │   └── concurrency.test.js   # Critical concurrency tests
│   └── unit/                    # Unit tests (TODO)
├── memory.md                    # Project memory
├── decision.md                  # Design decisions
├── TEST_PLAN.md                 # Comprehensive test plan
└── README.md                    # This file
```

## 🗄️ Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Movie Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  genre: String (enum: Action, Comedy, Drama, etc.),
  duration: Number (required),
  rating: Number (0-5),
  showtime: Date (required),
  theater: String (required),
  totalSeats: Number,
  pricePerSeat: Number (required),
  rows: Number,
  seatsPerRow: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Seat Model
```javascript
{
  _id: ObjectId,
  movieId: ObjectId (required, ref: Movie),
  seatNumber: String (required),
  row: String (required),
  status: String (enum: available, selected, held, booked),
  heldBy: ObjectId (ref: User),
  heldAt: Date,
  bookedBy: ObjectId (ref: User),
  bookedAt: Date,
  price: Number (required),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Unique: movieId + seatNumber + row
- Index: movieId
- Index: status

### Booking Model
```javascript
{
  _id: ObjectId,
  movieId: ObjectId (required, ref: Movie),
  seatId: ObjectId (required, ref: Seat),
  userId: ObjectId (required, ref: User),
  status: String (enum: pending, confirmed, cancelled, failed),
  amount: Number (required),
  paymentStatus: String (enum: pending, completed, failed),
  expiresAt: Date (15 minutes from creation),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- **CRITICAL**: Unique compound index on movieId + seatId (prevents duplicate bookings)
- Index: userId
- Index: expiresAt + status

## 🔌 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- 400: Validation error
- 409: Email already exists

---

#### POST /api/auth/login
Login an existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- 400: Validation error
- 401: Invalid credentials

---

#### POST /api/auth/logout
Logout user (clears cookie).

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

#### GET /api/auth/me
Get current user details (requires authentication).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- 401: Not authenticated

---

### Movie Endpoints

#### GET /api/movies
Get all movies with pagination.

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 4,
    "pages": 1
  }
}
```

---

#### GET /api/movies/:movieId
Get movie details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "movie_id",
    "title": "The Dark Knight",
    "description": "...",
    "genre": "Action",
    "duration": 152,
    "rating": 4.8,
    "showtime": "2024-01-15T19:00:00.000Z",
    "theater": "Cinema Hall 1",
    "pricePerSeat": 12
  }
}
```

**Error Responses:**
- 404: Movie not found
- 400: Movie has already passed

---

#### GET /api/movies/:movieId/seats
Get all seats for a movie.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "movie": {...},
    "seats": [
      {
        "_id": "seat_id",
        "movieId": "movie_id",
        "seatNumber": "A1",
        "row": "A",
        "status": "available",
        "price": 12
      }
    ]
  }
}
```

---

#### GET /api/movies/:movieId/seats/available
Get only available seats for a movie.

**Response (200):**
```json
{
  "success": true,
  "data": [...]
}
```

---

### Booking Endpoints

#### POST /api/bookings
Create a new booking (requires authentication).

**Request Body:**
```json
{
  "movieId": "movie_id",
  "seatId": "seat_id"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "_id": "booking_id",
    "movieId": "movie_id",
    "seatId": "seat_id",
    "userId": "user_id",
    "status": "pending",
    "amount": 12,
    "paymentStatus": "pending",
    "expiresAt": "2024-01-01T00:15:00.000Z"
  }
}
```

**Error Responses:**
- 400: Validation error, seat doesn't belong to movie, movie has passed
- 401: Not authenticated
- 404: Movie or seat not found
- 409: **Seat is no longer available** (concurrency protection)

---

#### GET /api/bookings
Get user's bookings (requires authentication).

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

---

#### GET /api/bookings/:bookingId
Get booking details (requires authentication, user must own booking).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "booking_id",
    "movieId": {...},
    "seatId": {...},
    "userId": {...},
    "status": "confirmed",
    "amount": 12,
    "paymentStatus": "completed"
  }
}
```

**Error Responses:**
- 401: Not authenticated
- 403: Not authorized (doesn't own booking)
- 404: Booking not found

---

#### DELETE /api/bookings/:bookingId
Cancel a booking (requires authentication, user must own booking).

**Response (200):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {...}
}
```

**Error Responses:**
- 400: Cannot cancel confirmed booking
- 401: Not authenticated
- 403: Not authorized
- 404: Booking not found

---

### Payment Endpoints

#### POST /api/payments/bookings/:bookingId/payment
Process payment for a booking (requires authentication, user must own booking).

**Request Body:**
```json
{
  "success": true
}
```

**Note:** Set `success` to `false` to simulate payment failure.

**Response (200):**
```json
{
  "success": true,
  "message": "Payment successful! Your booking is confirmed.",
  "data": {
    "_id": "booking_id",
    "status": "confirmed",
    "paymentStatus": "completed"
  }
}
```

**Error Responses:**
- 400: Booking already paid/failed/expired
- 401: Not authenticated
- 403: Not authorized
- 404: Booking not found

---

#### GET /api/payments/bookings/:bookingId/payment/status
Get payment status for a booking (requires authentication).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "bookingId": "booking_id",
    "status": "confirmed",
    "paymentStatus": "completed",
    "amount": 12,
    "expiresAt": "2024-01-01T00:15:00.000Z",
    "isExpired": false
  }
}
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd BookingSeat
```

### 2. Setup MongoDB

**Option A: Local MongoDB**
1. Install MongoDB Community Edition: https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   - Windows: `net start MongoDB`
   - Mac/Linux: `mongod`
3. MongoDB will run on `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier)
3. Get connection string from Atlas dashboard
4. Whitelist your IP address in Atlas Network Access

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/movie-booking
# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movie-booking?retryWrites=true&w=majority

# Other environment variables
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=1h
NODE_ENV=development

# Seed database with sample movies
node scripts/seed.js

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
# Copy this content:
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start frontend development server
npm run dev
```

Frontend will run on `http://localhost:3000`
 
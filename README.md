# 🛒 E-Commerce Full-Stack Application

A complete **full-stack e-commerce platform** with role-based access control (Admin/User), built with modern technologies and deployed via Docker containers.

[![CI/CD Pipeline](https://github.com/kriaa9/ecommerce-Full-Stack/actions/workflows/ci.yml/badge.svg)](https://github.com/kriaa9/ecommerce-Full-Stack/actions)

---

## 📋 Table of Contents

- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Data Model](#-data-model)
- [Security & Authentication](#-security--authentication)
- [How It Works](#-how-it-works)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│                      Port: 5173 (Nginx:80)                       │
├─────────────────────────────────────────────────────────────────┤
│                              ↕ REST API                          │
├─────────────────────────────────────────────────────────────────┤
│                   BACKEND (Spring Boot)                          │
│                        Port: 8080                                │
├─────────────────────────────────────────────────────────────────┤
│                              ↕ JDBC                              │
├─────────────────────────────────────────────────────────────────┤
│              DATABASE (Supabase PostgreSQL)                      │
│                Transaction Pooler: 6543                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Technology Stack

### Backend (Spring Boot 3.5.9)

| Technology | Purpose |
|------------|---------|
| **Java 21** | Programming language (LTS) |
| **Spring Boot 3.5.9** | Application framework |
| **Spring Security** | Authentication & authorization |
| **Spring Data JPA** | Database ORM |
| **JWT (jjwt 0.12.6)** | Token-based authentication |
| **PostgreSQL 16** | Relational database |
| **Supabase** | Cloud PostgreSQL hosting (PgBouncer) |
| **Cloudinary** | Image upload & CDN storage |
| **Lombok** | Boilerplate reduction |
| **SpringDoc OpenAPI** | API documentation (Swagger UI) |
| **Micrometer + Prometheus** | Metrics & monitoring |
| **Maven** | Build tool |

### Frontend (React 19)

| Technology | Purpose |
|------------|---------|
| **React 19.2** | UI library |
| **Vite 7.2** | Build tool & dev server |
| **React Router 7.12** | Client-side routing |
| **Axios 1.13** | HTTP client |
| **MUI (Material-UI) 7.3** | UI component library |
| **Redux Toolkit 2.11** | State management |
| **React Hook Form 7.71** | Form handling |
| **Bootstrap 5.3** | Additional styling |

### DevOps & Infrastructure

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Frontend static file server |
| **GitHub Actions** | CI/CD pipeline |
| **OWASP Dependency Check** | Security vulnerability scanning |
| **Trivy** | Container image scanning |

---

## 📂 Project Structure

```
ecommerce/
├── backend/                    # Spring Boot API
│   ├── src/main/java/com/ecommerce/backend/
│   │   ├── auth/              # Login/Register logic
│   │   ├── config/            # Security, Cloudinary, CORS
│   │   ├── controller/        # REST API endpoints
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── exception/         # Global exception handling
│   │   ├── model/             # JPA Entities
│   │   ├── repository/        # Database access layer
│   │   ├── security/          # JWT filters & services
│   │   └── service/           # Business logic
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── api/               # API service files
│   │   ├── auth/              # Login/Register pages
│   │   ├── catalog/           # Product catalog
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React Context (Cart)
│   │   ├── pages/             # User pages
│   │   ├── profile/           # User profile
│   │   └── utils/             # Utilities (logger)
│   ├── Dockerfile
│   └── package.json
│
├── .github/workflows/          # CI/CD pipeline
├── docker-compose.yml          # Container orchestration
└── README.md
```

---

## 🗄️ Data Model

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│     User     │     │   Category   │     │   Product    │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id           │     │ id           │     │ id           │
│ email        │     │ name         │     │ name         │
│ password     │     │ description  │     │ description  │
│ firstName    │     └──────────────┘     │ sku          │
│ lastName     │            │             │ price        │
│ role (ADMIN/ │            │             │ stockQuantity│
│       USER)  │            └─────────────│ categoryId   │
│ profilePhoto │                          │ imageUrls[]  │
│ gender       │                          │ active       │
│ address      │                          └──────────────┘
│ telephone    │                                 │
└──────────────┘                                 │
       │                                         │
       │ places                                  │ contains
       ▼                                         ▼
┌──────────────┐                          ┌──────────────┐
│    Order     │──────────────────────────│  OrderItem   │
├──────────────┤                          ├──────────────┤
│ id           │                          │ id           │
│ userId       │                          │ orderId      │
│ status       │                          │ productId    │
│ totalAmount  │                          │ quantity     │
│ shippingAddr │                          │ priceAtTime  │
│ paymentMethod│                          └──────────────┘
│ createdAt    │
└──────────────┘

┌──────────────┐
│ Notification │
├──────────────┤
│ id           │
│ userId       │
│ message      │
│ type         │
│ read         │
│ createdAt    │
└──────────────┘
```

### Entities Overview

| Entity | Description |
|--------|-------------|
| **User** | Customer or admin account with profile information |
| **Category** | Product groupings (Electronics, Clothing, etc.) |
| **Product** | Items for sale with images, pricing, and inventory |
| **Order** | Customer purchases with status tracking |
| **OrderItem** | Individual items within an order |
| **Notification** | System messages for users and admins |

---

## 🔐 Security & Authentication

### JWT Authentication Flow

```
1. User → POST /api/v1/auth/authenticate (email, password)
2. Server validates credentials → Returns JWT token
3. Client stores token in localStorage
4. All API requests include: Authorization: Bearer <token>
5. Server validates JWT signature and expiration on each request
6. Token expires after 24 hours (configurable)
```

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| `ROLE_USER` | Browse products, manage cart, checkout, view orders, edit profile |
| `ROLE_ADMIN` | Manage products, categories, orders, view dashboard stats |

### Route Protection (Frontend)

| Route Type | Routes | Access |
|------------|--------|--------|
| **Public** | `/`, `/products`, `/cart`, `/login`, `/register` | Everyone |
| **ProtectedRoute** | `/profile` | Any authenticated user |
| **UserOnlyRoute** | `/checkout`, `/orders`, `/notifications` | Users only (not admins) |
| **AdminRoute** | `/admin/*` | Admins only |

### Security Features

| Feature | Implementation |
|---------|----------------|
| Password hashing | BCrypt encoder |
| JWT expiration validation | Client-side token check |
| CORS protection | Configured allowed origins |
| OWASP CVE scanning | GitHub Actions pipeline |
| Production logging disabled | Custom logger utility |
| Token auto-cleanup | Expired tokens removed from localStorage |

---

## 🔄 How It Works

### User Flow

```
1. User registers or logs in → JWT token issued
2. Browse product catalog → Public API (no auth required)
3. Add items to cart → Stored in browser localStorage
4. Proceed to checkout → Creates order in database
5. View order history → Fetches user's orders via API
6. Receive notifications → Order status updates
```

### Admin Flow

```
1. Admin logs in → JWT with ROLE_ADMIN
2. Access dashboard → View stats (products, orders, inventory value)
3. Manage categories → Create, update, delete categories
4. Manage products → CRUD operations + image upload to Cloudinary
5. Manage orders → View all orders, update status
6. Receive notifications → New order alerts
```

---

## 🌐 API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | Public |
| POST | `/authenticate` | Login, receive JWT | Public |
| POST | `/logout` | Invalidate session | Required |

### Users (`/api/v1/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/me` | Get current user profile | Required |
| PUT | `/me` | Update profile | Required |
| DELETE | `/me` | Delete account | Required |
| POST | `/me/photo` | Upload profile photo | Required |
| DELETE | `/me/photo` | Remove profile photo | Required |

### Products (`/api/v1/products`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List all products | Public |
| GET | `/{id}` | Get product details | Public |
| POST | `/` | Create product | Admin |
| PUT | `/{id}` | Update product | Admin |
| DELETE | `/{id}` | Delete product | Admin |

### Categories (`/api/v1/categories`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List all categories | Public |
| GET | `/{id}` | Get category details | Public |
| POST | `/` | Create category | Admin |
| PUT | `/{id}` | Update category | Admin |
| DELETE | `/{id}` | Delete category | Admin |

### Orders (`/api/v1/orders`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Place new order | User |
| GET | `/my-orders` | Get user's order history | User |

### Admin Orders (`/api/v1/admin/orders`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all orders | Admin |
| PATCH | `/{id}/status` | Update order status | Admin |

### Admin Stats (`/api/v1/admin`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/stats` | Get dashboard statistics | Admin |

---

## 🚀 Getting Started

### Prerequisites

- **Java 21** (JDK)
- **Node.js 18+** (with npm)
- **Docker & Docker Compose** (for containerized deployment)
- **PostgreSQL** (or use Supabase)

### Local Development

#### Backend

```bash
cd backend

# Set environment variables
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/ecommerce
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=your_password
export JWT_SECRET_KEY=your_secret_key

# Run with Maven
./mvnw spring-boot:run
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### API Documentation

Once the backend is running, access Swagger UI at:
```
http://localhost:8080/swagger-ui.html
```

---

## 🐳 Deployment

### Docker Compose

```bash
# Create .env file with required variables
cp .env.example .env

# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| `postgres` | 5432 | PostgreSQL database |
| `backend` | 8080 | Spring Boot API |
| `frontend` | 5173 | React app (Nginx) |

### Health Checks

- **Backend**: `http://localhost:8080/actuator/health`
- **Database**: `pg_isready` command

---

## ⚙️ Environment Variables

### Backend

| Variable | Description | Required |
|----------|-------------|----------|
| `SPRING_DATASOURCE_URL` | PostgreSQL connection URL | ✅ |
| `SPRING_DATASOURCE_USERNAME` | Database username | ✅ |
| `SPRING_DATASOURCE_PASSWORD` | Database password | ✅ |
| `JWT_SECRET_KEY` | Secret for signing JWTs | ✅ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | ❌ |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8080` |

---

## 🗄️ Database Setup (Supabase)

### Using Supabase Transaction Pooler

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Project Settings > Database > Connection Pooler**
3. Copy the **Transaction Pooler** connection string
4. Use these values:
   - **URL**: `jdbc:postgresql://aws-0-<region>.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0`
   - **Username**: `postgres.<project-ref>`
   - **Password**: Your database password

> ⚠️ **Important:** Use port `6543` (Transaction Pooler) for IPv4 compatibility. Add `prepareThreshold=0` for PgBouncer compatibility.

---

## 🔐 Default Admin Account

When the application starts, it creates a default admin user:

| Field | Value |
|-------|-------|
| Email | `admin@ecommerce.com` |
| Password | `admin123` |

> ⚠️ **Change this password in production!**

---

## 🔧 CI/CD Pipeline

The GitHub Actions pipeline runs on every push:

1. **Backend Build & Test** - Maven build with tests
2. **OWASP Dependency Check** - Security vulnerability scanning
3. **Frontend Build** - npm build and lint
4. **Docker Build & Scan** - Build images and scan with Trivy
5. **Push to GHCR** - Push images to GitHub Container Registry

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `SUPABASE_DB_URL` | Supabase connection URL |
| `SUPABASE_DB_USER` | Supabase username |
| `SUPABASE_DB_PASSWORD` | Supabase password |
| `JWT_SECRET_KEY` | JWT signing key |

---

## 📊 Monitoring

- **Spring Actuator**: Health checks at `/actuator/health`
- **Prometheus Metrics**: Available at `/actuator/prometheus`
- **Application Logs**: Production-safe logging (no sensitive data)

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
./mvnw test
```

### Frontend Linting

```bash
cd frontend
npm run lint
```

---

## 📝 License

This project is licensed under the MIT License.

---

## 👤 Author

**kriaa9** - [GitHub](https://github.com/kriaa9)

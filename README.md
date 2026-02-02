# 🛒 E-Commerce Full Stack Application

A full-stack e-commerce application built with **Spring Boot** (backend) and **React + Vite** (frontend).

## 📋 Tech Stack

### Backend
- **Java 21** with **Spring Boot 3.5.x**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **PostgreSQL** (Supabase or local)
- **Cloudinary** for image uploads

### Frontend
- **React 18** with **Vite**
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management

### DevOps
- **Docker** & **Docker Compose**
- **GitHub Actions** CI/CD pipeline
- **OWASP Dependency Check** for security scanning
- **Trivy** for container scanning

---

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node.js 20+
- Docker & Docker Compose (optional)
- Supabase account (or local PostgreSQL)

### 1. Clone the Repository
```bash
git clone https://github.com/kriaa9/ecommerce-Full-Stack.git
cd ecommerce-Full-Stack
```

### 2. Configure Environment Variables

Copy the example environment file and fill in your values:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```properties
# Supabase Database (use Transaction Pooler for IPv4 compatibility)
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-0-<region>.pooler.supabase.com:6543/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=postgres.<your-project-ref>
SPRING_DATASOURCE_PASSWORD=your_password

# JWT Secret (min 256 bits)
JWT_SECRET_KEY=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run the Application

#### Option A: Using Docker Compose (Supabase)
```bash
docker-compose -f docker-compose.supabase.yml up -d
```

#### Option B: Using Docker Compose (Local PostgreSQL)
```bash
docker-compose up -d
```

#### Option C: Run Locally (Development)

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080
- **API Health:** http://localhost:8080/actuator/health

---

## 🗄️ Database Setup

### Using Supabase (Recommended)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Project Settings > Database > Connection Pooler**
3. Copy the **Transaction Pooler** connection string
4. Use these values in your `.env`:
   - URL: `jdbc:postgresql://aws-0-<region>.pooler.supabase.com:6543/postgres?sslmode=require`
   - Username: `postgres.<project-ref>` (note the project ref after the dot)
   - Password: Your database password

> ⚠️ **Important:** Use the **Transaction Pooler** URL (port 6543) for IPv4 compatibility. The direct connection only supports IPv6.

### Using Local PostgreSQL

If running with `docker-compose.yml`, a local PostgreSQL container is included.

---

## 🔐 Default Admin Account

When the application starts, it creates a default admin user:

| Field | Value |
|-------|-------|
| Email | `admin@ecommerce.com` |
| Password | `admin123` |

> ⚠️ Change this password in production!

---

## 🔧 CI/CD Pipeline

The GitHub Actions pipeline runs on every push to `main` or `dev`:

1. **Backend Build & Test** - Maven build with tests
2. **OWASP Dependency Check** - Security vulnerability scanning
3. **Frontend Build** - npm build and lint
4. **Docker Build & Scan** - Build images and scan with Trivy
5. **Push to GHCR** - Push images to GitHub Container Registry

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `SUPABASE_DB_URL` | `jdbc:postgresql://aws-0-<region>.pooler.supabase.com:6543/postgres?sslmode=require` |
| `SUPABASE_DB_USER` | `postgres.<project-ref>` |
| `SUPABASE_DB_PASSWORD` | Your Supabase database password |
| `JWT_SECRET_KEY` | JWT signing key (optional, has fallback for CI) |

---

## 📁 Project Structure

```
ecommerce/
├── backend/                 # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/       # Java source files
│   │   │   └── resources/  # Configuration files
│   │   └── test/           # Test files
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                # React application
│   ├── src/
│   │   ├── api/            # API service files
│   │   ├── auth/           # Authentication pages
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context providers
│   │   └── pages/          # Page components
│   ├── Dockerfile
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci-cd.yml       # GitHub Actions pipeline
├── docker-compose.yml       # Local PostgreSQL setup
├── docker-compose.supabase.yml  # Supabase setup
└── .env.example            # Environment template
```

---

## 📝 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/{id}` | Get product by ID |
| POST | `/api/admin/products` | Create product (Admin) |
| PUT | `/api/admin/products/{id}` | Update product (Admin) |
| DELETE | `/api/admin/products/{id}` | Delete product (Admin) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| POST | `/api/admin/categories` | Create category (Admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get user orders |
| POST | `/api/orders` | Create order |
| GET | `/api/admin/orders` | List all orders (Admin) |

---

## 🛡️ Security

- **JWT Authentication** with refresh tokens
- **OWASP Dependency Check** for Java dependencies
- **npm audit** for Node.js dependencies
- **Trivy** for Docker image scanning
- **SSL/TLS** required for database connections

---

## 📄 License

This project is licensed under the MIT License.
